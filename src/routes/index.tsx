import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-white.png";
import { Sparkles, Heart, Truck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: products } = useQuery({
    queryKey: ["home-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, product_images(url, sort_order)")
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.url ?? null,
      }));
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["home-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-blossom" />
          <div className="container mx-auto px-4 py-20 md:py-28 relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/70 backdrop-blur text-xs text-primary font-medium border border-border/60">
                <Sparkles className="h-3 w-3" /> Novidades toda semana
              </span>
              <h1 className="mt-5 font-display text-6xl md:text-7xl leading-[1.05] text-foreground">
                Variedades escolhidas <span className="font-script text-primary block mt-2">com carinho</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-md">
                Roupas, perfumes e muito mais. Monte seu carrinho e finalize direto no WhatsApp — fácil, rápido e pessoal.
              </p>
              <div className="mt-8 flex gap-3">
                <Link to="/produtos" className="px-6 py-3 rounded-full bg-gradient-rose text-primary-foreground shadow-soft hover:opacity-90 transition">
                  Ver produtos
                </Link>
                <Link to="/produtos" className="px-6 py-3 rounded-full border border-border bg-card hover:bg-secondary transition">
                  Categorias
                </Link>
              </div>
            </div>
            <div className="relative hidden md:flex justify-center">
              <div className="absolute inset-0 bg-gradient-rose blur-3xl opacity-20 rounded-full" />
              <img src={logo} alt="Logo Eunice Luzia Dantas" className="relative w-[600px] max-w-full drop-shadow-2xl" />
            </div>
          </div>
        </section>

        {/* Categorias */}
        {categories && categories.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="font-display text-3xl text-center">Categorias</h2>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((c) => (
                <Link key={c.id} to="/produtos" search={{ cat: c.slug }} className="group bg-card border border-border rounded-2xl p-6 text-center hover:shadow-card hover:-translate-y-1 transition">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gradient-rose grid place-items-center text-primary-foreground group-hover:scale-110 transition">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div className="font-display text-lg">{c.name}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Destaques */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-script text-primary text-lg">selecionados</p>
              <h2 className="font-display text-3xl">Destaques da loja</h2>
            </div>
            <Link to="/produtos" className="text-sm text-primary hover:underline">Ver todos →</Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-blossom rounded-3xl">
              <p className="font-display text-xl">Em breve, novos produtos!</p>
              <p className="text-sm text-muted-foreground mt-2">A loja está sendo organizada com muito carinho.</p>
            </div>
          )}
        </section>

        {/* Como funciona */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { i: Sparkles, t: "Escolha seus favoritos", d: "Navegue pelo catálogo e adicione ao carrinho." },
              { i: Heart, t: "Finalize pelo WhatsApp", d: "Ajuste quantidades e envie o pedido em um clique." },
              { i: Truck, t: "Entrega ou retirada", d: "Combine pagamento (PIX, dinheiro ou cartão) direto com a loja." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="bg-card border border-border rounded-2xl p-6">
                <div className="h-10 w-10 rounded-full bg-gradient-rose grid place-items-center text-primary-foreground mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl">{t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
