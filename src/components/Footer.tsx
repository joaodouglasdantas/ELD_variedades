import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-gradient-blossom">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <div className="font-display text-lg">Eunice Luzia Dantas</div>
            <div className="text-xs text-muted-foreground">Variedades · Roupas · Perfumes</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} — Feito com ♥ para nossas clientes</p>
      </div>
    </footer>
  );
}
