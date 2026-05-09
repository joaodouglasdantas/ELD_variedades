import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Upload, Star, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProdutos,
});

type ProductColor = { name: string; hex: string };
type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  active: boolean;
  featured: boolean;
  colors: ProductColor[];
  sizes: string[];
  product_images: { id: string; url: string; storage_path: string | null; sort_order: number }[];
};

function AdminProdutos() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(id, url, storage_path, sort_order)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ProductRow[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories-list"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data ?? [],
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-products"] });

  const del = async (p: ProductRow) => {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    // Delete storage files
    const paths = p.product_images.map((i) => i.storage_path).filter(Boolean) as string[];
    if (paths.length) await supabase.storage.from("product-images").remove(paths);
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Excluído");
    refresh();
  };

  const toggleActive = async (p: ProductRow) => {
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl">Produtos</h1>
          <p className="text-muted-foreground mt-1">Cadastre, edite e gerencie suas peças.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-gradient-rose text-primary-foreground px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-card">
          <Plus className="h-4 w-4" /> Novo produto
        </button>
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          categories={categories ?? []}
          userId={user!.id}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { refresh(); setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="grid gap-3">
        {products?.map((p) => {
          const cover = p.product_images.sort((a, b) => a.sort_order - b.sort_order)[0];
          return (
            <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-gradient-blossom flex-shrink-0">
                {cover && <img src={cover.url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg truncate">{p.name}</h3>
                  {p.featured && <Star className="h-4 w-4 text-primary fill-primary" />}
                  {!p.active && <span className="text-xs bg-muted px-2 py-0.5 rounded">Oculto</span>}
                </div>
                <p className="text-primary font-medium">{brl(Number(p.price))}</p>
                <p className="text-xs text-muted-foreground">{p.product_images.length} foto(s)</p>
              </div>
              <button onClick={() => toggleActive(p)} className="p-2 hover:bg-secondary rounded" title={p.active ? "Ocultar" : "Mostrar"}>
                {p.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 hover:bg-secondary rounded"><Edit className="h-4 w-4" /></button>
              <button onClick={() => del(p)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
        {products?.length === 0 && <p className="text-center text-muted-foreground py-12">Nenhum produto cadastrado ainda.</p>}
      </div>
    </div>
  );
}

function ProductForm({
  initial, categories, userId, onClose, onSaved,
}: {
  initial: ProductRow | null;
  categories: any[];
  userId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? []);
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState<ProductColor[]>(initial?.colors ?? []);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#f5b8c8");
  const [images, setImages] = useState(initial?.product_images.sort((a, b) => a.sort_order - b.sort_order) ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addSizes = () => {
    const parts = sizeInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    setSizes((cur) => Array.from(new Set([...cur, ...parts])));
    setSizeInput("");
  };
  const removeSize = (s: string) => setSizes((cur) => cur.filter((x) => x !== s));
  const addColor = () => {
    const n = colorName.trim();
    if (!n) return;
    if (colors.some((c) => c.name.toLowerCase() === n.toLowerCase())) return;
    setColors((cur) => [...cur, { name: n, hex: colorHex }]);
    setColorName("");
  };
  const removeColor = (n: string) => setColors((cur) => cur.filter((c) => c.name !== n));


  const productId = initial?.id;

  const upload = async (files: FileList) => {
    if (!productId) {
      toast.error("Salve o produto primeiro para adicionar fotos.");
      return;
    }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/${productId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
        const { data: row, error } = await supabase.from("product_images").insert({
          product_id: productId, url: pub.publicUrl, storage_path: path, sort_order: images.length,
        }).select().single();
        if (error) throw error;
        setImages((cur) => [...cur, row as any]);
      }
      toast.success("Foto(s) enviada(s)");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (img: { id: string; storage_path: string | null }) => {
    if (img.storage_path) await supabase.storage.from("product-images").remove([img.storage_path]);
    await supabase.from("product_images").delete().eq("id", img.id);
    setImages((cur) => cur.filter((i) => i.id !== img.id));
  };

  const save = async () => {
    if (name.trim().length < 2) return toast.error("Nome obrigatório");
    const priceNum = parseFloat(price.replace(",", "."));
    if (isNaN(priceNum) || priceNum < 0) return toast.error("Preço inválido");
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        price: priceNum,
        category_id: categoryId || null,
        active,
        featured,
        sizes,
        colors: colors as any,
      };
      if (initial) {
        const { error } = await supabase.from("products").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Produto atualizado");
        onSaved();
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select().single();
        if (error) throw error;
        toast.success("Produto criado! Adicione fotos agora.");
        // Re-open form in edit mode so they can add images
        window.location.hash = data.id;
        onSaved();
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 grid place-items-center p-4 overflow-auto">
      <div className="bg-card rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-card border-b border-border p-5 flex justify-between items-center">
          <h2 className="font-display text-2xl">{initial ? "Editar produto" : "Novo produto"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Nome</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={1000} className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Preço (R$)</span>
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0,00" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Categoria</span>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary">
                <option value="">— sem categoria —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              <span className="text-sm">Visível na loja</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <span className="text-sm">Destaque na home</span>
            </label>
          </div>

          {/* Images */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Fotos</span>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={!productId || uploading}
                className="text-sm bg-secondary px-3 py-1.5 rounded-lg inline-flex items-center gap-2 hover:bg-accent transition disabled:opacity-50"
              >
                <Upload className="h-3 w-3" /> {uploading ? "Enviando..." : "Adicionar fotos"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && upload(e.target.files)} />
            </div>
            {!productId && <p className="text-xs text-muted-foreground">Salve o produto primeiro para adicionar fotos.</p>}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(img)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-full border">Fechar</button>
          <button onClick={save} disabled={saving} className="px-6 py-2 rounded-full bg-gradient-rose text-primary-foreground disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
