import type { SiteContent } from '@/types/content';

/**
 * CONTEÚDO PROVISÓRIO — nada aqui é real.
 *
 * Nome, formação, textos e fotos são fictícios e existem para o
 * desenvolvimento andar. O CRP (`00/00000`) e o WhatsApp (`5511999999999`)
 * são valores de exemplo de propósito: `npm run check:content` barra os dois
 * e, com isso, barra a publicação até que os dados reais entrem aqui.
 *
 * Antes de publicar: substituir tudo, trocar as fotos em `public/images/`
 * pelas imagens reais nos tamanhos finais, e rodar `npm run check:content`.
 */
export const siteContent: SiteContent = {
  fullName: 'Ana Beatriz Moraes',
  profession: 'Psicóloga',
  crp: '00/00000',
  whatsappNumber: '5511999999999',
  whatsappMessage: 'Olá! Vim pelo site e gostaria de saber mais sobre o atendimento.',
  whatsappCta: 'Diga um oie!',

  seo: {
    title: 'Ana Beatriz Moraes — Psicóloga',
    description:
      'Psicóloga clínica, atendimento online para adultos em todo o Brasil. O primeiro contato acontece pelo WhatsApp.',
    siteUrl: 'https://exemplo.com.br',
  },

  hero: {
    headline: 'Um espaço para você se escutar com calma',
    modality: 'Atendimento online, para adultos em todo o Brasil',
    portrait: {
      src: '/images/retrato.png',
      alt: 'Ana Beatriz Moraes sentada em uma poltrona clara, olhando para a câmera',
      width: 800,
      height: 1000,
    },
  },

  services: {
    title: 'Como posso ajudar',
    items: [
      {
        title: 'Ansiedade e preocupação constante',
        description: 'Quando a cabeça não desacelera e o corpo parece viver em alerta.',
      },
      {
        title: 'Luto e perdas',
        description: 'Para atravessar uma despedida sem precisar fazer isso sozinha.',
      },
      {
        title: 'Relações e limites',
        description: 'Dificuldade de dizer não, conflitos que se repetem, medo de desagradar.',
      },
      {
        title: 'Autoestima e autocrítica',
        description: 'A voz interna que cobra demais e reconhece de menos.',
      },
      {
        title: 'Transições de vida e de trabalho',
        description: 'Mudanças de cidade, de carreira ou de fase que pedem tempo para assentar.',
      },
    ],
  },

  about: {
    title: 'Sobre mim',
    paragraphs: [
      'Sou psicóloga clínica e atendo adultos que querem entender melhor o que sentem. Meu trabalho começa pela escuta: antes de qualquer proposta, quero compreender como a sua história chegou até aqui.',
      'Acredito em um espaço sem pressa e sem julgamento, onde você possa falar daquilo que ainda não tem nome. O ritmo é combinado com você, sessão por sessão.',
    ],
    education: [
      'Graduação em Psicologia — Universidade Exemplo, 2016',
      'Especialização em Psicologia Clínica — Instituto Exemplo, 2019',
      'Formação em Terapia Cognitivo-Comportamental — Centro Exemplo, 2021',
    ],
    approach:
      'Trabalho na abordagem cognitivo-comportamental: olhamos juntas para os padrões de pensamento e de comportamento que se repetem e construímos, no seu tempo, formas mais possíveis de lidar com eles no dia a dia.',
    photo: {
      src: '/images/sobre.png',
      alt: 'Ana Beatriz Moraes em seu consultório, diante de uma estante de livros',
      width: 800,
      height: 800,
    },
  },

  howItWorks: {
    title: 'Como funciona',
    steps: [
      {
        title: 'Chame no WhatsApp',
        description:
          'Você manda uma mensagem e me conta, com as palavras que tiver, o que está buscando.',
      },
      {
        title: 'Combinamos o primeiro horário',
        description:
          'Encontramos um dia e uma hora que caibam na sua rotina, e eu explico como a sessão acontece.',
      },
      {
        title: 'Iniciamos o acompanhamento',
        description:
          'A partir da primeira conversa, seguimos no ritmo que fizer sentido para você.',
      },
    ],
  },

  faq: {
    title: 'Dúvidas',
    items: [
      {
        question: 'O que eu falo na sessão fica em sigilo?',
        answer:
          'Sim. O sigilo é um dever previsto no Código de Ética Profissional do Psicólogo. Ele só cede em situações excepcionais previstas em lei, como risco à vida — e, sempre que possível, isso é conversado com você antes.',
      },
      {
        question: 'Qual é a duração de cada sessão?',
        answer:
          'Cada sessão dura em torno de 50 minutos. A frequência costuma ser semanal, e definimos isso juntas no começo do acompanhamento.',
      },
      {
        question: 'Como é o atendimento online?',
        answer:
          'Acontece por videochamada, em horário combinado, de um lugar onde você possa falar com privacidade. Você precisa de internet estável e, se preferir, de fones de ouvido.',
      },
      {
        question: 'Como faço para saber os valores?',
        answer:
          'Me chame no WhatsApp e eu passo essa informação no contato, junto com os horários disponíveis.',
      },
    ],
  },

  finalCta: {
    headline: 'Se você chegou até aqui, talvez este seja um bom momento para começar.',
  },

  footer: {
    privacyNotice:
      'Este site não usa cookies de rastreamento e não tem formulários — nenhum dado seu é coletado aqui. O contato acontece diretamente no WhatsApp.',
    emergencyNotice:
      'Este site não atende emergências. Em situação de risco imediato, ligue para o CVV no 188 ou para o SAMU no 192.',
  },

  socialLinks: [{ label: 'Instagram', url: 'https://www.instagram.com/exemplo' }],
};
