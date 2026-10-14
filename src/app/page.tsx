import Image from "next/image";
import type { CSSProperties } from "react";
import TravelGlobe from "./TravelGlobe";

const portrait = "/media/portraits/21C7AA17-2AB3-464F-9942-D4346396FAD9_1_102_o.jpeg";
const landscape = "/media/editorial/179A20D3-83DA-4AD6-82FF-CDAB89055602_1_105_c.jpeg";
const introGlyphs = Array.from("REGARDER");
const introVerbs = ["Cadrer", "Déplacer", "Composer"];

const studyTrips = [
  {
    number: "01",
    code: "FR",
    place: "Paris",
    country: "France",
    cities: "Paris ↔ Lyon",
    title: "Le point de départ.",
    body: "De Paris à Lyon, cette première étape ouvre le parcours : changer de ville, découvrir d’autres méthodes et apprendre à regarder chaque environnement comme un nouveau terrain d’étude.",
    gallery: [
      "/media/editorial/7A7E0BCD-AB71-4BA1-A135-0D157678584A_1_105_c.jpeg",
      "/media/editorial/179A20D3-83DA-4AD6-82FF-CDAB89055602_1_105_c.jpeg",
      "/media/editorial/6B6CEFDE-8017-4ABB-9CEA-B0C063FFD69C_1_105_c.jpeg",
      "/media/editorial/95ADA646-F765-4F7D-92FF-0061B22DC9B2_1_105_c.jpeg",
    ],
    signature: "PARIS",
    emblem: "◇",
    motif: "Premiers départs · lignes urbaines",
    caption: "France / archive personnelle",
    color: "#9273b2",
  },
  {
    number: "02",
    code: "DUB",
    place: "Dublin",
    country: "Irlande",
    cities: "Dublin",
    title: "Apprendre en anglais.",
    body: "Dublin transforme le voyage en immersion : écouter autrement, prendre confiance, échanger et apprendre au contact d’une culture nouvelle.",
    gallery: [
      "/media/editorial/E6D07DB3-7C44-4319-BC7F-B20A524CA3DB_1_105_c.jpeg",
      "/media/editorial/1488A6F5-5115-49EA-B944-8C700C5759AA_1_105_c.jpeg",
      "/media/editorial/391665BB-CAC2-4720-998F-288B554439D3_1_105_c.jpeg",
      "/media/editorial/DF9C0147-1911-46A3-8474-33F006E599EE_1_105_c.jpeg",
    ],
    signature: "ÉIRE",
    emblem: "☘",
    motif: "Pluie fine · vert atlantique",
    caption: "Irlande / archive personnelle",
    color: "#3faaa5",
  },
  {
    number: "03",
    code: "BCN",
    place: "Barcelone",
    country: "Espagne",
    cities: "Barcelona",
    title: "Changer de rythme.",
    body: "À Barcelone, l’étude sort du cadre. La ville, son architecture et son énergie deviennent une manière plus spontanée d’observer, de collaborer et de créer.",
    gallery: [
      "/media/editorial/391665BB-CAC2-4720-998F-288B554439D3_1_105_c.jpeg",
      "/media/editorial/AC28D49D-9D04-4929-A23A-DA9494540415_1_105_c.jpeg",
      "/media/editorial/C5900B4D-CF48-4442-9C1D-A44E17BD2352_1_201_a.jpeg",
      "/media/editorial/DF9C0147-1911-46A3-8474-33F006E599EE_1_105_c.jpeg",
    ],
    signature: "MEDITERRÀNIA",
    emblem: "☀",
    motif: "Soleil · rythme · architecture",
    caption: "Espagne / archive personnelle",
    color: "#d17b68",
  },
  {
    number: "04",
    code: "YUL",
    place: "Montréal",
    country: "Canada",
    cities: "Montréal",
    title: "Changer de continent.",
    body: "Montréal élargit l’horizon : un nouvel équilibre entre culture francophone, influences nord-américaines et apprentissage dans une métropole en mouvement.",
    gallery: [
      "/media/editorial/5697E241-CEB6-4301-90A5-D370B221FD6C_1_105_c.jpeg",
      "/media/editorial/188E0467-E3CD-4547-8DCD-CCD6A6751292_1_105_c.jpeg",
      "/media/editorial/95ADA646-F765-4F7D-92FF-0061B22DC9B2_1_105_c.jpeg",
      "/media/editorial/A34DDE4B-24DD-4894-80AF-DBC037B986B0_1_105_c.jpeg",
    ],
    signature: "MONTRÉAL",
    emblem: "✦",
    motif: "Deux cultures · une métropole",
    caption: "Montréal / archive personnelle",
    color: "#568ca8",
  },
  {
    number: "05",
    code: "BOS",
    place: "Boston",
    country: "États-Unis",
    cities: "Boston",
    title: "Aller plus loin.",
    body: "Boston clôt cette traversée comme une nouvelle ouverture : étudier dans un environnement international, confronter les idées et revenir avec une vision plus large.",
    gallery: [
      "/media/editorial/193943EB-7EDC-4981-AD66-94F79AE8B6F7_1_105_c.jpeg",
      "/media/editorial/A34DDE4B-24DD-4894-80AF-DBC037B986B0_1_105_c.jpeg",
      "/media/editorial/1488A6F5-5115-49EA-B944-8C700C5759AA_1_105_c.jpeg",
      "/media/editorial/188E0467-E3CD-4547-8DCD-CCD6A6751292_1_105_c.jpeg",
    ],
    signature: "BOSTON",
    emblem: "◎",
    motif: "Campus · briques · nouvel horizon",
    caption: "Boston / archive personnelle",
    color: "#75344f",
  },
];

const projectCards = [
  {
    number: "01",
    label: "Expérience web",
    title: "Fragments",
    body: "Un portfolio expérimental où les photographies, les mots et le mouvement composent un récit à explorer.",
    tags: ["Direction", "Motion", "Développement"],
    image: "/media/editorial/AC28D49D-9D04-4929-A23A-DA9494540415_1_105_c.jpeg",
    imageAlt: "Paysage lumineux utilisé comme visuel provisoire du projet Fragments",
    accent: "Lumière / 001",
    color: "#9273b2",
    detail: "Une exploration de la narration web : les images deviennent des chapitres, le mouvement guide la lecture et chaque interaction révèle une nouvelle couche du récit.",
    role: "Direction créative · Développement",
  },
  {
    number: "02",
    label: "Installation numérique",
    title: "Afterimage",
    body: "Une expérience immersive provisoire qui transforme la lumière, le son et les déplacements en matière visuelle.",
    tags: ["Interaction", "Immersion", "Prototype"],
    image: "/media/editorial/A34DDE4B-24DD-4894-80AF-DBC037B986B0_1_105_c.jpeg",
    imageAlt: "Installation lumineuse bleue utilisée comme visuel provisoire du projet Afterimage",
    accent: "Mouvement / 002",
    color: "#3faaa5",
    detail: "Un espace réactif inspiré des interfaces high-tech, où la lumière et le son répondent à la présence pour créer une expérience toujours différente.",
    role: "Concept · Interaction",
  },
  {
    number: "03",
    label: "Identité interactive",
    title: "Horizon",
    body: "Une identité numérique en construction, pensée comme un système vivant qui évolue avec son contenu.",
    tags: ["Identité", "Système", "Interface"],
    image: "/media/editorial/188E0467-E3CD-4547-8DCD-CCD6A6751292_1_105_c.jpeg",
    imageAlt: "Vue urbaine utilisée comme visuel provisoire du projet Horizon",
    accent: "Perspective / 003",
    color: "#568ca8",
    detail: "Un langage visuel modulaire, entre cartographie stellaire et interface éditoriale, capable de changer sans perdre son identité.",
    role: "Identité · Design système",
  },
  {
    number: "04",
    label: "Narration éditoriale",
    title: "Solstice",
    body: "Un journal visuel provisoire où une ville change de visage au rythme de la lumière et du temps.",
    tags: ["Photographie", "Éditorial", "Rythme"],
    image: "/media/editorial/5697E241-CEB6-4301-90A5-D370B221FD6C_1_105_c.jpeg",
    imageAlt: "Ville sous un ciel orange utilisée comme visuel provisoire du projet Solstice",
    accent: "Temps / 004",
    color: "#d17b68",
    detail: "Une histoire photographique construite comme un cycle : couleurs du couchant, variations de rythme et transitions lentes racontent le passage du temps.",
    role: "Photographie · Éditorial",
  },
  {
    number: "05",
    label: "Carnet interactif",
    title: "Elsewhere",
    body: "Une archive de voyage en construction qui relie lieux, sensations et souvenirs dans un parcours contemplatif.",
    tags: ["Voyage", "Archive", "Récit"],
    image: "/media/editorial/E6D07DB3-7C44-4319-BC7F-B20A524CA3DB_1_105_c.jpeg",
    imageAlt: "Voyageur face à une vaste prairie utilisé comme visuel provisoire du projet Elsewhere",
    accent: "Ailleurs / 005",
    color: "#75344f",
    detail: "Une aventure contemplative pensée comme un journal de bord : chaque destination ouvre une scène, un souvenir et une nouvelle trajectoire.",
    role: "Narration · Expérience",
  },
];

export default function Home() {
  return (
    <main id="accueil" className="site-shell">
      <div className="page-progress" aria-hidden="true"><span /></div>
      <a className="skip-link" href="#presentation">Aller au contenu</a>

      <section id="presentation" className="intro-journey" data-intro-journey aria-labelledby="hero-title">
        <div className="intro-sticky">
          <header className="site-header" aria-label="Navigation principale">
            <a className="wordmark" href="#accueil" aria-label="Mathis Truong, accueil">
              <span className="wordmark-symbol">M<span className="wordmark-dot">.</span>T</span>
              <span className="wordmark-name">Mathis<br />Truong</span>
            </a>
            <span className="header-edition">Portfolio personnel&nbsp; / &nbsp;2026</span>
            <nav className="header-nav" aria-label="Sections du site">
              <a href="#presentation">Présentation</a>
              <a href="#projets">Projets</a>
              <a href="#univers">Mon univers</a>
              <a className="nav-external" href="https://github.com/FARONeye" target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </header>

          <div className="hero">
            <div className="hero-copy">
              <div className="hero-intro-line">
                <span className="eyebrow"><span className="eyebrow-mark" /> Bienvenue dans mon espace</span>
                <span className="section-index">01 / 05</span>
              </div>
              <h1 id="hero-title" className="hero-title">
                <span className="hero-title-line">Mathis</span>
                <span className="hero-title-line second-line">Truong<span className="title-period">.</span></span>
              </h1>
              <div className="hero-bottom">
                <p className="hero-description">
                  Développement, création et curiosité.<br />
                  Un portfolio pour raconter ce que je construis et ce qui m&apos;inspire.
                </p>
                <a className="round-link" href="#recit" aria-label="Découvrir mon histoire">
                  <span aria-hidden="true">↘</span>
                </a>
              </div>
            </div>

            <figure className="hero-portrait">
              <Image
                src={portrait}
                alt="Portrait en noir et blanc de Mathis Truong"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 100vw"
                className="portrait-image"
              />
              <figcaption className="portrait-caption">
                <span>Portrait / 001</span><span>Mathis Truong</span>
              </figcaption>
              <span className="portrait-scan" aria-hidden="true" />
            </figure>
            <div className="hero-kinetic" aria-hidden="true">
              <span>Curiosité</span><span>Création</span><span>Développement</span>
            </div>
            <div className="hero-side-note" aria-hidden="true">Portfolio — édition personnelle</div>
            <a className="scroll-invitation" href="#recit">Défiler pour découvrir <span aria-hidden="true">↓</span></a>
          </div>

          <div className="intro-narration" aria-hidden="true">
            <p className="intro-beat intro-beat-1"><span>01</span> Un regard suffit pour déplacer le réel.</p>
            <p className="intro-beat intro-beat-2"><span>02</span> L’image se plie. Une idée prend forme.</p>
            <p className="intro-beat intro-beat-3"><span>03</span> Je transforme l’intuition en expérience.</p>
          </div>
          <div className="intro-shutter-stage" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => <span data-intro-shutter={index} key={index} />)}
          </div>
          <div className="intro-glyph-word" aria-hidden="true">
            {introGlyphs.map((glyph, index) => <span data-intro-glyph={index} key={`${glyph}-${index}`}>{glyph}</span>)}
          </div>
          <div className="intro-filmstrip" aria-hidden="true">
            <figure className="film-frame film-frame-1">
              <Image src="/media/editorial/391665BB-CAC2-4720-998F-288B554439D3_1_105_c.jpeg" alt="" fill loading="eager" sizes="64vw" />
            </figure>
            <figure className="film-frame film-frame-2">
              <Image src="/media/editorial/193943EB-7EDC-4981-AD66-94F79AE8B6F7_1_105_c.jpeg" alt="" fill loading="eager" sizes="64vw" />
            </figure>
            <figure className="film-frame film-frame-3">
              <Image src="/media/editorial/6B6CEFDE-8017-4ABB-9CEA-B0C063FFD69C_1_105_c.jpeg" alt="" fill loading="eager" sizes="64vw" />
            </figure>
          </div>
          <div className="intro-verb-stack" aria-hidden="true">
            {introVerbs.map((verb, index) => <span data-intro-verb={index} key={verb}>{verb}</span>)}
          </div>
          <div className="intro-fold-mark" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="intro-film-grain" aria-hidden="true" />
          <div className="intro-meter" aria-hidden="true">
            <span className="intro-meter-label">Ouverture</span>
            <i><b /></i>
            <span className="intro-meter-count">00</span>
          </div>
          <div className="intro-curtain" aria-hidden="true">
            <div className="intro-handoff-stars"><i /><i /><i /></div>
            <div className="intro-handoff-orbit"><i /><i /></div>
            <div className="intro-handoff-copy">
              <span>Le récit continue</span>
              <strong>L&apos;expérience<br /><em>change d&apos;échelle.</em></strong>
            </div>
            <div className="intro-handoff-route"><span>Moi</span><b /><span>Le monde</span></div>
          </div>
          <div id="recit" className="story-intro story-intro-overlay" data-travel-intro>
            <div className="travel-intro-stage">
              <span className="eyebrow">02 / Voyages d&apos;études</span>
              <h2 id="story-title"><span>Apprendre n&apos;a pas</span><em>de frontières.</em></h2>
              <p>De Paris à Boston, cinq étapes et autant de façons d’apprendre. Montez à bord : le scroll devient votre trajectoire.</p>
              <div className="travel-intro-pass" aria-hidden="true">
                <span>Study trip</span><strong>05 escales</strong><i>MT / WORLD</i>
              </div>
              <div className="travel-intro-orbit" aria-hidden="true"><i /><i /><i /></div>
              <div className="travel-intro-route" aria-hidden="true"><span>PAR</span><b /><span>BOS</span></div>
              <div className="travel-intro-wipe" aria-hidden="true"><span>Embarquement</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="story" aria-labelledby="story-title">
        <div className="story-journey" data-story-journey>
          <div className="story-sticky" data-active-chapter="0">
            <TravelGlobe />
            <div className="travel-cinema-heading" aria-hidden="true">
              <span>02 / Journal de voyage</span>
              <b>Paris — Boston</b>
            </div>
            <div className="story-track">
              {studyTrips.map((trip, index) => (
                <article
                  id={`escale-${trip.number}`}
                  className={`story-panel travel-panel story-panel-${index}${index === 0 ? " is-current is-present" : ""}`}
                  data-chapter={index}
                  key={trip.number}
                  style={{ "--trip-accent": trip.color, "--place-chars": trip.place.length } as CSSProperties}
                >
                  <div className="travel-country-sign" aria-hidden="true">
                    <span>{trip.signature}</span><b>{trip.emblem}</b><small>{trip.motif}</small>
                    <i /><i /><i />
                  </div>
                  <div className="travel-memory-gallery">
                    {trip.gallery.map((image, photoIndex) => (
                      <figure className={`travel-memory-photo travel-memory-photo-${photoIndex + 1}`} data-travel-photo={photoIndex} key={image}>
                        <Image
                          src={image}
                          alt={`Souvenir personnel de ${trip.place}, photographie ${photoIndex + 1}`}
                          fill
                          loading="eager"
                          unoptimized={image.includes("7A7E0BCD")}
                          sizes={photoIndex === 0 ? "(max-width: 760px) 100vw, 72vw" : "(max-width: 760px) 46vw, 28vw"}
                        />
                        <figcaption>{trip.caption} / {String(photoIndex + 1).padStart(2, "0")}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <div className="story-panel-copy travel-memory-copy">
                    <span className="chapter-number">Escale {trip.number} · {trip.country}</span>
                    <h3>{trip.place}</h3>
                    <p className="travel-memory-title">{trip.title}</p>
                    <p>{trip.body}</p>
                    <div className="travel-memory-meta">
                      <span>{trip.cities}</span><b>{trip.code}</b><i>{trip.number} / 05</i>
                    </div>
                  </div>
                  <span className="travel-memory-word" aria-hidden="true">{trip.place}</span>
                </article>
              ))}
            </div>
            <div className="travel-atmosphere-wipe" aria-hidden="true"><i /><i /></div>
            <div className="story-rail travel-chapter-rail" aria-hidden="true">
              <span>Défiler pour faire décoller l&apos;histoire</span>
              <i><b /></i>
              <span className="story-rail-count"><b>PAR</b><b>DUB</b><b>BCN</b><b>YUL</b><b>BOS</b> / 05</span>
            </div>
          </div>
        </div>
      </section>

      <section id="projets" className="project-journey capability-journey" data-capability-journey aria-labelledby="capability-title">
        <div className="capability-sticky">
          <div className="capability-heading">
            <span className="eyebrow">03 / Galerie de projets</span>
            <span className="temporary-label">Concepts provisoires</span>
          </div>
          <h2 id="capability-title" className="capability-title">
            Mes projets.<br /><em>Choisissez une histoire.</em>
          </h2>
          <div className="project-instruction" aria-live="polite">
            <span className="project-instruction-kicker">Mode exploration</span>
            <p><strong>Faites défiler</strong> pour choisir un projet, puis <strong>cliquez sur la carte active</strong> pour l&apos;ouvrir.</p>
            <span className="project-instruction-icon" aria-hidden="true">↘</span>
          </div>

          <div className="capability-deck">
            {projectCards.map((card, index) => (
              <article
                className={`project-card capability-card capability-card-${index}`}
                data-capability-card={index}
                key={card.number}
                style={{ "--project-accent": card.color } as CSSProperties}
              >
                <figure className="project-card-image">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(max-width: 760px) 100vw, 58vw" />
                  <figcaption>{card.accent}</figcaption>
                </figure>
                <div className="project-card-shade" aria-hidden="true" />
                <div className="capability-card-top project-card-top">
                  <span>{card.number}</span><span>{card.label}</span>
                </div>
                <div className="capability-card-copy project-card-copy">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <ul aria-label={`Mots-clés : ${card.tags.join(", ")}`}>
                    {card.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <span className="project-card-object" aria-hidden="true"><i /><i /></span>
                <span className="project-card-sequence" aria-hidden="true">Projet — {card.number} / 05</span>
                <button
                  className="project-card-hit"
                  type="button"
                  data-project-open={index}
                  aria-haspopup="dialog"
                  aria-controls="project-viewer"
                  aria-label={`Ouvrir le projet ${card.title}`}
                >
                  <span>Voir le projet</span><i aria-hidden="true">↗</i>
                </button>
              </article>
            ))}
          </div>

          <div className="capability-finale" aria-hidden="true">
            <span>Cinq concepts aujourd’hui · les vrais projets demain</span>
            <strong>À construire.</strong>
            <i>↓</i>
          </div>
          <div className="capability-meter" aria-hidden="true">
            <span>Défiler · choisir · cliquer</span><i><b /></i><span className="capability-count">01 / 05</span>
          </div>
        </div>
      </section>

      <dialog id="project-viewer" className="project-viewer" data-project-viewer aria-label="Détail du projet sélectionné">
        <button className="project-viewer-close" type="button" data-project-close aria-label="Fermer le projet">
          <span>Fermer</span><i aria-hidden="true">×</i>
        </button>
        {projectCards.map((card, index) => (
          <article
            className="project-viewer-panel"
            data-project-panel={index}
            style={{ "--project-accent": card.color } as CSSProperties}
            hidden={index !== 0}
            key={card.number}
          >
            <figure className="project-viewer-image">
              <Image src={card.image} alt={card.imageAlt} fill sizes="(max-width: 760px) 100vw, 54vw" />
              <figcaption>{card.accent}</figcaption>
            </figure>
            <div className="project-viewer-copy">
              <div className="project-viewer-meta">
                <span>Projet {card.number} / 05</span><span>Concept provisoire</span>
              </div>
              <p className="project-viewer-label">{card.label}</p>
              <h2 id={`project-viewer-title-${index}`}>{card.title}</h2>
              <p className="project-viewer-detail">{card.detail}</p>
              <dl>
                <div><dt>Rôle</dt><dd>{card.role}</dd></div>
                <div><dt>Statut</dt><dd>À personnaliser</dd></div>
              </dl>
              <ul aria-label={`Mots-clés : ${card.tags.join(", ")}`}>
                {card.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <p className="project-viewer-note">Contenu de démonstration — cette fiche accueillera bientôt le vrai projet.</p>
            </div>
          </article>
        ))}
      </dialog>

      <section id="univers" className="about" aria-labelledby="about-title">
        <div className="about-heading" data-reveal>
          <span className="eyebrow dark-eyebrow">04 / Quelques mots</span>
          <h2 id="about-title">La suite se<br /><em>construit.</em></h2>
        </div>
        <div className="about-body" data-reveal>
          <p>
            Je m&apos;appelle Mathis. J&apos;aime apprendre en faisant, explorer de nouvelles idées
            et leur donner une forme concrète. Ce site est un espace en évolution où
            se rencontreront mon parcours, mes projets et mes inspirations.
          </p>
          <a href="https://github.com/FARONeye" target="_blank" rel="noopener noreferrer" className="text-link">
            Voir ce que je construis sur GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <figure className="about-image" data-reveal>
          <Image
            src={landscape}
            alt="Paysage au coucher du soleil, issu des photographies de Mathis"
            fill
            sizes="(max-width: 760px) 100vw, 36vw"
            className="landscape-image"
          />
          <figcaption>Un regard ailleurs / collection personnelle</figcaption>
        </figure>
      </section>

      <section className="outro" aria-labelledby="outro-title">
        <div className="outro-image" aria-hidden="true">
          <Image src="/media/portraits/15DA74D7-7A5A-4209-A366-588B874A98EF_1_102_o.jpeg" alt="" fill sizes="(max-width: 760px) 100vw, 38vw" />
        </div>
        <div className="outro-content">
          <span className="eyebrow" data-reveal>05 / À suivre</span>
          <h2 id="outro-title" data-reveal>L&apos;histoire<br /><em>continue.</em></h2>
          <p data-reveal>Le portfolio évoluera au rythme des projets, des découvertes et des nouvelles idées.</p>
          <a className="outro-link" href="https://github.com/FARONeye" target="_blank" rel="noopener noreferrer" data-reveal>
            Explorer mon GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <span>Mathis Truong © 2026</span>
        <span>À suivre : projets & histoires</span>
        <a href="#accueil">Retour en haut ↑</a>
      </footer>
    </main>
  );
}
