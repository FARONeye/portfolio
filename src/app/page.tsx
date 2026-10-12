import Image from "next/image";

const portrait = "/media/portraits/21C7AA17-2AB3-464F-9942-D4346396FAD9_1_102_o.jpeg";
const landscape = "/media/editorial/179A20D3-83DA-4AD6-82FF-CDAB89055602_1_105_c.jpeg";
const introGlyphs = Array.from("REGARDER");
const introVerbs = ["Cadrer", "Déplacer", "Composer"];

const chapters = [
  {
    number: "01",
    word: "Observer",
    title: "Tout part d’un regard.",
    body: "Une lumière, un lieu, un détail. Je prends le temps de regarder autour de moi : les idées commencent souvent là.",
    image: "/media/editorial/AC28D49D-9D04-4929-A23A-DA9494540415_1_105_c.jpeg",
    caption: "Lumière / collection personnelle",
  },
  {
    number: "02",
    word: "Expérimenter",
    title: "Puis vient l’envie d’essayer.",
    body: "Explorer une piste, changer d’angle, recommencer. J’aime ce moment où une intuition devient une expérience.",
    image: "/media/editorial/A34DDE4B-24DD-4894-80AF-DBC037B986B0_1_105_c.jpeg",
    caption: "Exploration / collection personnelle",
  },
  {
    number: "03",
    word: "Construire",
    title: "Enfin, donner forme aux idées.",
    body: "Le développement me permet de relier curiosité et concret. Chaque projet est une occasion d’apprendre et d’aller plus loin.",
    image: "/media/editorial/188E0467-E3CD-4547-8DCD-CCD6A6751292_1_105_c.jpeg",
    caption: "Perspective / collection personnelle",
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
          <div className="intro-curtain" aria-hidden="true"><span>Entrer dans le récit</span></div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div className="ticker-group" key={copy}>
              <span>Explorer</span><span className="ticker-star">✳</span>
              <span>Créer</span><span className="ticker-star">✳</span>
              <span>Apprendre</span><span className="ticker-star">✳</span>
              <span>Recommencer</span><span className="ticker-star">✳</span>
            </div>
          ))}
        </div>
      </div>

      <section id="recit" className="story" aria-labelledby="story-title">
        <div className="story-intro">
          <span className="eyebrow" data-reveal>02 / Un chemin en trois temps</span>
          <h2 id="story-title" data-reveal>Rien n&apos;est figé.<br /><em>Tout se construit.</em></h2>
          <p data-reveal>Quelques fragments de ce qui me fait avancer. Faites défiler pour suivre le fil.</p>
        </div>

        <div className="story-journey" data-story-journey>
          <div className="story-sticky" data-active-chapter="0">
            <div className="story-track">
              {chapters.map((chapter, index) => (
                <article id={`chapitre-${chapter.number}`} className={`story-panel story-panel-${index}${index === 0 ? " is-current" : ""}`} data-chapter={index} key={chapter.number}>
                  <span className="chapter-giant-number" aria-hidden="true">{chapter.number}</span>
                  <div className="story-panel-copy">
                    <span className="chapter-number">Chapitre {chapter.number} — {chapter.word}</span>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.body}</p>
                    <span className="chapter-end" aria-hidden="true">{chapter.number} / 03 <span>→</span></span>
                  </div>
                  <figure className="story-panel-image">
                    <Image src={chapter.image} alt={`Photographie personnelle illustrant ${chapter.word.toLowerCase()}`} fill loading="eager" sizes="(max-width: 760px) 100vw, 52vw" />
                    <figcaption>{chapter.caption}</figcaption>
                    <span className="story-corner story-corner-top" />
                    <span className="story-corner story-corner-bottom" />
                  </figure>
                  <span className="story-panel-word" aria-hidden="true">{chapter.word}</span>
                </article>
              ))}
            </div>
            <div className="story-rail" aria-hidden="true">
              <span>Le récit avance horizontalement</span>
              <i><b /></i>
              <span className="story-rail-count"><b>01</b><b>02</b><b>03</b> / 03</span>
            </div>
            <div className="story-transition-mark" aria-hidden="true"><span /><span /></div>
          </div>
        </div>
      </section>

      <section id="projets" className="project-journey capability-journey" data-capability-journey aria-labelledby="capability-title">
        <div className="capability-sticky">
          <div className="capability-heading">
            <span className="eyebrow">03 / Projets sélectionnés</span>
            <span className="temporary-label">Concepts provisoires</span>
          </div>
          <h2 id="capability-title" className="capability-title">
            Une idée peut<br /><em>devenir beaucoup.</em>
          </h2>

          <div className="capability-deck">
            {projectCards.map((card, index) => (
              <article className={`project-card capability-card capability-card-${index}`} data-capability-card={index} key={card.number}>
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
              </article>
            ))}
          </div>

          <div className="capability-finale" aria-hidden="true">
            <span>Cinq concepts aujourd’hui · les vrais projets demain</span>
            <strong>À construire.</strong>
            <i>↓</i>
          </div>
          <div className="capability-meter" aria-hidden="true">
            <span>Déplier les projets</span><i><b /></i><span className="capability-count">01 / 05</span>
          </div>
        </div>
      </section>

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
