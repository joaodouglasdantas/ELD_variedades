import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
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
<<<<<<< HEAD
      return data.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        images:
          p.product_images
            ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((i: any) => i.url) ?? [],
      }));
=======
      return data.map((p) => {
        const imgs =
          p.product_images
            ?.slice()
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((i: any) => i.url) ?? [];
        return {
          id: p.id,
          name: p.name,
          price: Number(p.price),
          image: imgs[0] ?? null,
          images: imgs,
        };
      });
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["home-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const heroBg =
    "linear-gradient(to right, oklch(0.97 0.03 350) 0%, oklch(0.88 0.08 355) 45%, oklch(0.9 0.05 340) 100%)";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: heroBg }} />
          <div className="container mx-auto px-4 py-12 md:py-28 relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/70 backdrop-blur text-xs text-primary font-medium border border-border/60">
                <Sparkles className="h-3 w-3" /> Novidades toda semana
              </span>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-foreground">
                Variedades escolhidas{" "}
                <span className="font-script text-primary block mt-2">com carinho</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-md">
                Roupas, perfumes e muito mais. Monte seu carrinho e finalize direto no
                WhatsApp — facil, rapido e pessoal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/produtos"
                  className="px-6 py-3 rounded-full bg-gradient-rose text-primary-foreground shadow-soft hover:opacity-90 transition"
                >
                  Ver produtos
                </Link>
                <Link
                  to="/produtos"
                  className="px-6 py-3 rounded-full border border-border bg-card hover:bg-secondary transition"
                >
                  Categorias
                </Link>
              </div>
            </div>
            <div className="relative hidden md:flex justify-center items-center">
              <img
                src={logo}
                alt="Logo Eunice Luzia Dantas"
                className="relative w-[600px] max-w-full"
              />
            </div>
          </div>
        </section>
        {categories && categories.length > 0 && (
          <section className="container mx-auto px-3 sm:px-4 py-10 sm:py-16">
            <h2 className="font-display text-2xl sm:text-3xl text-center">Categorias</h2>
            <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/produtos"
                  search={{ cat: c.slug }}
                  className="group bg-card border border-border rounded-2xl p-4 sm:p-6 text-center hover:shadow-card hover:-translate-y-1 transition min-w-0"
                >
                  <div className="mx-auto mb-3 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-rose grid place-items-center text-primary-foreground group-hover:scale-110 transition flex-shrink-0">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="font-display text-base sm:text-lg truncate">{c.name}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
        <section className="container mx-auto px-3 sm:px-4 py-10 sm:py-16">
          <div className="flex items-end justify-between mb-6 sm:mb-8 gap-2">
            <div className="min-w-0">
              <p className="font-script text-primary text-lg">selecionados</p>
              <h2 className="font-display text-2xl sm:text-3xl truncate">Destaques da loja</h2>
            </div>
            <Link to="/produtos" className="text-sm text-primary hover:underline flex-shrink-0">
              Ver todos
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-gradient-blossom rounded-3xl px-4">
              <p className="font-display text-lg sm:text-xl">Em breve, novos produtos!</p>
              <p className="text-sm text-muted-foreground mt-2">
                A loja esta sendo organizada com muito carinho.
              </p>
            </div>
          )}
        </section>
        <section className="container mx-auto px-3 sm:px-4 py-10 sm:py-16">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                i: Sparkles,
                t: "Escolha seus favoritos",
                d: "Navegue pelo catalogo e adicione ao carrinho.",
              },
              {
                i: Heart,
                t: "Finalize pelo WhatsApp",
                d: "Ajuste quantidades e envie o pedido em um clique.",
              },
              {
                i: Truck,
                t: "Entrega ou retirada",
                d: "Combine pagamento (PIX, dinheiro ou cartao) direto com a loja.",
              },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <div className="h-10 w-10 rounded-full bg-gradient-rose grid place-items-center text-primary-foreground mb-4 flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg sm:text-xl">{t}</h3>
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
