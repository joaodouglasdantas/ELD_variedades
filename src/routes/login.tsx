import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const ADMIN_EMAIL = "eunice@gmail.com";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isAdmin) navigate({ to: "/admin" });
  }, [user, isAdmin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast.error("Acesso não autorizado.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Bem-vinda, Eunice!");
    } catch (err: any) {
      toast.error(err.message ?? "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <h1 className="font-display text-3xl text-center">Painel</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Acesso restrito ao administrador.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Senha</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary"
              />
            </label>
            <button
              disabled={loading}
              className="w-full bg-gradient-rose text-primary-foreground py-2.5 rounded-full shadow-card hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Aguarde..." : "Entrar"}
            </button>
          </form>

          {user && !isAdmin && (
            <p className="mt-4 text-sm text-center text-destructive">Esta conta não tem acesso ao painel.</p>
          )}

          <Link to="/" className="block text-center text-xs text-muted-foreground mt-6 hover:text-primary">
            &larr; Voltar à loja
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
