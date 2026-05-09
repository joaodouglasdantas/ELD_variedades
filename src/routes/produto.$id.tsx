import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/produto/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug), product_images(url, sort_order)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen"><Header /><p className="text-center py-20">Carregando...</p></div>;
  }
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col"><Header />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <p>Produto não encontrado.</p>
          <Link to="/produtos" className="text-primary underline mt-4 inline-block">Voltar ao catálogo</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = (product.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const cur = images[imgIdx];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/produtos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-blossom shadow-card">
              {cur ? (
                <img src={cur.url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center font-script text-3xl text-muted-foreground/50">sem foto</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {images.map((im: any, i: number) => (
                  <button key={im.id ?? i} onClick={() => setImgIdx(i)} className={`aspect-square rounded-lg overflow-hidden border-2 transition ${i === imgIdx ? "border-primary" : "border-transparent"}`}>
                    <img src={im.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.categories && (
              <Link to="/produtos" search={{ cat: product.categories.slug }} className="text-xs uppercase tracking-wider text-primary">
                {product.categories.name}
              </Link>
            )}
            <h1 className="font-display text-4xl mt-2">{product.name}</h1>
            <p className="text-3xl text-primary font-medium mt-4">{brl(Number(product.price))}</p>
            {product.description && (
              <p className="mt-6 text-muted-foreground whitespace-pre-line leading-relaxed">{product.description}</p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary rounded-l-full"><Minus className="h-4 w-4" /></button>
                <span className="px-4 min-w-10 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary rounded-r-full"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={() => {
                  cart.add({ id: product.id, name: product.name, price: Number(product.price), image: cur?.url }, qty);
                  toast.success("Adicionado ao carrinho!");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-rose text-primary-foreground px-6 py-3 rounded-full shadow-soft hover:opacity-90 transition"
              >
                <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
