import Image from "next/image";
import type { CSSProperties } from "react";
import { sideJobs, studentJobs, type JobPhoto } from "./content";

/* Student jobs, after the developer path. The same scene engine as the experiences (motion.js
   drives --enter, --inner and --leave), but every job switches to its own brand's world:
   a brand-coloured flash with the logo, then that brand's colours, type and photos. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const { sodexo, coca, fuze, ewc, ricard, loreal, terrain } = studentJobs;

const weights = { intro: 1, sodexo: 1.3, service: 1.3, coca: 1.2, fuze: 1.1, ewc: 1.2, ricard: 1.1, loreal: 1.1, terrain: 1.3 };
const units = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

// The logo wall of the opening: every world the chapter visits.
const wall = [
  { name: "Sodexo", logo: sodexo.logo, bg: "#ffffff" },
  { name: "Coca-Cola", logo: coca.logo, bg: "#ffffff" },
  { name: "Fuze Tea", logo: fuze.logo, bg: "#fdebd9" },
  { name: "Esports World Cup", logo: ewc.logo, bg: "#ffffff" },
  { name: "Ricard", text: "RICARD", bg: "#ffd100" },
  { name: "L’Oréal", logo: loreal.logo, bg: "#000000" },
  { name: "DADA Drinks", text: "DADA Drinks", bg: "#2f6b3a" },
  { name: "Les Amis de Poséidon", text: "Les Amis de Poséidon", bg: "#0f4c6e" },
  { name: "Divertir Pour Secourir", text: "Divertir Pour Secourir", bg: "#8a3f62" },
];

function Credits({ photos }: { photos: JobPhoto[] }) {
  return (
    <p className="xp-credits jb-credits">
      Photos via Wikimedia Commons :{" "}
      {photos.map((item, k) => (
        <span key={item.src}>{k > 0 && " · "}<a href={item.credit.href} target="_blank" rel="noopener noreferrer">{item.credit.label}</a></span>
      ))}
    </p>
  );
}

// The "channel switch": a flash in the brand's colour, logo first, before its world appears.
function Flash({ color, logo, text, invert = false }: { color: string; logo?: string; text?: string; invert?: boolean }) {
  return (
    <span className="jb-flash" aria-hidden="true" style={v({ "--brand": color })}>
      {logo ? <Image src={logo} alt="" width={360} height={120} unoptimized className={invert ? "is-invert" : undefined} /> : <b>{text}</b>}
    </span>
  );
}

// What Mathis did, and what it brought: the heart of every job, beyond the brand's own story.
function Brief({ did, brought }: { did: string | string[]; brought: string | string[] }) {
  const list = (value: string | string[]) => (Array.isArray(value) ? value : [value]);
  return (
    <dl className="jb-brief">
      <div><dt>Ce que j’ai fait</dt>{list(did).map((item) => <dd key={item}>{item}</dd>)}</div>
      <div><dt>Ce que j’ai apporté</dt>{list(brought).map((item) => <dd key={item}>{item}</dd>)}</div>
    </dl>
  );
}

function Frame({ item, className, sizes, priority = false, k = 0 }: { item: JobPhoto; className: string; sizes: string; priority?: boolean; k?: number }) {
  return (
    <figure className={className} style={v({ "--k": k })}>
      <Image src={item.src} alt={item.alt} fill sizes={sizes} priority={priority} />
      {item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>
  );
}

export default function Jobs() {
  return (
    <section id="jobs" className="xp-journey jb-journey" data-xp-journey aria-labelledby="jobs-title" style={v({ "--xp-units": units })}>
      <div className="xp-sticky">
        <div className="xp-hud" aria-hidden="true">
          <span className="xp-hud-company">03 / Jobs étudiants</span>
          <b className="xp-hud-step">Changer de monde</b>
          <i><b /></i>
        </div>

        {/* 00 — the logo wall: every world this chapter visits. */}
        <article className="xp-scene jb-s-intro xp-t-iris" data-xp-scene data-weight={weights.intro} data-label="Changer de monde">
          <div className="xp-copy">
            <span className="xp-kicker">03 / Jobs étudiants</span>
            <h2 id="jobs-title">Changer de monde <em>à chaque job.</em></h2>
            <p>Des Jeux Olympiques à l’esport, d’un concert à un marché : chaque mission avait ses codes, son rythme et son public. Autant de mondes, autant de façons de s’adapter.</p>
          </div>
          <div className="xp-visual jb-wall" aria-hidden="true">
            {wall.map((tile, k) => (
              <span className="jb-tile" key={tile.name} style={v({ "--k": k, "--bg": tile.bg })}>
                {tile.logo ? <Image src={tile.logo} alt="" width={240} height={80} unoptimized /> : <b>{tile.text}</b>}
              </span>
            ))}
          </div>
        </article>

        {/* 01 — the headline job: Sodexo at the Paris 2024 Olympic Games. */}
        <article className="xp-scene jb-s-sodexo xp-t-band" data-xp-scene data-weight={weights.sodexo} data-label="Sodexo · Jeux Olympiques 2024">
          <span className="jb-flash jb-flash-duo" aria-hidden="true" style={v({ "--brand": "#dfe3ec" })}>
            <Image src={sodexo.logo} alt="" width={240} height={80} unoptimized /><i>×</i><Image src={sodexo.olympicLogo} alt="" width={342} height={158} unoptimized />
          </span>
          <Frame item={sodexo.cover} className="jb-cover-photo" sizes="100vw" />
          <div className="jb-sodexo-copy">
            <span className="jb-sodexo-logo">
              <Image src={sodexo.logo} alt="Sodexo" width={240} height={80} unoptimized />
              <i aria-hidden="true">×</i>
              <Image src={sodexo.olympicLogo} alt="Jeux Olympiques" width={342} height={158} unoptimized className="jb-rings" />
            </span>
            <span className="jb-star">★ Job vedette</span>
            <h3>{sodexo.event}</h3>
            <p className="jb-sodexo-role">{sodexo.role} · {sodexo.dates} · {sodexo.place}</p>
            <p>{sodexo.pitch}</p>
          </div>
          <ul className="jb-duty-chips">{sodexo.duties.map((duty, k) => <li key={duty.title} style={v({ "--k": k })}>{duty.icon} {duty.title}</li>)}</ul>
          <Credits photos={[sodexo.cover]} />
        </article>

        {/* 02 — a service at the Games, in Sodexo's light world: the tray is built, paid, checked. */}
        <article className="xp-scene jb-s-service xp-t-side" data-xp-scene data-weight={weights.service} data-label="Sodexo · Au service des Jeux">
          <div className="xp-copy">
            <span className="xp-kicker">Sodexo · Jeux Olympiques de Paris 2024</span>
            <h3>Toute la chaîne, <em>du dressage à l’encaissement.</em></h3>
            <Brief did={sodexo.did} brought={sodexo.brought} />
          </div>
          <div className="xp-visual jb-tray" aria-hidden="true">
            <div className="jb-tray-board">
              <i className="jb-plate jb-plate-starter" /><i className="jb-plate jb-plate-dessert" /><i className="jb-cutlery" /><i className="jb-glass" />
            </div>
            <div className="jb-ticket"><b>Encaissé</b><span>Menu équipier · Paris 2024</span><i>✓</i></div>
            <div className="jb-haccp"><span>HACCP</span><b>3 °C</b><small>Chaîne du froid ✓</small></div>
          </div>
        </article>

        {/* 03 — Coca-Cola red: a concert, cans and fizz. */}
        <article className="xp-scene jb-s-coca xp-t-diag" data-xp-scene data-weight={weights.coca} data-label="Coca-Cola · Concert de Céline Dion">
          <Flash color="#f40009" logo={coca.logo} invert />
          <svg className="jb-ribbon" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 360 C 220 300, 380 420, 600 340 S 880 250, 1020 290" pathLength={100} /></svg>
          <div className="jb-bubbles" aria-hidden="true">{Array.from({ length: 16 }, (_, k) => <i key={k} style={v({ "--k": k, "--x": (k * 61) % 100, "--s": 6 + (k * 7) % 14 })} />)}</div>
          <div className="xp-copy">
            <span className="jb-brand-logo"><Image src={coca.logo} alt="Coca-Cola" width={360} height={113} unoptimized /></span>
            <h3>{coca.mission} <em>· {coca.context}</em></h3>
            <Brief did={coca.did} brought={coca.brought} />
          </div>
          <div className="xp-visual jb-coca-stage">
            <Frame item={coca.photos[0]} className="jb-coca-concert" sizes="(max-width: 760px) 90vw, 40vw" />
            <Frame item={coca.photos[1]} className="jb-coca-can" sizes="(max-width: 760px) 40vw, 16vw" />
            <Frame item={coca.photos[2]} className="jb-coca-cans" sizes="(max-width: 760px) 40vw, 16vw" />
          </div>
          <Credits photos={coca.photos} />
        </article>

        {/* 04 — Fuze Tea: a light, fruity world at the mall, with leaves drifting down. */}
        <article className="xp-scene jb-s-fuze xp-t-side" data-xp-scene data-weight={weights.fuze} data-label="Fuze Tea · Westfield La Défense">
          <Flash color="#00a651" logo={fuze.logo} invert />
          <div className="jb-leaves" aria-hidden="true">{Array.from({ length: 12 }, (_, k) => <i key={k} style={v({ "--k": k, "--x": (k * 37) % 100, "--r": (k * 53) % 360 })} />)}</div>
          <div className="xp-copy">
            <span className="jb-brand-logo"><Image src={fuze.logo} alt="Fuze Tea" width={360} height={80} unoptimized /></span>
            <h3>{fuze.mission} <em>· Westfield La Défense</em></h3>
            <Brief did={fuze.did} brought={fuze.brought} />
          </div>
          <div className="xp-visual jb-fuze-stage">
            <Frame item={fuze.photos[0]} className="jb-fuze-main" sizes="(max-width: 760px) 90vw, 40vw" />
            <Frame item={fuze.photos[1]} className="jb-fuze-side" sizes="(max-width: 760px) 50vw, 20vw" />
            <span className="jb-peach" aria-hidden="true" /><span className="jb-lemon" aria-hidden="true" />
          </div>
          <Credits photos={fuze.photos} />
        </article>

        {/* 05 — Esports World Cup: black, glitchy, a stage being set. */}
        <article className="xp-scene jb-s-ewc xp-t-band" data-xp-scene data-weight={weights.ewc} data-label="Esports World Cup 2026 · Scènes">
          <Flash color="#000000" logo={ewc.logo} invert />
          <div className="xp-copy">
            <span className="jb-brand-logo"><Image src={ewc.logo} alt="Esports World Cup" width={360} height={70} unoptimized /></span>
            <h3>{ewc.mission}</h3>
            <Brief did={ewc.did} brought={ewc.brought} />
          </div>
          <div className="xp-visual jb-ewc-grid">
            {ewc.photos.map((item, k) => <Frame key={item.src} item={item} className={`jb-ewc-photo jb-ewc-photo-${k}`} sizes="(max-width: 760px) 50vw, 30vw" k={k} />)}
            <span className="jb-ewc-scan" aria-hidden="true" />
            <span className="jb-ewc-status" aria-hidden="true">Stage setup · <b data-count={100} data-suffix="%">100%</b></span>
          </div>
          <Credits photos={ewc.photos} />
        </article>

        {/* 06 — Ricard: sun, yellow and blue. */}
        <article className="xp-scene jb-s-ricard xp-t-iris" data-xp-scene data-weight={weights.ricard} data-label="Ricard · Cérémonie entre entreprises">
          <Flash color="#ffd100" text="RICARD" />
          <span className="jb-sun" aria-hidden="true" />
          <div className="xp-copy">
            <span className="jb-ricard-mark">RICARD</span>
            <h3>{ricard.mission} <em>· {ricard.context}</em></h3>
            <Brief did={ricard.did} brought={ricard.brought} />
          </div>
          <div className="xp-visual jb-ricard-stage">
            <Frame item={ricard.photos[0]} className="jb-ricard-saucer" sizes="(max-width: 760px) 50vw, 22vw" />
            <Frame item={ricard.photos[1]} className="jb-ricard-facade" sizes="(max-width: 760px) 70vw, 30vw" />
            <Frame item={ricard.photos[2]} className="jb-ricard-bottle" sizes="(max-width: 760px) 30vw, 12vw" />
          </div>
          <Credits photos={ricard.photos} />
        </article>

        {/* 07 — L'Oréal: black and white luxury, a gold line drawn around the headquarters. */}
        <article className="xp-scene jb-s-loreal xp-t-side" data-xp-scene data-weight={weights.loreal} data-label="L’Oréal · Siège">
          <Flash color="#000000" logo={loreal.logo} />
          <div className="xp-copy">
            <span className="jb-brand-logo jb-loreal-logo"><Image src={loreal.logo} alt="L’Oréal Groupe" width={360} height={255} unoptimized /></span>
            <h3>{loreal.mission} <em>au siège</em></h3>
            <Brief did={loreal.did} brought={loreal.brought} />
          </div>
          <div className="xp-visual jb-loreal-stage">
            <Frame item={loreal.photos[0]} className="jb-loreal-photo" sizes="(max-width: 760px) 70vw, 30vw" />
            <svg className="jb-gold" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="98" height="98" pathLength={100} /></svg>
            <div className="jb-boxes" aria-hidden="true">{Array.from({ length: 5 }, (_, k) => <i key={k} style={v({ "--k": k })} />)}</div>
          </div>
          <Credits photos={loreal.photos} />
        </article>

        {/* 08 — markets, oysters, B2B and an association, pinned on kraft paper with the receipt. */}
        <article className="xp-scene jb-s-terrain xp-t-diag" data-xp-scene data-weight={weights.terrain} data-label="Terrain · Vente & restauration">
          <div className="xp-copy">
            <span className="xp-kicker">Marché · écaillage · B2B · association</span>
            <h3>Conseiller, vendre, encaisser : <em>la cadence du terrain.</em></h3>
            <ul className="jb-terrain-list">
              {sideJobs.service.map((job) => <li key={`${job.company}-${job.role}`}><b>{job.company} · {job.role}</b>{job.did}</li>)}
            </ul>
          </div>
          <div className="xp-visual jb-board">
            {terrain.photos.map((item, k) => <Frame key={item.src} item={item} className={`jb-polaroid jb-polaroid-${k}`} sizes="(max-width: 760px) 40vw, 16vw" k={k} />)}
            <div className="xp-receipt jb-receipt" aria-hidden="true">
              <p className="xp-receipt-title">Ticket · Mathis Truong</p>
              {sideJobs.service.map((job, k) => (
                <div className="xp-receipt-line" key={`${job.company}-${job.role}`} style={v({ "--k": k })}>
                  <b>{job.company}</b><span>{job.dates}</span><small>{job.role} · {job.place}</small>
                </div>
              ))}
              <div className="xp-receipt-total"><span>Total</span><b>Polyvalence ★★★★★</b></div>
              <i className="xp-receipt-barcode" />
            </div>
          </div>
          <Credits photos={terrain.photos} />
        </article>

      </div>
    </section>
  );
}
