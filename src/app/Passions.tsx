import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { passions, type JobPhoto } from "./content";

/* 04 — Passions, one world per scene, on the same scene engine as the experiences and jobs
   (motion.js drives --enter, --inner and --leave). Each world opens with its own flash. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const { video, production, listening, artists, sports } = passions;
const { soundcloud } = production;
const firstTrack = soundcloud.playlists[0].tracks[0];

const weights = { intro: 1, video: 1.2, production: 1.4, spotify: 1.1, artist: 1.35, sport: 1.15 };
const units = weights.intro + weights.video + weights.production + weights.spotify + weights.artist * artists.length + weights.sport * sports.length;

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

function Frame({ item, className, sizes, k = 0 }: { item: JobPhoto; className: string; sizes: string; k?: number }) {
  return (
    <figure className={className} style={v({ "--k": k })}>
      <Image src={item.src} alt={item.alt} fill sizes={sizes} />
      {item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>
  );
}

// A sport's visual: its photos plus a small animation that moves like the sport itself.
function SportMotion({ kind }: { kind: string }) {
  if (kind === "muscu") {
    return (
      <div className="pa-barbell" aria-hidden="true">
        <i className="pa-bar" />
        {[0, 1, 2].map((k) => <i className={`pa-plate pa-plate-l pa-plate-${k}`} key={`l${k}`} style={v({ "--k": k })} />)}
        {[0, 1, 2].map((k) => <i className={`pa-plate pa-plate-r pa-plate-${k}`} key={`r${k}`} style={v({ "--k": k })} />)}
        <span className="pa-reps">Rép. <b data-count={12} data-suffix="">12</b></span>
      </div>
    );
  }
  if (kind === "skate") {
    return (
      <div className="pa-board-wrap" aria-hidden="true">
        <span className="pa-board"><i /><i /></span>
        <span className="pa-trick">Kickflip</span>
      </div>
    );
  }
  if (kind === "athle") {
    return (
      <div className="pa-track" aria-hidden="true">
        {[0, 1, 2, 3].map((lane) => <i className="pa-lane" key={lane} style={v({ "--k": lane })}><b /></i>)}
        <span className="pa-chrono"><b>Chrono</b> départ · arrivée</span>
      </div>
    );
  }
  return (
    <div className="pa-court" aria-hidden="true">
      <i className="pa-net" />
      <i className="pa-ball" />
      <span className="pa-score">Point · équipe</span>
    </div>
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
            <span className="pa-world pa-world-sport" style={v({ "--k": 3 })}><b>4</b>sports</span>
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

        {/* 02 — music production in FL Studio: the pattern plays, notes are drawn, the mixer moves. */}
        <article className="xp-scene pa-s-fl xp-t-band" data-xp-scene data-weight={weights.production} data-label="Création · Production musicale"
          data-sound={`sc:${firstTrack.url}`} data-sound-title={firstTrack.title} data-sound-artist="Mathis · SoundCloud">
          <span className="jb-flash ps-flash pa-fl-flash" aria-hidden="true" style={v({ "--brand": "#262b30" })}>
            <Image src={production.icon} alt="" width={170} height={170} unoptimized />
          </span>
          <div className="xp-copy">
            <span className="xp-kicker">Création · 02 / 02</span>
            <span className="pa-fl-logo"><Image src={production.logo} alt="FL Studio" width={218} height={54} unoptimized /></span>
            <h3>{production.title}</h3>
            <p>{production.text}</p>
            <ol className="pa-fl-steps">{production.steps.map((step, k) => <li key={step} style={v({ "--k": k })}><b>0{k + 1}</b>{step}</li>)}</ol>
            <div className="pa-mytracks">
              <span>Mes sons <button type="button" className="sound-chip" data-sound-toggle>🔊 Activer le son</button></span>
              {soundcloud.playlists.map((playlist) => (
                <div className="pa-playlist-group" key={playlist.url}>
                  <a className="pa-playlist-name" href={playlist.url} target="_blank" rel="noopener noreferrer">{playlist.title} <small>· {playlist.tracks.length} sons</small></a>
                  <ol>
                    {playlist.tracks.map((track) => (
                      <li key={track.url}>
                        <button type="button" data-play-track={`sc:${track.url}`} data-track-title={track.title} aria-label={`Écouter ${track.title}`}>
                          <b className="pa-track-icon" aria-hidden="true"><i className="pa-icon-play">▶</i><i className="pa-icon-pause">❚❚</i></b>
                          <span>{track.title}</span><small>{track.length}</small>
                          <em className="pa-track-progress" aria-hidden="true"><i /></em>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
              {/* The official SoundCloud player. Hidden while the page drives it; shown when a phone requires a tap on it. */}
              <div className="pa-sc-frame" data-sc-host><span>Touchez ▶ dans la barre SoundCloud pour écouter</span></div>
              <a className="pa-soundcloud" href={soundcloud.profile} target="_blank" rel="noopener noreferrer">
                Écouter sur <Image src="/media/passions/soundcloud-logo.svg" alt="SoundCloud" width={110} height={13} unoptimized />
              </a>
            </div>
          </div>
          <div className="xp-visual pa-daw" aria-hidden="true">
            <div className="pa-daw-bar"><span>Pattern 1</span><b>140 BPM</b><i className="pa-daw-play">▶</i></div>
            <div className="pa-seq">
              {production.pattern.map((row, r) => (
                <div className="pa-seq-row" key={r}>
                  <span>{["Kick", "Snare", "Hi-hat", "808"][r]}</span>
                  {row.map((hit, step) => <i key={step} className={hit ? "is-hit" : undefined} style={v({ "--s": step, "--r": r })} />)}
                </div>
              ))}
              <span className="pa-seq-head" />
            </div>
            <div className="pa-roll">
              {[[0, 4, 2], [4, 2, 5], [6, 3, 3], [9, 2, 6], [11, 5, 1], [16, 3, 4], [19, 4, 2], [23, 2, 5]].map(([x, w, y], k) => (
                <i key={k} style={v({ "--x": x, "--w": w, "--y": y, "--k": k })} />
              ))}
            </div>
            <div className="pa-mixer">{Array.from({ length: 8 }, (_, k) => <i key={k} style={v({ "--k": k })}><b /></i>)}</div>
          </div>
        </article>

        {/* 03 — Spotify: the playlist of the three artists, then each one gets the stage. */}
        <article className="xp-scene pa-s-spotify xp-t-iris" data-xp-scene data-weight={weights.spotify} data-label="Musique · Spotify">
          <Flash color="#1db954"><Image src={listening.icon} alt="" width={180} height={180} unoptimized className="is-dark" /></Flash>
          <div className="xp-copy">
            <span className="pa-spotify-logo"><Image src={listening.logo} alt="Spotify" width={260} height={71} unoptimized /></span>
            <h3>En boucle <em>dans mes écouteurs.</em></h3>
            <p>{listening.text}</p>
          </div>
          <div className="xp-visual pa-playlist" aria-hidden="true">
            <div className="pa-playlist-head"><span className="pa-cover"><b>♪</b></span><div><small>Playlist</small><strong>Mes artistes</strong><span>Mathis · {artists.length} artistes</span></div></div>
            <ol>
              {artists.map((artist, k) => (
                <li key={artist.name} style={v({ "--k": k, "--tone": artist.color })}>
                  <b>{k + 1}</b>
                  <span className="pa-thumb"><Image src={artist.photos[0].src} alt="" fill sizes="48px" /></span>
                  <div><strong>{artist.name}</strong><small>{artist.song.title}</small></div>
                  <i className="pa-eq"><b /><b /><b /></i>
                </li>
              ))}
            </ol>
          </div>
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

        {/* 07–10 — one scene per sport. */}
        {sports.map((sport, index) => (
          <article className={`xp-scene pa-s-sport pa-sport-${sport.kind} ${["xp-t-diag", "xp-t-iris", "xp-t-side", "xp-t-band"][index % 4]}`} data-xp-scene data-weight={weights.sport} data-label={`Sport · ${sport.name}`} key={sport.name} style={v({ "--tone": sport.color, "--years": sport.years })}>
            <Flash color={sport.color}><b className="ps-flash-word">{sport.name}</b></Flash>
            <div className="xp-copy">
              <span className="xp-kicker">Sport · 0{index + 1} / 0{sports.length}</span>
              <h3 className="pa-sport-name">{sport.name}</h3>
              <div className="pa-years">
                <span className="pa-years-ring"><b>{sport.years}</b><small>ans</small></span>
                <p><span>Ce que ça m’a appris</span><strong>{sport.lesson}</strong></p>
              </div>
              <p>{sport.text}</p>
            </div>
            <div className="xp-visual pa-sport-stage">
              {sport.photos.map((item, k) => <Frame key={item.src} item={item} className={`pa-sport-photo pa-sport-photo-${k}`} sizes="(max-width: 760px) 80vw, 34vw" k={k} />)}
              <SportMotion kind={sport.kind} />
            </div>
            <Credits photos={sport.photos} />
          </article>
        ))}
      </div>
    </section>
  );
}
