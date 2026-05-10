import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

const search = z.object({ cat: z.string().optional() });

export const Route = createFileRoute("/produtos")({
  validateSearch: (s) => search.parse(s),
  component: ProductsPage,
});

function ProductsPage() {
  const { cat } = Route.useSearch();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", cat ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("id, name, price, category_id, product_images(url, sort_order)")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (cat && categories) {
        const c = categories.find((x) => x.slug === cat);
        if (c) q = q.eq("category_id", c.id);
      }
      const { data, error } = await q;
      if (error) throw error;
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
    },
    enabled: !cat || !!categories,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <header className="text-center mb-8">
          <p className="font-script text-primary text-lg">nosso catalogo</p>
          <h1 className="font-display text-3xl sm:text-4xl">Produtos</h1>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Link
            to="/produtos"
            className={
              "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm border transition max-w-[130px] truncate " +
              (!cat
                ? "bg-foreground text-background border-foreground"
                : "bg-card hover:bg-secondary border-border")
            }
          >
            Todos
          </Link>
          {categories?.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ cat: c.slug }}
              className={
                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm border transition max-w-[130px] truncate " +
                (cat === c.slug
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card hover:bg-secondary border-border")
              }
            >
              {c.name}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Carregando...</p>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-blossom rounded-3xl px-4">
            <p className="font-display text-xl">Nenhum produto nesta categoria ainda.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
