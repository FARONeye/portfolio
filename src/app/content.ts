/* Contenu du portfolio, tiré du CV de Mathis (CDI — 2026).
   La page et ses animations s'adaptent au nombre d'éléments et à la longueur des textes :
   pour mettre le site à jour, il suffit de modifier ce fichier. */

export const profile = {
  name: "Mathis Truong",
  role: "Développeur Full-Stack · Node.js & Google Cloud",
  company: "Air Liquide",
  city: "Île-de-France",
  tags: ["22 ans", "Permis B"],
  status: "CDI recherché dès décembre 2027",
  summary:
    "Développeur full-stack spécialisé dans la conception de solutions internes sécurisées sur Google Cloud et Google Workspace. Plus de deux ans chez Air Liquide en développement front-end et back-end, automatisation, administration des accès et déploiement d’applications cloud.",
  stats: [
    { value: "2+", label: "ans chez Air Liquide" },
    { value: "500+", label: "utilisateurs au quotidien" },
    { value: "2", label: "expériences pro" },
  ],
  stack: [
    { area: "front", tools: "React · Vue.js · Next.js · Tailwind" },
    { area: "back", tools: "Node.js · Python · PHP · Java" },
    { area: "cloud", tools: "Google Cloud · Firebase · BigQuery" },
    { area: "data", tools: "PostgreSQL · MySQL · MongoDB" },
  ],
  qualities: ["Rigoureux", "Autonome", "Esprit d’analyse", "Travail en équipe", "Capacité d’adaptation", "Résolution de problèmes"],
};

export const experiences = [
  {
    hash: "a1f2c0d",
    current: true,
    years: "09/24 — aujourd’hui · fin prévue 10/27",
    year: 2024,
    role: "Alternant Développeur Full-Stack Cloud",
    company: "Air Liquide",
    place: "Service IT · Courbevoie (92)",
    missions: [
      "Conception et développement de bout en bout d’une application interne sécurisée, utilisée chaque jour par plus de 500 collaborateurs à l’international.",
      "Gestion des droits d’accès à des comptes techniques partagés et génération sécurisée de codes TOTP.",
      "Migration d’Apps Script et Google Sheets vers Firebase Hosting, Firestore et Google Cloud, avec authentification Okta SSO et Google Sign-In.",
      "Environnements de développement, test et production, journalisation des opérations dans BigQuery.",
    ],
    stack: ["Firebase", "Firestore", "Google Cloud", "BigQuery", "Okta SSO", "Apps Script"],
    did: [
      "J’ai créé une application interne de double authentification, de la conception à la mise en production.",
      "J’ai développé le back-end serverless (Cloud Functions, Firestore) et l’interface des utilisateurs.",
      "J’ai intégré Okta SSO et Google Sign-In, et mis en place la gestion des droits.",
      "J’ai séparé les environnements de test et de production, branché les journaux sur BigQuery et rédigé les tutoriels.",
    ],
    brought: [
      "Un accès centralisé et sécurisé aux comptes techniques partagés.",
      "Moins de demandes d’accès manuelles, grâce à la délégation des droits.",
      "Une traçabilité complète des actions, sans jamais exposer un code.",
    ],
  },
  {
    hash: "7d4e1b9",
    years: "01/24 — 02/24",
    year: 2024,
    role: "Développeur Web Front-end",
    company: "Trady",
    place: "Télétravail",
    missions: [
      "Refonte de l’interface d’un site web et développement de nouvelles fonctionnalités interactives.",
      "Correction d’anomalies et amélioration de l’expérience utilisateur.",
    ],
    stack: ["Front-end", "Refonte UI", "UX"],
    did: [
      "J’ai refondu l’interface du site.",
      "J’ai développé de nouvelles fonctionnalités interactives.",
      "J’ai corrigé les anomalies relevées sur le site.",
    ],
    brought: ["Une interface plus claire et une meilleure expérience pour les utilisateurs."],
  },
];

// The Air Liquide case study, told in scenes; drawn from Mathis's 2025–2026 activity report.
// Nothing here is confidential: no internal URL, real account or real code is shown.
export const airLiquide = {
  logo: "/media/experiences/air-liquide-logo.svg",
  cover: {
    image: "/media/experiences/la-defense-coeur-defense.jpg",
    alt: "Tour Cœur Défense et le quartier de La Défense à Courbevoie, sous un ciel bleu",
    credit: "Photo : Daniel Case, CC BY-SA 4.0, via Wikimedia Commons",
  },
  credits: [
    { label: "Daniel Case, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:C%C5%93ur_D%C3%A9fense_and_buildings_around_it,_La_D%C3%A9fense,_Paris.jpg" },
    { label: "Konushna, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Air_Liquide12.jpg" },
    { label: "BobVillars, CC0", href: "https://commons.wikimedia.org/wiki/File:Air_liquide_headquarters.jpg" },
  ],
  gallery: [
    { image: "/media/experiences/air-liquide-site-industriel.jpg", alt: "Unité de production Air Liquide de nuit, avec une cuve au logo du groupe", caption: "Un groupe industriel mondial", credit: "Photo : Konushna, CC BY-SA 3.0, via Wikimedia Commons" },
    { image: "/media/experiences/air-liquide-siege-paris.jpg", alt: "Façade en pierre du siège d’Air Liquide à Paris", caption: "Siège · Paris", credit: "Photo : BobVillars, CC0, via Wikimedia Commons" },
  ],
  pitch: "En charge du développement complet d’une application interne de double authentification : architecture, back-end serverless, interface, gestion des droits, déploiement et accompagnement des utilisateurs.",
  stats: [
    { value: 500, suffix: "+", label: "collaborateurs l’utilisent chaque jour" },
    { value: 5, suffix: "", label: "fonctions serverless" },
    { value: 2, suffix: "", label: "interfaces : app & console admin" },
    { value: 0, suffix: "", label: "code OTP exposé au navigateur ou journalisé" },
  ],
  problem: {
    title: "Des comptes partagés, des codes qui circulaient à la main.",
    points: [
      "Des comptes techniques partagés entre plusieurs équipes, protégés par une double authentification.",
      "Des codes 2FA difficiles à partager, des droits gérés dans un tableur.",
      "Une solution Apps Script qui atteignait ses limites pour des centaines d’utilisateurs.",
    ],
    question: "Comment sécuriser l’accès à ces comptes tout en le rendant fluide pour chaque équipe ?",
  },
  architecture: [
    { id: "user", label: "Collaborateur", detail: "PC · mobile" },
    { id: "okta", label: "Okta SSO", detail: "session entreprise" },
    { id: "google", label: "Google Sign-In", detail: "identité vérifiée" },
    { id: "front", label: "Firebase Hosting", detail: "HTML · CSS · JS" },
    { id: "functions", label: "Cloud Functions", detail: "Node.js 20 · JWT" },
    { id: "firestore", label: "Firestore", detail: "comptes · droits · secrets" },
    { id: "bigquery", label: "BigQuery", detail: "journaux & audit" },
    { id: "admin", label: "Console Apps Script", detail: "administration" },
  ],
  otpSteps: ["Jeton JWT vérifié", "Droits contrôlés dans Firestore", "Secret lu côté serveur", "HMAC-SHA1 · pas de 30 s", "10 codes calculés d’avance"],
  accessSteps: [
    { title: "Ajouter un collègue", text: "Un utilisateur déjà autorisé ouvre l’accès à un collègue par son e-mail, sans attendre un administrateur." },
    { title: "Retirer avec confirmation", text: "Un retrait passe par une confirmation, et chaque opération est tracée." },
    { title: "Administrer sans toucher au cloud", text: "Une console Apps Script limitée donne aux administrateurs les seules actions utiles, sans accès au projet Google Cloud." },
  ],
  logs: [
    { level: "INFO", event: "otp.request", detail: "compte : ta-reporting@…" },
    { level: "INFO", event: "access.grant", detail: "ajout : l.martin@…" },
    { level: "WARNING", event: "access.denied", detail: "utilisateur non autorisé" },
    { level: "INFO", event: "access.revoke", detail: "retrait confirmé" },
    { level: "ERROR", event: "token.invalid", detail: "session expirée · 401" },
    { level: "INFO", event: "otp.request", detail: "code : jamais enregistré" },
  ],
  environments: ["Développement", "Test", "Production"],
  skills: ["Cloud Functions", "Firestore", "BigQuery", "Firebase Hosting", "Okta SSO", "Google Sign-In", "Apps Script", "TOTP · HMAC", "Node.js 20"],
  lesson: "Le bon outil au bon endroit : Firebase pour l’application, Apps Script pour la console d’administration.",
};

// Student jobs, alongside the developer path. Each one gets its brand's art direction.
// Photos come from Wikimedia Commons under free licences and are credited where they appear;
// logos only name the employer. Dates and places are only given where Mathis's CV states them.
type Credit = { label: string; href: string };
const jobCredits: Record<string, Credit> = {
  "jo-vasque-nuit.jpg": { label: "Medea7, CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Olympic_Fire_Jardin_Tuileries_Paris_summernight.jpg" },
  "jo-vasque-jour.jpg": { label: "Pronoia, CC0", href: "https://commons.wikimedia.org/wiki/File:2024_Summer_Olympics_and_Paralympics_cauldron_-_Vasque_Olympique_Jeux_Olympiques_Paris_2024_-_2024-09-03_(1).jpg" },
  "jo-champ-de-mars.jpg": { label: "MFonzatti, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Site_olympique_Champ-de-Mars_2024.jpg" },
  "jo-volontaires.jpg": { label: "AlSepPhoenix, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Tir_arc_JO_Paris_2024_volontaires.jpg" },
  "jo-grand-palais.jpg": { label: "AlSepPhoenix, CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Grand_Palais_-_JO_Paris_2024_-_Taekwondo_(04).jpg" },
  "jo-anneaux-tour-eiffel.jpg": { label: "Ibex73, CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Olympic_rings_on_the_Eiffel_Tower_2024_(21).jpg" },
  "concert-celine-dion.jpg": { label: "Anirudh Koul, CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Celine_Dion_Concert_-_Laser_Lighting.jpg" },
  "coca-cola-canette.jpg": { label: "M0tty, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Coca-cola_50cl_can_-_Italia.jpg" },
  "coca-cola-canettes.jpg": { label: "Solomon203, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:2_cans_of_Coca-Cola_Zero_Sugar_20220124.jpg" },
  "westfield-quatre-temps.jpg": { label: "Jakub Szypulka, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Centre_commercial_Les_Quatre_Temps.jpg" },
  "westfield-terrasse.jpg": { label: "Bretwa, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Top_of_Westfield_Les_Quatre_Temps_-_2019-12-30.jpg" },
  "ewc-entree.jpg": { label: "PeaceSeekers, CC0", href: "https://commons.wikimedia.org/wiki/File:2026_Esports_World_Cup_entrance.jpg" },
  "ewc-scene.jpg": { label: "PeaceSeekers, CC0", href: "https://commons.wikimedia.org/wiki/File:2026_Esports_World_Cup_-_Mobile_Legends_competition.jpg" },
  "ewc-trophees.jpg": { label: "PeaceSeekers, CC0", href: "https://commons.wikimedia.org/wiki/File:2026_Esports_World_Cup_trophy_gallery.jpg" },
  "ewc-hall.jpg": { label: "PeaceSeekers, CC0", href: "https://commons.wikimedia.org/wiki/File:2026_Esports_World_Cup_entrance_hall.jpg" },
  "ricard-soucoupe.jpg": { label: "Tenural Tobel, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Soucoupe_publicitaire_Ricard,_bistrot_parisien,_1996.jpg" },
  "ricard-90-ans.jpg": { label: "Bertrand Soubeyrand, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:La_boisson_Ricard_f%C3%AAte_ses_90_ans_en_2022.jpg" },
  "ricard-bouteille.jpg": { label: "Хрюша, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Ricard_Pastis_01_09.jpg" },
  "loreal-siege-clichy.jpg": { label: "G.Garitan, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Loreal_Clichy_1559603.JPG" },
  "marche-etal.jpg": { label: "Palmolley, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Fruits_et_l%C3%A9gumes_sur_un_%C3%A9tal_02.jpg" },
  "huitres-ecaillage.jpg": { label: "Jean-Pierre Bazard, CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Les_Hu%C3%AEtres_de_Trousse_Chemise_(16).JPG" },
  "huitres-marche.jpg": { label: "Renhour48, CC0", href: "https://commons.wikimedia.org/wiki/File:Cancale_-_March%C3%A9_aux_hu%C3%AEtres_juin_2023A.jpg" },
};
export type JobPhoto = { src: string; alt: string; caption: string; credit: Credit };
const photo = (file: string, alt: string, caption = ""): JobPhoto => ({ src: `/media/jobs/${file}`, alt, caption, credit: jobCredits[file] });
const logo = (file: string) => `/media/jobs/${file}`;

export const studentJobs = {
  sodexo: {
    brand: "Sodexo",
    logo: logo("sodexo-logo.svg"),
    olympicLogo: logo("anneaux-olympiques.svg"),
    role: "Équipier polyvalent",
    event: "Jeux Olympiques de Paris 2024",
    dates: "07/24 — 08/24",
    place: "Paris",
    pitch: "Polyvalent sur toute la chaîne de restauration pendant les Jeux : préparation, service au comptoir, encaissement, et une hygiène sans compromis.",
    did: [
      "J’ai préparé les entrées et les desserts, et dressé les plateaux.",
      "J’ai assuré le service au comptoir et l’encaissement des repas.",
      "J’ai maintenu la propreté des locaux en respectant strictement les protocoles HACCP.",
    ],
    brought: [
      "Des repas servis vite et bien, au rythme des Jeux.",
      "La satisfaction des convives, dans le respect total des règles d’hygiène.",
    ],
    cover: photo("jo-vasque-nuit.jpg", "La vasque olympique illuminée la nuit au-dessus du jardin des Tuileries", "La vasque des Jeux, jardin des Tuileries"),
    duties: [
      { icon: "🥗", title: "Préparer", text: "Entrées et desserts, dressage des plateaux" },
      { icon: "🍽️", title: "Servir", text: "Service au comptoir, au rythme des Jeux" },
      { icon: "💳", title: "Encaisser", text: "Encaissement rapide des repas" },
      { icon: "🧼", title: "Garantir", text: "Propreté et protocoles HACCP" },
    ],
    gallery: [
      photo("jo-champ-de-mars.jpg", "Le stade éphémère du Champ-de-Mars au pied de la tour Eiffel", "Champ-de-Mars"),
      photo("jo-volontaires.jpg", "Des volontaires en tenue des Jeux sur le site de tir à l’arc", "Les volontaires"),
      photo("jo-grand-palais.jpg", "Une épreuve de taekwondo sous la verrière du Grand Palais", "Grand Palais"),
      photo("jo-anneaux-tour-eiffel.jpg", "Les anneaux olympiques suspendus à la tour Eiffel en 2024", "Les anneaux sur la tour Eiffel"),
      photo("jo-vasque-jour.jpg", "La vasque olympique en journée dans le jardin des Tuileries", "Tuileries"),
    ],
  },
  coca: {
    brand: "Coca-Cola",
    logo: logo("coca-cola-logo.svg"),
    mission: "Distribution de canettes",
    context: "Concert de Céline Dion",
    did: "J’ai distribué des canettes de Coca-Cola au public du concert de Céline Dion, en allant directement au contact des spectateurs.",
    brought: "Un relais souriant et efficace de la marque auprès d’un très large public.",
    photos: [
      photo("concert-celine-dion.jpg", "Une salle de concert plongée dans des lasers verts", "Concert de Céline Dion · photo d’illustration"),
      photo("coca-cola-canette.jpg", "Une canette de Coca-Cola tenue à la main", "La canette"),
      photo("coca-cola-canettes.jpg", "Deux canettes rouges de Coca-Cola", ""),
    ],
  },
  fuze: {
    brand: "Fuze Tea",
    logo: logo("fuze-tea-logo.svg"),
    mission: "Distribution de canettes",
    context: "Westfield Les 4 Temps, La Défense",
    did: "J’ai fait déguster Fuze Tea aux visiteurs du Westfield de La Défense en distribuant des canettes.",
    brought: "Faire découvrir la marque aux visiteurs et leur donner envie de la goûter.",
    photos: [
      photo("westfield-quatre-temps.jpg", "L’entrée illuminée du centre commercial Les Quatre Temps", "Les 4 Temps, La Défense"),
      photo("westfield-terrasse.jpg", "La terrasse du centre commercial face aux tours de La Défense", "Vue sur La Défense"),
    ],
  },
  ewc: {
    brand: "Esports World Cup 2026",
    logo: logo("ewc-logo.svg"),
    mission: "Préparation des scènes",
    context: "Montage et mise en place des espaces de compétition",
    did: "J’ai participé au montage et à la mise en place des scènes de compétition de l’Esports World Cup 2026.",
    brought: "Des scènes prêtes à temps pour accueillir les équipes et le public.",
    photos: [
      photo("ewc-scene.jpg", "Une scène de compétition esport éclairée en bleu, joueurs face à des écrans géants", "La scène"),
      photo("ewc-entree.jpg", "L’entrée de l’Esports World Cup 2026", "L’entrée"),
      photo("ewc-trophees.jpg", "La galerie des trophées de l’Esports World Cup 2026", "Les trophées"),
      photo("ewc-hall.jpg", "Le hall d’entrée de l’Esports World Cup 2026", "Le hall"),
    ],
  },
  ricard: {
    brand: "Ricard",
    mission: "Staff événementiel",
    context: "Cérémonie entre entreprises",
    did: "J’ai fait partie du staff d’une cérémonie entre entreprises : accueil des invités et service.",
    brought: "Une soirée fluide et soignée pour les invités de la marque.",
    photos: [
      photo("ricard-soucoupe.jpg", "Une soucoupe jaune de bistrot aux couleurs de Ricard", "La soucoupe"),
      photo("ricard-90-ans.jpg", "Une façade célébrant les 90 ans de Ricard", "90 ans"),
      photo("ricard-bouteille.jpg", "Une bouteille de pastis Ricard", ""),
    ],
  },
  loreal: {
    brand: "L’Oréal",
    logo: logo("loreal-logo-blanc.jpg"),
    mission: "Manutention",
    context: "Siège du groupe, Clichy",
    did: "J’ai assuré de la manutention au siège du groupe : réception, port et installation du matériel.",
    brought: "Une logistique fiable et discrète, pour que le siège tourne sans accroc.",
    photos: [photo("loreal-siege-clichy.jpg", "Le siège de L’Oréal à Clichy", "Le siège, Clichy")],
  },
  terrain: {
    photos: [
      photo("marche-etal.jpg", "Un étal de marché débordant de fruits et légumes", "Le marché"),
      photo("huitres-ecaillage.jpg", "Une écailleuse ouvre des huîtres sur une table", "L’écaillage"),
      photo("huitres-marche.jpg", "Un étal d’huîtres sur un marché", "Les huîtres"),
    ],
  },
};

export const sideJobs = {
  service: [
    { company: "DADA Drinks", role: "Commercial terrain B2B", dates: "04/24", place: "Paris", did: "J’ai négocié les conditions de vente et les prix avec différents points de vente." },
    { company: "Les Amis de Poséidon", role: "Commis aux fruits de mer", dates: "12/23 — 01/24", place: "Cormeilles-en-Parisis", did: "J’ai ouvert et préparé huîtres et coquillages, et conseillé les clients." },
    { company: "DADA Drinks", role: "Primeur au marché", dates: "02/23 — 06/23", place: "Paris", did: "J’ai monté l’étal, vendu, conseillé et encaissé au rythme du marché." },
    { company: "Divertir Pour Secourir", role: "Trésorier d’association", dates: "10/22 — 07/23", place: "Paris 14e", did: "J’ai tenu la trésorerie d’évènements caritatifs pour la cause animale." },
  ],
  achievements: [
    { icon: "⚡", title: "Rythme soutenu", detail: "Service des JO, rush de concert, marché du matin" },
    { icon: "🤝", title: "Relation client", detail: "Accueil, conseil, négociation B2B" },
    { icon: "🧾", title: "Gestion de caisse", detail: "Encaissement rapide et trésorerie d’association" },
    { icon: "📦", title: "Logistique", detail: "Manutention, réception, stocks en FIFO" },
    { icon: "🛡️", title: "Hygiène & sécurité", detail: "Protocoles HACCP en restauration collective" },
    { icon: "🌍", title: "Anglais C1", detail: "Prêt pour les équipes internationales" },
  ],
};

export const passions = [
  {
    kind: "video",
    title: "Création",
    text: "Je fais des montages vidéo et je produis mes propres musiques, en autodidacte. Cadrer, rythmer, raconter : le même soin que pour une interface.",
    tags: ["Montage vidéo", "Production musicale", "Autodidacte"],
    images: ["/media/editorial/6B6CEFDE-8017-4ABB-9CEA-B0C063FFD69C_1_105_c.jpeg"],
    color: "#d17b68",
  },
  {
    kind: "music",
    title: "Musique",
    text: "Éclectique, j’écoute tous les styles. Une playlist pour chaque phase d’un projet, et le rythme d’un morceau ressemble souvent à celui d’une bonne animation.",
    tags: ["Éclectique", "Tous les styles"],
    images: [],
    color: "#9273b2",
  },
  {
    kind: "sport",
    title: "Sport",
    text: "La régularité de l’entraînement m’a appris la persévérance et l’esprit d’équipe que je retrouve dans chaque projet.",
    tags: ["Musculation", "Skateboard", "Athlétisme", "Volley-ball"],
    images: [],
    color: "#3faaa5",
    // Years of practice, drawn as rings that fill up as the scene plays.
    disciplines: [
      { name: "Musculation", years: 5 },
      { name: "Skateboard", years: 4 },
      { name: "Athlétisme", years: 3 },
      { name: "Volley-ball", years: 2 },
    ],
  },
];

// Studies and stays abroad, placed on the atlas in chronological order; the data network links them in this order.
export const studies = [
  { code: "ARG", place: "Argenteuil", country: "France", school: "Lycée Julie Victoire Daubié", degree: "Baccalauréat général", years: "2019 — 2022", specialization: "Baccalauréat général", highlight: "", stack: [] as string[], coordinates: [2.2470, 48.9472] as [number, number], color: "#c7c3d7" },
  { code: "LYS", place: "Lyon", country: "France", school: "ESCENTECH", degree: "MBA Fullstack Development", years: "2022 — 2027", specialization: "Titre RNCP niveau 7 · Manager de projets informatiques", highlight: "École d’informatique avec immersion à l’étranger", stack: ["Full-stack", "Cloud", "Gestion de projet"], coordinates: [4.8357, 45.7640] as [number, number], color: "#a889c7" },
  { code: "DUB", place: "Dublin", country: "Irlande", school: "ESCENTECH · immersion", degree: "Immersion à l’étranger", years: "04/23 — 06/23", specialization: "Développement web front-end", highlight: "Site d’actualité UFC", stack: ["Front-end", "Site dynamique"], coordinates: [-6.2603, 53.3498] as [number, number], color: "#61bbb6" },
  { code: "BCN", place: "Barcelone", country: "Espagne", school: "ESCENTECH · immersion", degree: "Immersion à l’étranger", years: "09/23 — 11/23", specialization: "Développement full-stack e-commerce", highlight: "Boutique de maillots d’e-sport", stack: ["Full-stack", "E-commerce"], coordinates: [2.1734, 41.3851] as [number, number], color: "#d17b68" },
];

export const closing = {
  headline: ["Construisons", "la suite ensemble."],
  text: "Je recherche un CDI à partir de décembre 2027. Un poste, un projet ou simplement l’envie d’échanger : je serai ravi d’en parler.",
  status: "Disponible pour un CDI dès décembre 2027",
  links: [
    { label: "Me contacter", href: "mailto:mathis.truong95@gmail.com", primary: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mathis-truong", primary: false },
    { label: "GitHub", href: "https://github.com/FARONeye", primary: false },
  ],
};
