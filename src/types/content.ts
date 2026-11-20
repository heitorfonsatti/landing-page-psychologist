export type Photo = { src: string; alt: string; width: number; height: number };
export type SocialLink = { label: string; url: string };
export type ListItem = { title: string; description: string };
/** A "How I can help" topic: short card text plus the full explanation. */
export type ServiceItem = ListItem & {
  /** What the visitor may be going through: names the problem. */
  struggle: string;
  /** How therapy can help: shows there is a way forward. */
  support: string;
};
/** One audience's "How I can help" section. */
export type ServiceGroup = {
  /** Small label above the title that names the audience. */
  eyebrow: string;
  title: string;
  /** Optional short paragraph below the title. */
  intro?: string;
  /** Label above `struggle`; changes with who reads it (the patient or the parents). */
  struggleLabel: string;
  items: ServiceItem[];
  /** Optional photo beside the topics (used by the list layout). */
  photo?: Photo;
};
export type FaqItem = { question: string; answer: string };
/** The office address, shown in the footer beside the street map. */
export type Office = {
  heading: string;
  /** Name of the clinic the office is in, as its sign reads. */
  place: string;
  /** Street and number, as the address is written: "Rua Pombas, 212". */
  street: string;
  district: string;
  city: string;
  /** Two-letter state code. */
  state: string;
  /** Who is seen there in person. */
  note: string;
};

export type SiteContent = {
  fullName: string;
  profession: 'Psicóloga';
  crp: string;
  whatsappNumber: string;
  whatsappMessage: string;
  /** Button text; names WhatsApp so visitors know where the click leads. */
  whatsappCta: string;
  /** Shorter button text for the header, where the full one does not fit on phones. */
  whatsappShortCta: string;
  seo: { title: string; description: string; siteUrl: string };
  hero: { headline: string; modality: string; portrait: Photo };
  services: {
    moreLabel: string;
    backLabel: string;
    supportLabel: string;
    adults: ServiceGroup;
    children: ServiceGroup;
  };
  about: {
    title: string;
    paragraphs: string[];
    education: string[];
    approach: string;
    photo: Photo;
  };
  howItWorks: { title: string; steps: ListItem[] };
  faq: { title: string; items: FaqItem[] };
  finalCta: { headline: string };
  footer: { privacyNotice: string; emergencyNotice: string };
  office: Office;
  socialLinks: SocialLink[];
};
