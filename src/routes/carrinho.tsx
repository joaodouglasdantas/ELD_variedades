import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus, Minus, Send } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/carrinho")({
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const [name, setName] = useState("");
  const [fulfillment, setFulfillment] = useState<"entrega" | "retirada">("retirada");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<"pix" | "dinheiro" | "credito" | "debito">("pix");
  const [notes, setNotes] = useState("");

  const canSend = name.trim().length >= 2 && cart.items.length > 0 && (fulfillment === "retirada" || address.trim().length >= 5);

  const handleSend = () => {
    const msg = buildWhatsAppMessage({
      items: cart.items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      customerName: name.trim().slice(0, 100),
      fulfillment,
      address: address.trim().slice(0, 300),
      payment,
      notes: notes.trim().slice(0, 500),
    });
    window.open(whatsappLink(msg), "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <p className="font-script text-primary text-lg">seu pedido</p>
          <h1 className="font-display text-4xl">Carrinho</h1>
        </header>

        {cart.items.length === 0 ? (
          <div className="text-center py-20 bg-gradient-blossom rounded-3xl">
            <p className="font-display text-2xl">Seu carrinho está vazio</p>
            <Link to="/produtos" className="inline-block mt-6 px-6 py-3 rounded-full bg-gradient-rose text-primary-foreground">Ver produtos</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Itens */}
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map((it) => (
                <div key={it.id} className="flex gap-4 bg-card border border-border rounded-2xl p-4 items-center">
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-gradient-blossom flex-shrink-0">
                    {it.image && <img src={it.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg line-clamp-1">{it.name}</h3>
                    <p className="text-primary font-medium">{brl(it.price)}</p>
                  </div>
                  <div className="flex items-center border border-border rounded-full">
                    <button onClick={() => cart.setQty(it.id, it.qty - 1)} className="p-2 hover:bg-secondary rounded-l-full"><Minus className="h-3 w-3" /></button>
                    <span className="px-3 text-sm min-w-8 text-center">{it.qty}</span>
                    <button onClick={() => cart.setQty(it.id, it.qty + 1)} className="p-2 hover:bg-secondary rounded-r-full"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => cart.remove(it.id)} className="p-2 text-muted-foreground hover:text-destructive transition" aria-label="Remover">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout */}
            <aside className="bg-card border border-border rounded-2xl p-6 h-fit shadow-card sticky top-24 space-y-4">
              <h2 className="font-display text-2xl">Finalizar</h2>

              <label className="block">
                <span className="text-sm font-medium">Seu nome</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Como te chamamos?" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary" />
              </label>

              <div>
                <span className="text-sm font-medium">Entrega ou retirada</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(["retirada", "entrega"] as const).map((v) => (
                    <button key={v} onClick={() => setFulfillment(v)} className={`px-3 py-2 rounded-lg border text-sm capitalize transition ${fulfillment === v ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {fulfillment === "entrega" && (
                <label className="block">
                  <span className="text-sm font-medium">Endereço de entrega</span>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} maxLength={300} rows={2} placeholder="Rua, número, bairro, referência" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary" />
                </label>
              )}

              <div>
                <span className="text-sm font-medium">Pagamento</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {([["pix","PIX"],["dinheiro","Dinheiro"],["credito","Crédito"],["debito","Débito"]] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setPayment(v)} className={`px-3 py-2 rounded-lg border text-sm transition ${payment === v ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Observações (opcional)</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={2} className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background outline-none focus:border-primary" />
              </label>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-primary">{brl(cart.total)}</span>
              </div>

              <button
                disabled={!canSend}
                onClick={handleSend}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-rose text-primary-foreground px-6 py-3 rounded-full shadow-soft hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" /> Enviar pedido pelo WhatsApp
              </button>
              <p className="text-xs text-muted-foreground text-center">O pagamento será combinado direto com a loja pelo WhatsApp.</p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
