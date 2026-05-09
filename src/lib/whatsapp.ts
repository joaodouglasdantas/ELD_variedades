import { brl } from "./format";

export const WHATSAPP_NUMBER = "5584999921512";
export const STORE_NAME = "Eunice Luzia Dantas";

export type CheckoutItem = { id: string; name: string; price: number; qty: number };
export type CheckoutData = {
  items: CheckoutItem[];
  customerName: string;
  fulfillment: "entrega" | "retirada";
  address?: string;
  payment: "pix" | "dinheiro" | "credito" | "debito";
  notes?: string;
};

const paymentLabel = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  credito: "Cartão de crédito",
  debito: "Cartão de débito",
} as const;

export function buildWhatsAppMessage(d: CheckoutData) {
  const total = d.items.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = [
    `*Novo pedido — ${STORE_NAME}*`,
    ``,
    `*Cliente:* ${d.customerName}`,
    ``,
    `*Itens:*`,
    ...d.items.map((i) => `• ${i.qty}x ${i.name} — ${brl(i.price * i.qty)}`),
    ``,
    `*Total:* ${brl(total)}`,
    ``,
    `*Entrega:* ${d.fulfillment === "entrega" ? "Entrega" : "Retirada na loja"}`,
    ...(d.fulfillment === "entrega" && d.address ? [`*Endereço:* ${d.address}`] : []),
    `*Pagamento:* ${paymentLabel[d.payment]}`,
    ...(d.notes ? [``, `*Observações:* ${d.notes}`] : []),
  ];
  return lines.join("\n");
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
