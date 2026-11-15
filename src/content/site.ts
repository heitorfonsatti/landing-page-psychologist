import type { SiteContent } from '@/types/content';

/**
 * PLACEHOLDER CONTENT: nothing here is real.
 *
 * Name, education, copy and photos are fictional and exist so development
 * can move forward. The CRP (`00/00000`) and the WhatsApp number
 * (`5511999999999`) are placeholders on purpose: `npm run check:content`
 * rejects both and, with that, blocks publishing until the real data is in.
 *
 * Visitor-facing copy stays in Brazilian Portuguese.
 *
 * Before publishing: replace everything, swap the photos in `public/images/`
 * for the real images at their final sizes, and run `npm run check:content`.
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
      src: '/images/portrait.png',
      alt: 'Ana Beatriz Moraes sentada em uma poltrona clara, olhando para a câmera',
      width: 800,
      height: 1000,
    },
  },

  services: {
    moreLabel: 'Saber mais',
    backLabel: 'Voltar',
    supportLabel: 'Como a terapia pode ajudar',

    adults: {
      eyebrow: 'Para adultos',
      title: 'Como posso ajudar',
      struggleLabel: 'O que você pode estar vivendo',
      items: [
        {
          title: 'Ansiedade e preocupação constante',
          description: 'Quando a cabeça não desacelera e o corpo parece viver em alerta.',
          struggle:
            'Talvez você passe o dia antecipando o que pode dar errado, durma mal ou sinta o peito apertado sem um motivo claro. A preocupação ocupa tanto espaço que sobra pouco para viver o agora.',
          support:
            'Na terapia, identificamos os pensamentos que alimentam esse estado de alerta e treinamos, aos poucos, novas formas de responder a eles. A ansiedade não some por decreto, mas pode voltar a ter um tamanho que cabe na sua rotina.',
        },
        {
          title: 'Autoestima e autocrítica',
          description: 'A voz interna que cobra demais e reconhece de menos.',
          struggle:
            'Nada parece bom o bastante: cada conquista vira obrigação e cada erro vira prova de que você não dá conta. Essa voz crítica costuma falar mais alto do que qualquer elogio.',
          support:
            'Na terapia, aprendemos a reconhecer essa voz, questionar o que ela diz e construir um olhar mais justo sobre você mesma. Confiança em si se desenvolve, como qualquer outra habilidade.',
        },
        {
          title: 'Perfeccionismo',
          description: 'Padrões tão altos que o medo de errar trava o começo e rouba a satisfação.',
          struggle:
            'Você revisa tudo mais uma vez, adia o que não pode sair impecável e sente que só o resultado perfeito é aceitável. O cansaço cresce, e a sensação de dever cumprido quase nunca chega.',
          support:
            'Na terapia, identificamos as regras rígidas por trás dessa exigência e testamos, na prática, o que acontece quando você se permite fazer bem feito em vez de perfeito. Aos poucos, o padrão alto deixa de ser uma armadilha.',
        },
        {
          title: 'Relações e limites',
          description: 'Dificuldade de dizer não, conflitos que se repetem, medo de desagradar.',
          struggle:
            'Você diz sim quando queria dizer não, evita conversas difíceis ou percebe as mesmas brigas se repetindo com pessoas diferentes. Tentar agradar a todos acaba custando caro.',
          support:
            'Juntas, olhamos para os padrões que se repetem nas suas relações e praticamos formas de se posicionar com clareza e cuidado. Um limite saudável não afasta quem importa: aproxima.',
        },
        {
          title: 'Relacionamentos amorosos',
          description: 'Ciúme, términos, dependência emocional ou a dificuldade de se vincular.',
          struggle:
            'Talvez você sinta que se perde de si dentro de um relacionamento, viva com medo de ser deixada ou repita escolhas que já machucaram antes. Às vezes, o difícil é justamente se permitir criar um vínculo.',
          support:
            'Juntas, entendemos as crenças sobre o amor e sobre você mesma que guiam essas escolhas e praticamos formas mais seguras de se comunicar e de se vincular. Um relacionamento pode ser lugar de cuidado, e não de alerta.',
        },
        {
          title: 'Relação com o corpo e a alimentação',
          description: 'Quando a comida e a própria imagem pesam mais do que deveriam no dia a dia.',
          struggle:
            'Comer para aliviar emoções, seguir regras rígidas que nunca parecem suficientes, evitar situações por causa de como você se vê: a comida e o espelho viram fontes constantes de culpa e cobrança.',
          support:
            'Na terapia, observamos os pensamentos e as emoções que acompanham a comida e a imagem corporal e construímos, passo a passo, uma rotina mais flexível. A ideia é que o corpo deixe de ser um campo de batalha.',
        },
      ],
    },

    children: {
      eyebrow: 'Para crianças e adolescentes',
      title: 'Como posso ajudar na infância e na adolescência',
      intro:
        'Atendo crianças a partir de 6 anos e adolescentes. Os pais ou responsáveis participam do processo, com encontros periódicos de orientação.',
      struggleLabel: 'O que você pode estar percebendo',
      items: [
        {
          title: 'Medos, ansiedade e insegurança',
          description: 'Preocupações que crescem, medo de ficar longe dos pais, dor de barriga antes da escola.',
          struggle:
            'A criança pode evitar situações novas, ter dificuldade para dormir sozinha ou sentir sintomas no corpo antes de provas e passeios. A preocupação parece maior do que ela consegue carregar.',
          support:
            'Com recursos adequados à idade, como brincadeiras, histórias e desenhos, a criança aprende a reconhecer o que sente e a enfrentar os medos aos poucos. Os pais recebem orientação para apoiar esse processo em casa.',
        },
        {
          title: 'Birras, irritabilidade e emoções intensas',
          description: 'Quando as emoções transbordam e as crises viram rotina em casa.',
          struggle:
            'Explosões por pequenas frustrações, choro difícil de acalmar, agressividade ou irritação constante. Em casa, todo mundo passa a pisar em ovos, e os pais se sentem sem saber como agir.',
          support:
            'Na terapia, a criança aprende a dar nome às emoções e a encontrar formas mais seguras de expressá-las. Com os pais, combinamos estratégias práticas e consistentes para os momentos de crise.',
        },
        {
          title: 'Dificuldades na escola e com amigos',
          description: 'Dificuldade para fazer amigos, conflitos com colegas ou resistência a ir para a escola.',
          struggle:
            'A criança ou o adolescente pode se isolar, ter conflitos frequentes com colegas, se recusar a ir à escola ou perder o interesse pelos estudos. Muitas vezes, é a própria escola quem percebe primeiro.',
          support:
            'Trabalhamos habilidades sociais, como puxar conversa, lidar com conflitos e pedir ajuda, e olhamos para o que está por trás da dificuldade escolar. Quando faz sentido, e com o acordo da família, a escola também participa do cuidado.',
        },
        {
          title: 'Adolescência e seus desafios',
          description: 'Autoestima, identidade, pressão do grupo e a vida nas redes sociais.',
          struggle:
            'O adolescente pode se fechar, mudar de humor com frequência, se comparar o tempo todo nas redes ou sentir que ninguém o entende. A conversa em casa fica difícil justamente quando mais se precisa dela.',
          support:
            'A terapia oferece ao adolescente um espaço próprio e de confiança para entender o que sente e lidar com as pressões dessa fase. Os responsáveis também recebem orientação, respeitando o vínculo construído com ele.',
        },
        {
          title: 'Mudanças na família',
          description: 'Separação dos pais, luto, mudança de casa ou a chegada de um irmão.',
          struggle:
            'Mudanças na família mexem com a rotina e com a sensação de segurança. A criança pode voltar a comportamentos que já tinha superado, ou ficar mais irritada, retraída ou preocupada.',
          support:
            'A terapia ajuda a criança a entender o que está acontecendo, em uma linguagem que faça sentido para ela, e a expressar o que sente. Os pais recebem apoio para conduzir essa fase com mais segurança.',
        },
        {
          title: 'Orientação aos pais',
          description: 'Apoio para quem cuida, com estratégias possíveis para o dia a dia.',
          struggle:
            'Você sente que já tentou de tudo, se divide entre limite e afeto ou tem dúvidas sobre como reagir a certos comportamentos. Educar cansa, e nem sempre há com quem conversar sobre isso.',
          support:
            'Nos encontros de orientação, entendemos juntos o que mantém os comportamentos difíceis e combinamos estratégias práticas para a rotina da família. A orientação pode acompanhar a terapia da criança ou acontecer de forma independente.',
        },
      ],
    },
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
      src: '/images/about.png',
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
