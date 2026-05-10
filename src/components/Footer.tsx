import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-border/60 bg-gradient-blossom">
      <div className="container mx-auto px-4 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
        <div className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="" className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-display text-base sm:text-lg truncate">Eunice Luzia Dantas</div>
            <div className="text-xs text-muted-foreground truncate">Variedades · Roupas · Perfumes</div>
          </div>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=R.+Vitorino+Paulino,+217+-+Esta%C3%A7%C3%A3o,+Almino+Afonso+-+RN,+59760-000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors max-w-xs"
        >
          R. Vitorino Paulino, 217 - Estação<br />Almino Afonso - RN, 59760-000
        </a>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} — Feito com ♥ para nossas clientes</p>
      </div>
    </footer>
  );
}
