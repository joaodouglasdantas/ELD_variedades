import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, Tag, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/login" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando...</div>;
  }

  const links = [
    { to: "/admin", label: "Início", icon: LayoutDashboard, exact: true },
    { to: "/admin/produtos", label: "Produtos", icon: Package },
    { to: "/admin/categorias", label: "Categorias", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-border">
          <img src={logo} alt="" className="h-10 w-10 rounded-full" />
          <div className="leading-tight">
            <div className="font-display text-base">Painel</div>
            <div className="text-xs text-muted-foreground">Eunice Luzia</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => {
            const active = l.exact ? path === l.to : path.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active ? "bg-gradient-rose text-primary-foreground" : "hover:bg-secondary"}`}>
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }} className="m-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary text-muted-foreground">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
    </div>
  );
}
