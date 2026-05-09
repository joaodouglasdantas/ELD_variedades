import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Tag, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [p, c] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
      ]);
      return { products: p.count ?? 0, categories: c.count ?? 0 };
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Bem-vinda 🌸</h1>
      <p className="text-muted-foreground mt-1">Aqui você gerencia tudo da sua loja.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Link to="/admin/produtos" className="bg-card border border-border rounded-2xl p-6 hover:shadow-card transition">
          <Package className="h-6 w-6 text-primary" />
          <div className="font-display text-3xl mt-3">{data?.products ?? 0}</div>
          <div className="text-sm text-muted-foreground">Produtos cadastrados</div>
        </Link>
        <Link to="/admin/categorias" className="bg-card border border-border rounded-2xl p-6 hover:shadow-card transition">
          <Tag className="h-6 w-6 text-primary" />
          <div className="font-display text-3xl mt-3">{data?.categories ?? 0}</div>
          <div className="text-sm text-muted-foreground">Categorias</div>
        </Link>
        <Link to="/" className="bg-gradient-rose text-primary-foreground rounded-2xl p-6 hover:opacity-90 transition">
          <Eye className="h-6 w-6" />
          <div className="font-display text-xl mt-3">Ver loja</div>
          <div className="text-sm opacity-90">Como as clientes veem</div>
        </Link>
      </div>
    </div>
  );
}
