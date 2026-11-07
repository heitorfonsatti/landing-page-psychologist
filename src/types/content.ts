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
};
export type FaqItem = { question: string; answer: string };

export type SiteContent = {
  fullName: string;
  profession: 'Psicóloga';
  crp: string;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappCta: string;
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
  socialLinks: SocialLink[];
};
