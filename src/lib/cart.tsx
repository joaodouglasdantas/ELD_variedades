import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "eld-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (it, qty = 1) =>
      setItems((cur) => {
        const ex = cur.find((x) => x.id === it.id);
        if (ex) return cur.map((x) => (x.id === it.id ? { ...x, qty: x.qty + qty } : x));
        return [...cur, { ...it, qty }];
      }),
    remove: (id) => setItems((c) => c.filter((x) => x.id !== id)),
    setQty: (id, qty) =>
      setItems((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))),
    clear: () => setItems([]),
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    count: items.reduce((s, i) => s + i.qty, 0),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
