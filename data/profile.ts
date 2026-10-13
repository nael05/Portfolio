export type Profile = {
  identity: {
    name: string;
    firstName: string;
    title: string;
    location: string;
    drivingLicense: string;
    email: string;
    github: string;
    githubUsername: string;
  };
  bio: string;
  education: Array<{
    title: string;
    institution: string;
    period: string;
    details?: string;
    icon: string;
  }>;
  experiences: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    current?: boolean;
    highlight?: boolean;
  }>;
  engagements: Array<{
    period: string;
    title: string;
    description: string;
  }>;
  skills: {
    hard_skills: {
      ai: string[];
      programming: {
        solid: string[];
        basics: string[];
      };
      tools: string[];
    };
    soft_skills: string[];
  };
  languages: Array<{
    language: string;
    level: string;
    percentage: number;
  }>;
  interests: Array<{
    name: string;
    detail: string;
    icon: string;
  }>;
  techMarquee: string[];
  stats: Array<{
    label: string;
    value: string;
    number?: number;
  }>;
  rotatingWords: string[];
};

const profileFr: Profile = {
  identity: {
    name: "Naël Morellon",
    firstName: "Naël",
    title: "Étudiant en Informatique (B2) · Stage vers Alternance (Data)",
    location: "Seraincourt (95)",
    drivingLicense: "Permis B",
    email: "nael.mrl@icloud.com",
    github: "https://github.com/nael05",
    githubUsername: "nael05",
  },
  bio: "Actuellement en 2e année d'informatique, je souhaite m'orienter vers la Data tout en restant curieux des sujets liés à la cybersécurité et à l'infrastructure. Avec des bases solides acquises depuis le lycée (Python, SQL, JavaScript), je recherche activement un stage de 5 semaines (entre le 31 mai et le 31 août 2027) ainsi qu'une alternance à partir de septembre 2027 dans le domaine de la Data, afin d'apprendre sur le terrain et de gagner en expérience pratique.",
  education: [
    {
      title: "Bachelor Informatique",
      institution: "Ynov Campus Nanterre",
      period: "Depuis sept. 2025",
      details: "2e année à la rentrée de sept. 2026",
      icon: "GraduationCap",
    },
    {
      title: "Baccalauréat Général",
      institution: "Lycée Camille Claudel (Vauréal)",
      period: "Juillet 2025",
      details: "Spécialités NSI / SES",
      icon: "BookOpen",
    },
  ],
  experiences: [
    {
      title: "Employé polyvalent",
      company: "McDonald's",
      location: "Tessancourt (78)",
      period: "Depuis sept. 2026",
      description: "",
      current: true,
    },
    {
      title: "Lancement de ma micro-entreprise",
      company: "NM Web Studio",
      location: "France",
      period: "Depuis janv. 2026",
      description: "Création de sites web et de SaaS.",
      current: true,
      highlight: true,
    },
    {
      title: "Préparateur de commande",
      company: "OH MY BAG",
      location: "Seraincourt (95)",
      period: "Août 2024",
      description: "Emploi d'été.",
    },
    {
      title: "Support technique",
      company: "Add-On Consulting",
      location: "Vigny (95)",
      period: "Févr. 2018",
      description: "Stage en entreprise proposant des services et solutions informatiques.",
    },
    {
      title: "Jardinage et travaux divers",
      company: "Particuliers",
      location: "Seraincourt (95)",
      period: "Depuis 2018",
      description: "",
    },
  ],
  engagements: [
    {
      period: "2023-2024",
      title: "Marelles et Confettis",
      description:
        "Bénévole dans l'association scolaire « Marelles et Confettis » de l'école de Seraincourt.",
    },
    {
      period: "2020",
      title: "Impression 3D solidaire",
      description:
        "Pendant la crise sanitaire, fabrication de visières de protection à l'imprimante 3D distribuées à des professionnels de santé, pompiers, policiers, établissements scolaires et restaurants. Fabrication de réglettes de lecture en impression 3D pour des élèves dyslexiques d'une école de Boisemont (95).",
    },
    {
      period: "Depuis 2019",
      title: "Maëlys Sensibilisation au Deuil Périnatal",
      description:
        "Bénévole dans l'association familiale Maëlys Sensibilisation au Deuil Périnatal, créée par ma mère.",
    },
    {
      period: "2014-2016",
      title: "Mairie de Seraincourt & Foyer rural",
      description:
        "Bénévole à la mairie de Seraincourt et au Foyer rural (animations jeunesse, Téléthon, jeux intervillage, commémorations).",
    },
    {
      period: "Quatre ans",
      title: "Club éco solidaire du collège",
      description:
        "Au club éco solidaire du collège : maraudes, collecte de dons, actions caritatives.",
    },
  ],
  skills: {
    hard_skills: {
      ai: [
        "Vibe coding",
        "ChatGPT",
        "Claude",
        "Gemini",
        "Agents autonomes",
      ],
      programming: {
        solid: ["Python", "SQL", "HTML", "CSS"],
        basics: ["Go", "JavaScript", "Java", "React/TypeScript", "C"],
      },
      tools: [
        "Tinkercad",
        "Visual Studio Code",
        "Suite Office",
        "VMware",
        "Cisco Packet Tracer",
        "Impression 3D",
      ],
    },
    soft_skills: [
      "Ponctuel",
      "Professionnel",
      "Souriant",
      "Organisé",
      "Autonome",
      "Réactif",
      "Grande capacité d'adaptation"
    ]
  },
  languages: [
    { language: "Anglais", level: "A2", percentage: 35 },
    { language: "Espagnol", level: "A1", percentage: 20 },
  ],
  interests: [
    { name: "Musculation", detail: "Depuis 1 an", icon: "Dumbbell" },
    { name: "Judo", detail: "7 ans en club", icon: "Swords" },
    { name: "Escalade", detail: "7 ans en club", icon: "Mountain" },
    { name: "Aéronautique", detail: "Passionné", icon: "Plane" },
    { name: "Pilotage de drone", detail: "", icon: "Rocket" },
    { name: "Horlogerie", detail: "", icon: "Watch" },
    { name: "Impression 3D", detail: "", icon: "Printer" },
  ],
  techMarquee: [
    "Python",
    "SQL",
    "IA",
    "Data",
    "React",
    "TypeScript",
    "Go",
    "Java",
    "C",
    "VMware",
    "Cisco Packet Tracer",
    "Impression 3D",
  ],
  stats: [
    {
      label: "2e année de Bachelor Informatique",
      value: "B2",
      number: 2,
    },
    {
      label: "Langages et technologies pratiqués",
      value: "9",
      number: 9,
    },
    {
      label: "Depuis 2018 : premiers pas pros",
      value: "2018",
      number: 2018,
    },
  ],
  rotatingWords: ["données", "idées", "sites", "SaaS"],
};

const profileEn: Profile = {
  identity: {
    ...profileFr.identity,
    title: "Computer Science Student (B2) · Internship to Work-Study (Data)",
    drivingLicense: "B License (Car)",
  },
  bio: "Currently in my 2nd year of Computer Science, I aim to specialize in Data while maintaining a strong interest in cybersecurity and infrastructure. Building on a solid foundation acquired in high school (Python, SQL, JavaScript), I am actively seeking a 5-week internship (between May 31 and August 31, 2027) followed by a work-study program starting in September 2027 in the Data field, to gain practical, hands-on experience.",
  education: [
    {
      title: "Bachelor in Computer Science",
      institution: "Ynov Campus Nanterre",
      period: "Since Sept. 2025",
      details: "2nd year starting Sept. 2026",
      icon: "GraduationCap",
    },
    {
      title: "High School Diploma (Baccalauréat)",
      institution: "Camille Claudel High School (Vauréal)",
      period: "July 2025",
      details: "Majors: Computer Science (NSI) & Economics (SES)",
      icon: "BookOpen",
    },
  ],
  experiences: [
    {
      title: "Versatile Team Member",
      company: "McDonald's",
      location: "Tessancourt (78)",
      period: "Since Sept. 2026",
      description: "",
      current: true,
    },
    {
      title: "Freelance Agency Launch",
      company: "NM Web Studio",
      location: "France",
      period: "Since Jan. 2026",
      description: "Creation of websites and SaaS platforms.",
      current: true,
      highlight: true,
    },
    {
      title: "Order Picker",
      company: "OH MY BAG",
      location: "Seraincourt (95)",
      period: "Aug. 2024",
      description: "Summer job.",
    },
    {
      title: "IT Support",
      company: "Add-On Consulting",
      location: "Vigny (95)",
      period: "Feb. 2018",
      description: "Internship in an IT services and solutions company.",
    },
    {
      title: "Gardening & Various Tasks",
      company: "Private individuals",
      location: "Seraincourt (95)",
      period: "Since 2018",
      description: "",
    },
  ],
  engagements: [
    {
      period: "2023-2024",
      title: "Marelles et Confettis",
      description: "Volunteer for the school association 'Marelles et Confettis' in Seraincourt.",
    },
    {
      period: "2020",
      title: "Solidarity 3D Printing",
      description: "During the pandemic, manufactured 3D-printed face shields distributed to healthcare professionals, firefighters, police, schools, and restaurants. Manufactured 3D-printed reading rulers for dyslexic students in Boisemont (95).",
    },
    {
      period: "Since 2019",
      title: "Maëlys Perinatal Grief Awareness",
      description: "Volunteer in the family association Maëlys Perinatal Grief Awareness, founded by my mother.",
    },
    {
      period: "2014-2016",
      title: "Seraincourt City Hall & Rural Center",
      description: "Volunteer at the Seraincourt City Hall and Rural Center (youth events, Telethon, inter-village games, commemorations).",
    },
    {
      period: "Four years",
      title: "Middle School Eco-Solidarity Club",
      description: "Participated in charity rounds, donation collections, and charitable actions.",
    },
  ],
  skills: {
    hard_skills: {
      ...profileFr.skills.hard_skills,
      ai: ["Vibe coding", "ChatGPT", "Claude", "Gemini", "Autonomous Agents"],
    },
    soft_skills: [
      "Punctual",
      "Professional",
      "Smiling",
      "Organized",
      "Autonomous",
      "Responsive",
      "Highly adaptable"
    ]
  },
  languages: [
    { language: "English", level: "A2", percentage: 35 },
    { language: "Spanish", level: "A1", percentage: 20 },
  ],
  interests: [
    { name: "Weightlifting", detail: "For 1 year", icon: "Dumbbell" },
    { name: "Judo", detail: "7 years in club", icon: "Swords" },
    { name: "Climbing", detail: "7 years in club", icon: "Mountain" },
    { name: "Aeronautics", detail: "Passionate", icon: "Plane" },
    { name: "Drone Piloting", detail: "", icon: "Rocket" },
    { name: "Watchmaking", detail: "", icon: "Watch" },
    { name: "3D Printing", detail: "", icon: "Printer" },
  ],
  techMarquee: profileFr.techMarquee,
  stats: [
    {
      label: "2nd Year IT Bachelor",
      value: "B2",
      number: 2,
    },
    {
      label: "Languages & Tech Stack",
      value: "9",
      number: 9,
    },
    {
      label: "First pro steps since 2018",
      value: "2018",
      number: 2018,
    },
  ],
  rotatingWords: ["data", "ideas", "websites", "SaaS"],
};

export const getProfile = (lang: "fr" | "en"): Profile => {
  return lang === "en" ? profileEn : profileFr;
};

// Default export for backward compatibility where not updated yet
export const profile = profileFr;
