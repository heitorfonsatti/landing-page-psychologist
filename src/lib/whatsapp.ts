/** `55` + area code (2 digits) + phone (8 or 9 digits), digits only. */
const WHATSAPP_FORMAT = /^55\d{10,11}$/;

/**
 * Builds the `wa.me` link with the initial message already encoded.
 *
 * The input is deliberately not normalized: a formatted number
 * (`+55 (11) 98765-4321`) would silently produce a broken link, so it is
 * rejected instead of cleaned up.
 *
 * @throws {Error} when `phone` is not `55` + area code + phone, digits only.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  if (!WHATSAPP_FORMAT.test(phone)) {
    throw new Error(
      `Invalid WhatsApp number: ${JSON.stringify(phone)}. Use 55 + area code + phone, digits only.`,
    );
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
