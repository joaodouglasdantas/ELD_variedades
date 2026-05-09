import { Link } from "@tanstack/react-router";
import { ShoppingBag, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img
            src={logo}
            alt="Eunice Luzia Dantas"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shadow-card flex-shrink-0"
          />
          <div className="hidden sm:block leading-tight min-w-0">
            <div className="font-display text-xl text-foreground truncate">Eunice Luzia</div>
            <div className="font-script text-sm text-primary -mt-1 truncate">variedades</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4 md:gap-8 text-sm font-medium">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary" }}
            className="hover:text-primary transition-colors"
          >
            Inicio
          </Link>
          <Link
            to="/produtos"
            activeProps={{ className: "text-primary" }}
            className="hover:text-primary transition-colors"
          >
            Produtos
          </Link>
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/login"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Painel admin"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            to="/carrinho"
            className={
              "relative flex items-center gap-1.5 bg-gradient-rose " +
              "text-primary-foreground px-3 sm:px-4 py-2 rounded-full " +
              "shadow-card hover:opacity-90 transition"
            }
          >
            <ShoppingBag className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">Carrinho</span>
            {count > 0 && (
              <span
                className={
                  "absolute -top-1 -right-1 bg-foreground text-background " +
                  "text-xs h-5 min-w-5 rounded-full grid place-items-center px-1"
                }
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
