import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategorias,
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminCategorias() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);

  const { data: cats } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const save = async () => {
    if (name.trim().length < 2) return toast.error("Nome muito curto");
    if (editing) {
      const { error } = await supabase.from("categories").update({ name: name.trim(), slug: slugify(name) }).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Categoria atualizada");
    } else {
      const { error } = await supabase.from("categories").insert({ name: name.trim(), slug: slugify(name) });
      if (error) return toast.error(error.message);
      toast.success("Categoria criada");
    }
    setName(""); setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const del = async (id: string) => {
    if (!confirm("Excluir esta categoria? Os produtos ficarão sem categoria.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Excluída");
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Categorias</h1>
      <p className="text-muted-foreground mt-1">Organize seus produtos por tipo.</p>

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mt-6 flex flex-wrap gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Perfumes, Camisas, Blusas" maxLength={50} className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary text-sm" />
        <button onClick={save} className="bg-gradient-rose text-primary-foreground px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm flex-shrink-0">
          <Plus className="h-4 w-4" /> {editing ? "Atualizar" : "Adicionar"}
        </button>
        {editing && <button onClick={() => { setEditing(null); setName(""); }} className="px-4 py-2 rounded-lg border text-sm flex-shrink-0">Cancelar</button>}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {cats?.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-display text-lg">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.slug}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing({ id: c.id, name: c.name }); setName(c.name); }} className="p-2 hover:bg-secondary rounded"><Edit className="h-4 w-4" /></button>
              <button onClick={() => del(c.id)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {cats?.length === 0 && <p className="text-muted-foreground text-sm col-span-3">Nenhuma categoria ainda.</p>}
      </div>
    </div>
  );
}
