import { Link } from "@tanstack/react-router";
import { brl } from "@/lib/format";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
};

export function ProductCard({ p }: { p: ProductCardData }) {
  return (
    <Link
      to="/produto/$id"
      params={{ id: p.id }}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all hover:-translate-y-1"
    >
      <div className="aspect-square bg-gradient-blossom overflow-hidden">
        {p.image ? (
          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground/50 font-script text-3xl">sem foto</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-foreground line-clamp-1">{p.name}</h3>
        <p className="text-primary font-medium mt-1">{brl(Number(p.price))}</p>
      </div>
    </Link>
  );
}
