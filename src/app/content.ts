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
};

// Passions, one world per scene. Artist facts come from their Wikipedia pages (October 2026);
// photos are from Wikimedia Commons under free licences and credited where they appear.
const passionCredits: Record<string, Credit> = {
  "joji-live.png": { label: "Samuel Kenwright, CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Joji_Performing_Live_in_2018.png" },
  "don-toliver-portrait.jpg": { label: "Sanchez Productions, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Don_Toliver_by_Sanchez_Productions.jpg" },
  "don-toliver-studio.jpg": { label: "Sanchez Productions, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Don_by_Sanchez.jpg" },
  "bad-bunny-portrait.jpg": { label: "Glenn Francis (Toglenn), CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Bad_Bunny_2019_by_Glenn_Francis_(cropped).jpg" },
  "bad-bunny-lisbonne-2026.jpg": { label: "Stillfatnomar, CC0", href: "https://commons.wikimedia.org/wiki/File:Bad_Bunny_performing_at_Est%C3%A1dio_Da_Luz,_Lisbon,_27_May_2026.jpg" },
  "bad-bunny-met-gala-2026.jpg": { label: "SWinxy, CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Guests_at_the_2026_Met_Gala_385.jpg" },
  "musculation-salle.jpg": { label: "Cobragym1, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Pin_loaded_machine.jpg" },
  "skate-kickflip.jpg": { label: "Almonroth, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Skateboarding_kickflip.jpg" },
  "skate-pier7.jpg": { label: "Kylelovesyou, CC0", href: "https://commons.wikimedia.org/wiki/File:Skateboarding_at_San_Francisco_Pier_7.jpg" },
  "athletisme-sprint.jpg": { label: "Sport the library, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:211000_-_Athletics_track_100m_semi_Don_Elgin_action_-_3b_-_2000_Sydney_race_photo.jpg" },
  "athletisme-arrivee.jpg": { label: "Sport the library, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:141100_-_Athletics_track_finish_line_from_above_-_3b_-_2000_Sydney_race_photo.jpg" },
  "volley-smash.jpg": { label: "FEMA, domaine public", href: "https://commons.wikimedia.org/wiki/File:Male_beach_volleyball_player_spiking_a_volleyball.jpg" },
  "volley-plage.jpg": { label: "Chris Hunkeler, CC BY-SA 2.0", href: "https://commons.wikimedia.org/wiki/File:Beach_volleyball_(7354193838).jpg" },
};
const passionPhoto = (file: string, alt: string, caption = ""): JobPhoto => ({ src: `/media/passions/${file}`, alt, caption, credit: passionCredits[file] });

export const passions = {
  video: {
    title: "Montage vidéo",
    tool: "CapCut",
    logo: "/media/passions/capcut-icon.svg",
    shots: ["/media/editorial/6B6CEFDE-8017-4ABB-9CEA-B0C063FFD69C_1_105_c.jpeg", "/media/editorial/179A20D3-83DA-4AD6-82FF-CDAB89055602_1_105_c.jpeg"],
    text: "Je monte mes propres vidéos sur CapCut, en autodidacte : dérusher, couper au bon moment, poser les transitions et caler les plans sur le rythme de la musique.",
    tags: ["Montage", "Rythme", "Narration", "Autodidacte"],
    image: "/media/editorial/6B6CEFDE-8017-4ABB-9CEA-B0C063FFD69C_1_105_c.jpeg",
  },
  production: {
    title: "Production musicale",
    tool: "FL Studio",
    logo: "/media/passions/fl-studio-logo.png",
    icon: "/media/passions/fl-studio-icon.png",
    // My own productions, streamed from SoundCloud through its official player. To add a song,
    // add it to a SoundCloud playlist and list it here with its SoundCloud link.
    soundcloud: {
      profile: "https://soundcloud.com/mathis-truong",
      playlists: [
        { title: "2026 trash", year: 2026, url: "https://soundcloud.com/mathis-truong/sets/2026a1", tracks: [
          { title: "Mario sprint", url: "https://soundcloud.com/mathis-truong/jazz-pure", length: "0:48" },
          { title: "hoodtrap pt1", url: "https://soundcloud.com/mathis-truong/hoodtrap-pt1", length: "0:39" },
          { title: "du lourd", url: "https://soundcloud.com/mathis-truong/du-lourd", length: "1:37" },
          { title: "ESDEEKID MIST", url: "https://soundcloud.com/mathis-truong/esdeekid-mist", length: "0:39" },
          { title: "playboi crashtest", url: "https://soundcloud.com/mathis-truong/playboi-crashtest", length: "0:21" },
        ] },
        { title: "2023 trash", year: 2023, url: "https://soundcloud.com/mathis-truong/sets/2023a1", tracks: [
          { title: "PLUGNNB", url: "https://soundcloud.com/mathis-truong/plugnnb", length: "1:01" },
          { title: "BIENNNG", url: "https://soundcloud.com/mathis-truong/biennng", length: "0:46" },
          { title: "BEll_2", url: "https://soundcloud.com/mathis-truong/bell_2", length: "1:18" },
        ] },
      ],
    },
    text: "Je compose et produis mes propres sons sur FL Studio, en autodidacte : une mélodie, des batteries programmées pas à pas, des basses, puis le mixage.",
    steps: ["Mélodie au piano roll", "Batterie au step sequencer", "808 et basses", "Mixage et export"],
    // The step sequencer pattern: 1 = hit. Kick, snare, hi-hat, 808.
    pattern: [
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    ],
  },
  listening: {
    logo: "/media/passions/spotify-logo.png",
    icon: "/media/passions/spotify-icon.svg",
    text: "J’écoute de tout, tout le temps, sur Spotify. Trois artistes reviennent sans cesse dans mes écoutes.",
  },
  // Each artist plays one song while their scene is on screen: the official 30-second preview
  // from Apple Music (iTunes Search API). To change a song, look it up on music.apple.com and
  // replace preview / artwork / link — or ask Claude to fetch them for a given title.
  artists: [
    {
      name: "Joji",
      lettering: "joji",
      realName: "George Kusunoki Miller",
      origin: "Né à Osaka (Japon) · australien",
      genre: "R&B · lo-fi · trip-hop",
      label: "88rising",
      labelLogo: "/media/passions/88rising-logo.svg",
      color: "#7ea4d8",
      intro: "Une voix douce et mélancolique, des productions lentes et feutrées : le R&B lo-fi de Joji est fait pour les longues nuits.",
      albums: [{ title: "Ballads 1", year: 2018, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b8/42/74/b8427409-1c8f-5c8a-dee2-82a4ed7b6954/190296940323.jpg/600x600bb.jpg" }, { title: "Nectar", year: 2020, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/06/fb/8e/06fb8e9a-6748-3bad-8a84-5d00b15e4857/190296849497.jpg/600x600bb.jpg" }, { title: "Smithereens", year: 2022, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/53/97/a8/5397a8df-b197-6eae-8b53-a4c871563a54/93624864394.jpg/600x600bb.jpg" }, { title: "Piss in the Wind", year: 2026, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/58/1b/85/581b8559-1868-e64c-c796-b117bb417dcc/198704821745_Cover.jpg/600x600bb.jpg" }],
      hits: ["Glimpse of Us", "Slow Dancing in the Dark", "Sanctuary"],
      fact: "Avec Ballads 1, il devient le premier artiste asiatique en tête du classement Billboard Top R&B/Hip-Hop Albums.",
      stat: { value: "N°8", label: "« Glimpse of Us » au Billboard Hot 100" },
      song: {
        title: "Die for You",
        album: "Smithereens",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/47/4e/31/474e31a5-5d0f-5e48-868f-60487004c113/mzaf_1175503825665906253.plus.aac.p.m4a",
        artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/2a/43/d02a433a-3ab8-9a94-b07d-1dc599b64966/93624864387.jpg/600x600bb.jpg",
        link: "https://music.apple.com/us/album/die-for-you/1776748879",
      },
      photos: [
        { src: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/06/fb/8e/06fb8e9a-6748-3bad-8a84-5d00b15e4857/190296849497.jpg/1400x1400bb.jpg", alt: "Portrait de Joji en lumière rouge, pochette de l’album Nectar", caption: "Nectar, 2020", credit: { label: "Pochette « Nectar » (88rising), via Apple Music", href: "https://music.apple.com/us/album/nectar/1524813433" } },
        passionPhoto("joji-live.png", "Joji chante sur scène en 2018, sous des néons", "En concert, 2018"),
      ],
    },
    {
      name: "Bad Bunny",
      lettering: "bunny",
      realName: "Benito Antonio Martínez Ocasio",
      origin: "Bayamón (Porto Rico)",
      genre: "Reggaeton · trap latino",
      label: "Rimas Entertainment",
      color: "#e83f6f",
      intro: "Le roi du reggaeton et du trap latino, qui a imposé l’espagnol tout en haut des classements mondiaux.",
      albums: [{ title: "X 100pre", year: 2018, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/cf/3a/db/cf3adbe6-8ea1-f60f-60fd-713eefda3962/193483317984.jpg/600x600bb.jpg" }, { title: "YHLQMDLG", year: 2020, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8c/0f/81/8c0f81f2-9f10-5e3d-b9de-5961a73e8e52/195081078724.jpg/600x600bb.jpg" }, { title: "Un Verano Sin Ti", year: 2022, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3e/04/eb/3e04ebf6-370f-f59d-ec84-2c2643db92f1/196626945068.jpg/600x600bb.jpg" }, { title: "Nadie Sabe…", year: 2023, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/00/e0/31/00e0311e-9dab-fd0c-fc37-ee3d36aafbf3/197190137897.jpg/600x600bb.jpg" }, { title: "Debí Tirar Más Fotos", year: 2025, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/90/5e/7e/905e7ed5-a8fa-a8f3-cd06-0028fdf3afaa/199066342442.jpg/600x600bb.jpg" }],
      hits: ["DtMF", "Tití Me Preguntó", "Dákiti", "Me Porto Bonito"],
      fact: "Debí Tirar Más Fotos remporte le Grammy de l’album de l’année en 2026 — une première pour un album en espagnol — et il assure le show de la mi-temps du Super Bowl LX.",
      stat: { value: "4×", label: "artiste le plus écouté au monde sur Spotify" },
      song: {
        title: "Baile Inolvidable",
        album: "Debí Tirar Más Fotos",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3a/ea/38/3aea38e3-106b-db96-7beb-5d2bc02bdf70/mzaf_17568275540135957611.plus.aac.p.m4a",
        artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/90/5e/7e/905e7ed5-a8fa-a8f3-cd06-0028fdf3afaa/199066342442.jpg/600x600bb.jpg",
        link: "https://music.apple.com/us/album/baile-inolvidable/1787022393",
      },
      photos: [
        passionPhoto("bad-bunny-portrait.jpg", "Portrait de Bad Bunny en lunettes de soleil", "Bad Bunny"),
        passionPhoto("bad-bunny-lisbonne-2026.jpg", "Bad Bunny en concert à Lisbonne en mai 2026, tournée Debí Tirar Más Fotos", "Tournée DtMF, Lisbonne 2026"),
        passionPhoto("bad-bunny-met-gala-2026.jpg", "Bad Bunny, cheveux blancs et costume noir, au Met Gala 2026", "Met Gala, mai 2026"),
      ],
    },
    {
      name: "Don Toliver",
      lettering: "don",
      realName: "Caleb Zackery Toliver",
      origin: "Houston, Texas (États-Unis)",
      genre: "Hip-hop · trap · R&B",
      label: "Cactus Jack · Atlantic",
      color: "#e0a14f",
      intro: "Une voix aérienne et reconnaissable entre mille, posée sur des productions trap psychédéliques venues de Houston.",
      albums: [{ title: "Heaven or Hell", year: 2020, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a5/c2/a5/a5c2a541-9f56-7c98-eb01-3c3198267851/075679823908.jpg/600x600bb.jpg" }, { title: "Life of a Don", year: 2021, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fc/ca/a0/fccaa0f7-0c60-0f80-ab06-5b3c7e23e240/075679767868.jpg/600x600bb.jpg" }, { title: "Love Sick", year: 2023, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/15/3a/d1/153ad1fe-7884-a2e5-18be-750a21bd1af1/075679699893.jpg/600x600bb.jpg" }, { title: "Hardstone Psycho", year: 2024, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/3c/5d/223c5d96-501e-040e-a34d-0608e6e5c4ff/075679638434.jpg/600x600bb.jpg" }, { title: "Octane", year: 2026, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e8/e5/c6/e8e5c690-a958-622e-eb62-0dce6059300e/075679599360.jpg/600x600bb.jpg" }],
      hits: ["After Party", "No Idea", "Lemonade", "Bandit"],
      fact: "« No Idea » et « After Party » sont tous deux certifiés triple platine, et Octane devient en 2026 son premier album numéro 1.",
      stat: { value: "N°1", label: "Octane au Billboard 200" },
      song: {
        title: "Bus Stop (feat. Brent Faiyaz)",
        album: "Love Sick",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/89/c0/c3/89c0c39c-45a2-bddb-2808-a37369d7f151/mzaf_2134455710884314382.plus.aac.p.m4a",
        artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/15/3a/d1/153ad1fe-7884-a2e5-18be-750a21bd1af1/075679699893.jpg/600x600bb.jpg",
        link: "https://music.apple.com/us/album/bus-stop-feat-brent-faiyaz/1672446197",
      },
      photos: [
        passionPhoto("don-toliver-portrait.jpg", "Portrait de Don Toliver en lunettes de soleil", "Don Toliver"),
        passionPhoto("don-toliver-studio.jpg", "Don Toliver photographié en studio", ""),
      ],
    },
  ],
  sports: [
    {
      kind: "muscu", name: "Musculation", years: 5, color: "#e0533d",
      text: "Cinq ans de séances régulières : la discipline, la patience et une progression qui se mesure semaine après semaine.",
      lesson: "Régularité",
      photos: [passionPhoto("musculation-salle.jpg", "Une salle de musculation avec des machines à charge guidée", "La salle")],
    },
    {
      kind: "skate", name: "Skateboard", years: 4, color: "#f0c04a",
      text: "Tomber, se relever, retenter le trick jusqu’à le poser : le skate m’a appris à persévérer.",
      lesson: "Persévérance",
      photos: [
        passionPhoto("skate-kickflip.jpg", "Un skateur en plein kickflip", "Kickflip"),
        passionPhoto("skate-pier7.jpg", "Le spot de skate de Pier 7 à San Francisco", ""),
      ],
    },
    {
      kind: "athle", name: "Athlétisme", years: 3, color: "#3faaa5",
      text: "Le chrono ne ment pas : se fixer un objectif, s’entraîner pour le battre, recommencer.",
      lesson: "Dépassement de soi",
      photos: [
        passionPhoto("athletisme-sprint.jpg", "Un sprinteur sur une piste d’athlétisme", "Le sprint"),
        passionPhoto("athletisme-arrivee.jpg", "La ligne d’arrivée d’une piste vue d’en haut", ""),
      ],
    },
    {
      kind: "volley", name: "Volley-ball", years: 2, color: "#2e6be6",
      text: "Un point ne se gagne jamais seul : communication, placement et confiance dans l’équipe.",
      lesson: "Esprit d’équipe",
      photos: [
        passionPhoto("volley-smash.jpg", "Un joueur de beach-volley frappe le ballon au-dessus du filet", "Le smash"),
        passionPhoto("volley-plage.jpg", "Un joueur de beach-volley au service", ""),
      ],
    },
  ],
};

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
