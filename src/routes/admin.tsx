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
    { to: "/admin", label: "Inicio", icon: LayoutDashboard, exact: true },
    { to: "/admin/produtos", label: "Produtos", icon: Package },
    { to: "/admin/categorias", label: "Categorias", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/40">
      {/* Sidebar desktop / topbar mobile */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-row md:flex-col md:min-h-screen flex-shrink-0">
        <Link to="/" className="p-4 md:p-6 flex items-center gap-3 border-r md:border-r-0 md:border-b border-border flex-shrink-0">
          <img src={logo} alt="" className="h-8 w-8 md:h-10 md:w-10 rounded-full flex-shrink-0" />
          <div className="leading-tight hidden md:block">
            <div className="font-display text-base">Painel</div>
            <div className="text-xs text-muted-foreground">Eunice Luzia</div>
          </div>
        </Link>

        <nav className="flex flex-row md:flex-col flex-1 md:p-3 md:space-y-1 overflow-x-auto">
          {links.map((l) => {
            const active = l.exact ? path === l.to : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={
                  "flex items-center gap-2 px-3 py-3 md:py-2 md:rounded-lg text-sm transition whitespace-nowrap flex-shrink-0 " +
                  (active
                    ? "bg-gradient-rose text-primary-foreground"
                    : "hover:bg-secondary")
                }
              >
                <l.icon className="h-4 w-4 flex-shrink-0" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
          className="flex items-center gap-2 px-3 py-3 md:m-3 md:py-2 md:rounded-lg text-sm hover:bg-secondary text-muted-foreground flex-shrink-0"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sair</span>
        </button>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
