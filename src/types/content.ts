export type Photo = { src: string; alt: string; width: number; height: number };
export type SocialLink = { label: string; url: string };
export type ListItem = { title: string; description: string };
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
  services: { title: string; items: ListItem[] };
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
