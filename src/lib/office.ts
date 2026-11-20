import type { Office } from '@/types/content';

/** The address as a map search: "Rua Pombas, 212, Centro, Arapongas - PR". */
export function officeQuery(office: Office): string {
  return `${office.street}, ${office.district}, ${office.city} - ${office.state}`;
}

/** Google Maps search for the address (opens the app on phones). */
export function googleMapsUrl(office: Office): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeQuery(office))}`;
}

/** Waze, ready to navigate to the address. */
export function wazeUrl(office: Office): string {
  return `https://waze.com/ul?q=${encodeURIComponent(officeQuery(office))}&navigate=yes`;
}
