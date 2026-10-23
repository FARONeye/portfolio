import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { passions, type JobPhoto } from "./content";

/* 04 — Passions, one world per scene, on the same scene engine as the experiences and jobs
   (motion.js drives --enter, --inner and --leave). Each world opens with its own flash. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const { video, production, listening, artists, sports } = passions;
const { soundcloud } = production;
const firstTrack = soundcloud.playlists[0].tracks[0];

const weights = { intro: 1, video: 1.2, production: 1.4, spotify: 1.1, artist: 1.35, sports: 1.6 };
const units = weights.intro + weights.video + weights.production + weights.spotify + weights.artist * artists.length + weights.sports;

function Credits({ photos }: { photos: JobPhoto[] }) {
  return (
    <p className="xp-credits jb-credits">
      Crédits photos :{" "}
      {photos.map((item, k) => (
        <span key={item.src}>{k > 0 && " · "}<a href={item.credit.href} target="_blank" rel="noopener noreferrer">{item.credit.label}</a></span>
      ))}
    </p>
  );
}

function Flash({ color, children }: { color: string; children: ReactNode }) {
  return <span className="jb-flash ps-flash" aria-hidden="true" style={v({ "--brand": color })}>{children}</span>;
}

// One drawn sign per discipline, for the sport chapter's title and its tile on the opening page.
const sportIcons: Record<string, ReactNode> = {
  muscu: <path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11" />,
  skate: <><path d="M2.5 11.5c.4 1.6 1.6 2.5 3.2 2.5h12.6c1.6 0 2.8-.9 3.2-2.5" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></>,
  athle: <><circle cx="12" cy="13.5" r="7" /><path d="M12 13.5V9.5M10 3h4M12 3v3.5M18 7.5l1.5-1.5" /></>,
  volley: <><circle cx="12" cy="12" r="9" /><path d="M12 12c0-4 1.8-7 5-8.5M12 12c-3.4 2.2-7 2.4-9.6 1.2M12 12c3.4 2 5.2 5.2 4.8 8.6" /></>,
};
function SportIcon({ kind, k = 0 }: { kind: string; k?: number }) {
  return <svg className="ps-sport-icon" viewBox="0 0 24 24" aria-hidden="true" style={v({ "--k": k })}>{sportIcons[kind]}</svg>;
}

function Frame({ item, className, sizes, k = 0 }: { item: JobPhoto; className: string; sizes: string; k?: number }) {
  return (
    <figure className={className} style={v({ "--k": k })}>
      <Image src={item.src} alt={item.alt} fill sizes={sizes} />
      {item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>
  );
}

export default function Passions() {
  return (
    <section id="passions" className="xp-journey pa-journey" data-xp-journey aria-labelledby="passions-title" style={v({ "--xp-units": units })}>
      <div className="xp-sticky">
        <div className="xp-hud" aria-hidden="true">
          <span className="xp-hud-company">04 / Passions</span>
          <b className="xp-hud-step">Ce qui me fait vibrer</b>
          <i><b /></i>
        </div>

        {/* 00 — the four worlds at a glance. */}
        <article className="xp-scene pa-s-intro xp-t-iris" data-xp-scene data-weight={weights.intro} data-label="Ce qui me fait vibrer">
          <div className="xp-copy">
            <span className="xp-kicker">04 / Passions</span>
            <h2 id="passions-title">Ce qui me fait <em>vibrer.</em></h2>
            <p>Créer des vidéos et des sons, écouter les artistes qui m’accompagnent au quotidien, et me dépasser par le sport.</p>
          </div>
          <div className="xp-visual pa-worlds" aria-hidden="true">
            <span className="pa-world pa-world-video" style={v({ "--k": 0 })}><Image src={video.logo} alt="" width={72} height={72} unoptimized /><span>CapCut · montage vidéo</span></span>
            <span className="pa-world pa-world-fl" style={v({ "--k": 1 })}><Image src={production.logo} alt="" width={218} height={54} unoptimized /></span>
            <span className="pa-world pa-world-spotify" style={v({ "--k": 2 })}><Image src={listening.logo} alt="" width={220} height={60} unoptimized /></span>
            <span className="pa-world pa-world-sport" style={v({ "--k": 3 })}>
              <span className="pa-world-icons">{sports.map((sport, k) => <SportIcon kind={sport.kind} k={k} key={sport.kind} />)}</span>
              <span>Sport · {sports.length} disciplines</span>
            </span>
          </div>
        </article>

        {/* 01 — video editing in CapCut: the CapCut mark is itself the transition between two shots. */}
        <article className="xp-scene pa-s-video xp-t-side" data-xp-scene data-weight={weights.video} data-label="Création · Montage vidéo">
          <span className="jb-flash ps-flash pa-capcut-flash" aria-hidden="true" style={v({ "--brand": "#ffffff" })}>
            <Image src={video.logo} alt="" width={240} height={240} unoptimized />
          </span>
          <div className="xp-copy">
            <span className="xp-kicker">Création · 01 / 02</span>
            <span className="pa-capcut-brand"><Image src={video.logo} alt="CapCut" width={44} height={44} unoptimized /><b>CapCut</b></span>
            <h3>{video.title}</h3>
            <p>{video.text}</p>
            <ul className="pa-tags">{video.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </div>
          <div className="xp-visual pa-capcut" aria-hidden="true">
            <div className="pa-capcut-bar"><Image src={video.logo} alt="" width={22} height={22} unoptimized /><span>Mon montage · 4K</span><b>Exporter</b></div>
            <div className="pa-capcut-preview">
              <figure className="pa-shot pa-shot-a"><Image src={video.shots[0]} alt="" fill sizes="(max-width: 760px) 90vw, 46vw" /></figure>
              <figure className="pa-shot pa-shot-b"><Image src={video.shots[1]} alt="" fill sizes="(max-width: 760px) 90vw, 46vw" /></figure>
              <span className="pa-capcut-mark"><Image src={video.logo} alt="" width={120} height={120} unoptimized /></span>
              <span className="pa-capcut-time">00:00:<b>12</b>:04</span>
            </div>
            <div className="pa-capcut-timeline">
              <div className="pa-capcut-track pa-capcut-clips">
                {[2, 1.4, 1.8, 1.2].map((grow, k) => <i key={k} style={v({ "--g": grow, "--k": k })} />)}
                {[0, 1, 2].map((k) => <b key={k} className="pa-capcut-transition" style={v({ "--k": k })}><Image src={video.logo} alt="" width={14} height={14} unoptimized /></b>)}
              </div>
              <div className="pa-capcut-track pa-capcut-audio">{Array.from({ length: 48 }, (_, bar) => <i key={bar} style={v({ "--k": bar, "--h": ((bar * 37) % 11) / 10 })} />)}</div>
              <span className="pa-capcut-playhead" />
            </div>
          </div>
        </article>

        {/* 02 — the studio: Mathis's own tracks, made in FL Studio, are the heart of the scene.
            The deck says what it is doing (data-state), so a blocked or offline player never fails silently. */}
        <article className="xp-scene pa-s-fl xp-t-band" data-xp-scene data-weight={weights.production} data-label="Création · Ma bande son"
          data-sound={`sc:${firstTrack.url}`} data-sound-title={firstTrack.title} data-sound-artist="Mathis · SoundCloud">
          <span className="jb-flash ps-flash pa-fl-flash" aria-hidden="true" style={v({ "--brand": "#262b30" })}>
            <Image src={production.icon} alt="" width={170} height={170} unoptimized />
          </span>
          <div className="xp-copy">
            <span className="xp-kicker">Création · 02 / 02</span>
            <span className="pa-fl-logo"><Image src={production.logo} alt="FL Studio" width={218} height={54} unoptimized /></span>
            <h3>Ma bande <em>son.</em></h3>
            <p>{production.text}</p>
            <p className="pa-studio-why">
              <b aria-hidden="true">🎧</b>
              <span><strong>Clique sur un son pour l’écouter.</strong> Ton navigateur coupe le son des sites tant que tu n’as pas cliqué : c’est toi qui lances la lecture.</span>
            </p>
            <a className="pa-soundcloud" href={soundcloud.profile} target="_blank" rel="noopener noreferrer">
              Tous mes sons sur <Image src="/media/passions/soundcloud-logo.svg" alt="SoundCloud" width={110} height={13} unoptimized />
            </a>
          </div>
          <div className="xp-visual pa-deck" data-sc-deck data-state="idle">
            <div className="pa-deck-now">
              <button type="button" className="pa-deck-play" data-sound-toggle aria-label="Lire ou mettre en pause le son en cours">
                <span className="pa-icon-play" aria-hidden="true">▶</span><span className="pa-icon-pause" aria-hidden="true">❚❚</span>
              </button>
              <div className="pa-deck-info">
                <small><Image src={production.icon} alt="" width={16} height={16} unoptimized />Prod. Mathis · FL Studio</small>
                <strong data-now-title>{firstTrack.title}</strong>
                <p className="pa-deck-status" aria-live="polite">
                  <span data-for="idle">Choisis un son ci-dessous et clique pour l’écouter</span>
                  <span data-for="loading">Connexion à SoundCloud…</span>
                  <span data-for="playing">En lecture · via SoundCloud</span>
                  <span data-for="paused">En pause · clique sur ▶ pour reprendre</span>
                  <span data-for="blocked">Ton navigateur bloque la lecture : lance-la dans le lecteur SoundCloud juste en dessous (▶ ou « Listen in browser »)</span>
                  <span data-for="error">SoundCloud ne répond pas : vérifie ta connexion, ou <a href={soundcloud.profile} target="_blank" rel="noopener noreferrer">écoute sur SoundCloud ↗</a></span>
                </p>
              </div>
              <div className="pa-wave" aria-hidden="true">
                {Array.from({ length: 64 }, (_, k) => <i key={k} style={v({ "--k": k, "--h": (0.25 + 0.75 * Math.abs(Math.sin(k * 0.42) * Math.cos(k * 0.13))).toFixed(2) })} />)}
              </div>
            </div>
            {/* The official SoundCloud player: out of sight while the page drives it, shown when the browser wants a click on it. */}
            <div className="pa-sc-frame" data-sc-host />
            <div className="pa-deck-lists">
              {soundcloud.playlists.map((playlist) => (
                <div className="pa-deck-list" key={playlist.url}>
                  <a className="pa-deck-list-name" href={playlist.url} target="_blank" rel="noopener noreferrer">{playlist.title}<small>{playlist.tracks.length} sons ↗</small></a>
                  <ol>
                    {playlist.tracks.map((track, k) => (
                      <li key={track.url}>
                        <button type="button" data-play-track={`sc:${track.url}`} data-track-title={track.title} aria-label={`Écouter ${track.title}`}>
                          <b className="pa-track-icon" aria-hidden="true"><i className="pa-icon-num">{String(k + 1).padStart(2, "0")}</i><i className="pa-icon-play">▶</i><i className="pa-icon-pause">❚❚</i></b>
                          <span>{track.title}</span><small>{track.length}</small>
                          <em className="pa-track-progress" aria-hidden="true"><i /></em>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* 03 — Spotify: the Big 3, the three artists always on repeat. It opens on the n°1's song,
            which carries on into his page; each next artist page then starts its own song. */}
        <article className="xp-scene pa-s-spotify xp-t-iris" data-xp-scene data-weight={weights.spotify} data-label="Musique · Mon Big 3"
          data-sound={artists[0].song.preview} data-sound-title={artists[0].song.title} data-sound-artist={artists[0].name}>
          <Flash color="#1db954"><Image src={listening.icon} alt="" width={180} height={180} unoptimized className="is-dark" /></Flash>
          <div className="pa-big3-head">
            <span className="pa-spotify-logo"><Image src={listening.logo} alt="Spotify" width={260} height={71} unoptimized /></span>
            <h3>Mon <em>Big&nbsp;3.</em></h3>
            <p>{listening.text}</p>
            <button type="button" className="sound-chip pa-big3-start" data-sound-toggle>▶ Lancer mon Big 3</button>
          </div>
          <ol className="pa-big3">
            {artists.map((artist, k) => (
              <li className="pa-big3-card" key={artist.name} style={v({ "--k": k, "--tone": artist.color })}>
                <Image src={artist.photos[0].src} alt={artist.photos[0].alt} fill sizes="(max-width: 760px) 34vw, 22vw" />
                <span className="pa-big3-rank" aria-hidden="true">{k + 1}</span>
                <div className="pa-big3-info">
                  <small>{artist.genre}</small>
                  <b className={`pa-big3-name pa-letter-${artist.lettering}`}>{artist.name}</b>
                  <span className="pa-big3-song"><i className="pa-eq" aria-hidden="true"><b /><b /><b /></i>{artist.song.title}</span>
                </div>
              </li>
            ))}
          </ol>
          <Credits photos={artists.map((artist) => artist.photos[0])} />
        </article>

        {/* 04–06 — one scene per artist, like an artist page. */}
        {artists.map((artist, index) => (
          <article className={`xp-scene pa-s-artist pa-artist-${index} ${["xp-t-side", "xp-t-diag", "xp-t-band"][index % 3]}`} data-xp-scene data-weight={weights.artist} data-label={`Musique · ${artist.name}`} key={artist.name} style={v({ "--tone": artist.color })}
            data-sound={artist.song.preview} data-sound-title={artist.song.title} data-sound-artist={artist.name} data-sound-artwork={artist.song.artwork} data-sound-link={artist.song.link}>
            <span className="jb-flash ps-flash pa-artist-flash" aria-hidden="true" style={v({ "--brand": "#08080a" })}>
              <span className="pa-flash-bg"><Image src={artist.song.artwork} alt="" fill sizes="100vw" /></span>
              <span className="pa-flash-cover"><Image src={artist.song.artwork} alt="" fill sizes="320px" /></span>
              <b className={`pa-flash-name pa-letter-${artist.lettering}`}>{artist.name}</b>
            </span>
            <Frame item={artist.photos[0]} className="pa-artist-hero" sizes="(max-width: 760px) 100vw, 55vw" />
            <div className="pa-artist-copy">
              <span className="pa-artist-index">Artiste 0{index + 1} / 0{artists.length} · {artist.genre}</span>
              <h3 className={`pa-artist-name pa-letter-${artist.lettering}`}>{artist.name}</h3>
              <p className="pa-artist-meta">{artist.realName} · {artist.origin} · {artist.label}</p>
              <p className="pa-artist-intro">{artist.intro}</p>
              <div className="pa-now">
                <button type="button" className="pa-now-play" data-sound-toggle aria-label={`Lire ou mettre en pause ${artist.song.title}`}><span className="pa-icon-play">▶</span><span className="pa-icon-pause">❚❚</span></button>
                <span className="pa-now-art"><Image src={artist.song.artwork} alt={`Pochette de ${artist.song.album}`} fill sizes="56px" /></span>
                <div><small>En écoute · extrait 30 s</small><strong>{artist.song.title}</strong><span>{artist.song.album}</span></div>
                <i><b /></i>
                <button type="button" className="sound-chip" data-sound-toggle>🔊 Activer le son</button>
              </div>
            </div>
            <div className="pa-artist-side">
              <div className="pa-stat"><b>{artist.stat.value}</b><span>{artist.stat.label}</span></div>
              <div className="pa-block">
                <span>Titres phares</span>
                <ol className="pa-hits">{artist.hits.map((hit, k) => <li key={hit} style={v({ "--k": k })}><b>{k + 1}</b>{hit}</li>)}</ol>
              </div>
              <div className="pa-block">
                <span>Discographie</span>
                <ul className="pa-albums">{artist.albums.map((album, k) => <li key={album.title} style={v({ "--k": k })}><i><Image src={album.cover} alt={`Pochette de ${album.title}`} fill sizes="110px" /></i><b>{album.title}</b><small>{album.year}</small></li>)}</ul>
              </div>
              <p className="pa-fact"><span>Le saviez-vous ?</span>{artist.fact}</p>
              {"labelLogo" in artist && artist.labelLogo && <span className="pa-label"><Image src={artist.labelLogo} alt="88rising" width={64} height={36} unoptimized />Label</span>}
            </div>
            {artist.photos.length > 1 && (
              <div className="pa-artist-strip">
                {artist.photos.slice(1).map((item, k) => <Frame key={item.src} item={item} className="pa-strip-photo" sizes="160px" k={k} />)}
              </div>
            )}
            <Credits photos={artist.photos} />
            <a className="pa-apple" href={artist.song.link} target="_blank" rel="noopener noreferrer">Extrait et pochettes : Apple Music ↗</a>
          </article>
        ))}

        {/* 07 — the four sports on one page: a card each, with its years of practice and what it taught. */}
        <article className="xp-scene pa-s-sports xp-t-diag" data-xp-scene data-weight={weights.sports} data-label="Sport · Mes 4 sports">
          {/* The title races in over running-track lanes, then the four disciplines land one by one. */}
          <Flash color="#e0533d">
            <span className="ps-sport-flash">
              <span className="ps-sport-lanes" />
              <strong className="ps-sport-title">Me dépasser</strong>
              <span className="ps-sport-icons">{sports.map((sport, k) => <SportIcon kind={sport.kind} k={k} key={sport.kind} />)}</span>
            </span>
          </Flash>
          <div className="pa-sports-head">
            <span className="xp-kicker">Sport · {sports.length} disciplines</span>
            <h3>Me dépasser, <em>sur quatre terrains.</em></h3>
          </div>
          <ol className="pa-sports">
            {sports.map((sport, k) => (
              <li className="pa-sport-card" key={sport.name} style={v({ "--k": k, "--tone": sport.color, "--years": sport.years })}>
                <figure className="pa-sport-card-photo"><Image src={sport.photos[0].src} alt={sport.photos[0].alt} fill sizes="(max-width: 760px) 50vw, 24vw" /></figure>
                <div className="pa-sport-card-body">
                  <span className="pa-sport-ring"><b>{sport.years}</b><small>ans</small></span>
                  <h4>{sport.name}</h4>
                  <strong>{sport.lesson}</strong>
                  <p>{sport.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Credits photos={sports.map((sport) => sport.photos[0])} />
        </article>
      </div>
    </section>
  );
}
