/** `55` + DDD (2 dígitos) + telefone (8 ou 9 dígitos), somente dígitos. */
const FORMATO_WHATSAPP = /^55\d{10,11}$/;

/**
 * Monta o link `wa.me` com a mensagem inicial já codificada.
 *
 * A entrada não é normalizada de propósito: um número formatado
 * (`+55 (11) 98765-4321`) geraria um link quebrado sem aviso, então ele é
 * rejeitado em vez de limpo.
 *
 * @throws {Error} quando `phone` não é `55` + DDD + telefone, somente dígitos.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  if (!FORMATO_WHATSAPP.test(phone)) {
    throw new Error(
      `Número de WhatsApp inválido: ${JSON.stringify(phone)}. Use 55 + DDD + telefone, somente dígitos.`,
    );
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
