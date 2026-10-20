"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { geoEqualEarth, geoGraticule10, geoInterpolate, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";
import { studies } from "./content";

type WorldObjects = { countries: GeometryCollection; land: GeometryCollection };
type Flight = { from: number; to: number; progress: number };

const topology = worldAtlas as unknown as Topology<WorldObjects>;
const land = feature(topology, topology.objects.land);
const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);
const graticule = geoGraticule10();
const destinations = studies;
const ease = (value: number) => value * value * (3 - 2 * value);

// A portrait screen cannot show the wide map, so phones frame the five
// destinations instead and let the surrounding map spill past the viewBox.
const compactQuery = "(max-width: 760px)";
const compactView = { x: 370, width: 480, focusLift: 200 };
const subscribeCompact = (onChange: () => void) => {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export default function TravelMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelClosing, setPanelClosing] = useState(false);
  const [introduced, setIntroduced] = useState(false);
  const activeRef = useRef(0);
  const atlasRef = useRef<HTMLDivElement | null>(null);
  const compact = useSyncExternalStore(subscribeCompact, () => window.matchMedia(compactQuery).matches, () => false);
  const flightFromIndex = flight?.from;
  const flightToIndex = flight?.to;
  const map = useMemo(() => {
    // Framed on western Europe, where every study stop sits.
    const projection = geoEqualEarth().center([-4.5, 47.4]).scale(1650).translate([540, 300]);
    const path = geoPath(projection);
    const points = destinations.map((destination) => {
      const [x, y] = projection(destination.coordinates) ?? [540, 300];
      // Stable SVG attributes on the server and in the browser avoid hydration
      // mismatches caused by sub-pixel floating-point differences in d3-geo.
      return { ...destination, x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) };
    });
    // The network links the destinations in order; the scroll draws one link after another.
    const network = destinations.slice(1).map((destination, index) => Array.from({ length: 40 }, (_, step) => projection(geoInterpolate(destinations[index].coordinates, destination.coordinates)(step / 39)))
      .filter((point): point is [number, number] => Boolean(point))
      .map(([x, y], step) => `${step === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" "));
    return { projection, points, network, landPath: path(land) || "", bordersPath: path(borders) || "", graticulePath: path(graticule) || "" };
  }, []);

  useEffect(() => {
    if (flightFromIndex === undefined || flightToIndex === undefined) return;
    const startedAt = performance.now();
    const duration = 1150;
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      setFlight((current) => current ? { ...current, progress: ease(progress) } : current);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else { activeRef.current = flightToIndex; setSelected(flightToIndex); setFlight(null); }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [flightFromIndex, flightToIndex]);

  useEffect(() => {
    const atlas = atlasRef.current;
    if (!atlas || introduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIntroduced(true); observer.disconnect(); }
    }, { threshold: 0.38 });
    observer.observe(atlas);
    return () => observer.disconnect();
  }, [introduced]);

  useEffect(() => {
    if (selected === null) return;
    const timer = window.setTimeout(() => setPanelVisible(true), 520);
    return () => window.clearTimeout(timer);
  }, [selected]);

  const travelTo = (index: number) => {
    if (flight || panelClosing || selected === index) return;
    const from = selected ?? activeRef.current;
    if (from === index) { setSelected(index); return; }
    setPanelVisible(false);
    setSelected(null);
    setFlight({ from, to: index, progress: 0 });
  };

  const closePanel = () => {
    if (selected === null || panelClosing) return;
    setPanelClosing(true);
    setPanelVisible(false);
    window.setTimeout(() => {
      setSelected(null);
      setPanelClosing(false);
    }, 420);
  };

  const activeDestination = selected === null ? null : map.points[selected];
  // On phones the detail panel covers the lower half, so the city settles above it.
  const focusX = compact ? compactView.x + compactView.width / 2 : 430;
  const focusY = compact ? 300 - compactView.focusLift : 300;
  // On a phone the map sits lower, clear of the chapter heading at the top.
  const viewBox = compact ? `${compactView.x} -90 ${compactView.width} 600` : "0 0 1080 600";
  const aspect = compact ? "xMidYMid meet" : "xMidYMid slice";
  const stageTransform = activeDestination ? `translate(${focusX} ${focusY}) scale(2.2) translate(${-activeDestination.x} ${-activeDestination.y})` : "translate(0 0) scale(1)";
  const flightCoordinate = flight ? map.projection(geoInterpolate(destinations[flight.from].coordinates, destinations[flight.to].coordinates)(flight.progress)) : null;
  const flightPath = flight ? Array.from({ length: 48 }, (_, index) => map.projection(geoInterpolate(destinations[flight.from].coordinates, destinations[flight.to].coordinates)(index / 47))).filter((point): point is [number, number] => Boolean(point)).map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ") : "";

  return (
    <div ref={atlasRef} className={`travel-atlas${introduced ? " is-introduced" : ""}${selected !== null ? " is-focused" : ""}${flight ? " is-flying" : ""}`}>
      <div className="travel-atlas-hud"><span><i /> PARCOURS ACADÉMIQUE</span><b>{flight ? "VOL EN COURS" : selected !== null ? "MODE ESCALE" : "CHOISISSEZ UNE ESCALE"}</b><small className="atlas-links-count" style={{ "--atlas-total": `"${String(destinations.length).padStart(2, "0")}"` } as React.CSSProperties}>villes connectées</small></div>
      <div className="atlas-intro-transition" aria-hidden="true"><i>✈</i><span>Connexion à l&apos;atlas</span></div>
      {/* The map itself is static and painted once; everything that moves lives in the overlay
          above it, so radars and data packets never force the glowing coastlines to repaint. */}
      <svg className="travel-atlas-svg travel-atlas-base" viewBox={viewBox} preserveAspectRatio={aspect} aria-hidden="true">
        <defs>
          <radialGradient id="atlas-ocean" cx="38%" cy="46%" r="82%"><stop offset="0" stopColor="#211b2b" /><stop offset=".52" stopColor="#111019" /><stop offset="1" stopColor="#09090d" /></radialGradient>
        </defs>
        <rect className="atlas-ocean" width="1080" height="600" fill="url(#atlas-ocean)" />
        <g className="travel-atlas-stage" transform={stageTransform}>
          <path d={map.graticulePath} className="atlas-grid" /><path d={map.landPath} className="atlas-land" /><path d={map.bordersPath} className="atlas-borders" />
        </g>
      </svg>
      <svg className="travel-atlas-svg travel-atlas-overlay" viewBox={viewBox} preserveAspectRatio={aspect} aria-label="Carte interactive des études de Mathis">
        <defs>
          <filter id="atlas-glow"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="atlas-scan-gradient" x1="0" x2="1"><stop offset="0" stopColor="#61bbb6" stopOpacity="0" /><stop offset=".72" stopColor="#61bbb6" stopOpacity=".04" /><stop offset="1" stopColor="#b69acb" stopOpacity=".38" /></linearGradient>
        </defs>
        <g className="atlas-map-scan" aria-hidden="true">
          <rect x="-220" y="0" width="220" height="600" fill="url(#atlas-scan-gradient)" />
          <line x1="0" y1="0" x2="0" y2="600" />
        </g>
        <g className="travel-atlas-stage" transform={stageTransform}>
          <g className="atlas-network" aria-hidden="true" style={{ "--links": map.network.length } as React.CSSProperties}>
            {map.network.map((route, index) => (
              <g key={route} style={{ "--k": index } as React.CSSProperties}>
                <path d={route} pathLength={100} />
                <circle r="3"><animateMotion dur={`${2.4 + index * .35}s`} repeatCount="indefinite" path={route} /></circle>
              </g>
            ))}
          </g>
          {flightPath && <path d={flightPath} className="atlas-flight-route" pathLength="100" />}
          {flightCoordinate && <g transform={`translate(${flightCoordinate[0]} ${flightCoordinate[1]})`} className="atlas-plane" filter="url(#atlas-glow)"><circle r="16" /><path d="M13,0 L3.5,2.8 L-2,10 L-4,10 L-2.2,2.8 L-10,5 L-11,3.2 L-3.4,0 L-11,-3.2 L-10,-5 L-2.2,-2.8 L-4,-10 L-2,-10 L3.5,-2.8 Z" /></g>}
          {map.points.map((destination, index) => (
            <g
              key={destination.code}
              className={`atlas-point${selected === index ? " is-selected" : ""}`}
              transform={`translate(${destination.x} ${destination.y})`}
              style={{ "--point-color": destination.color, "--radar-delay": `${index * -0.72}s` } as React.CSSProperties}
              role="button"
              tabIndex={0}
              aria-label={`Ouvrir la formation à ${destination.place}`}
              onClick={() => travelTo(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  travelTo(index);
                }
              }}
            >
              <g className="atlas-point-visual">
                <circle className="atlas-point-hit" r="34" />
                <g className="atlas-radar" aria-hidden="true">
                  <circle className="atlas-radar-ring atlas-radar-ring-outer" r="28" />
                  <circle className="atlas-radar-ring atlas-radar-ring-inner" r="18" />
                  <path className="atlas-radar-sweep" d="M0 0 L0 -28 A28 28 0 0 1 19.8 -19.8 Z" />
                  <line className="atlas-radar-arm" x1="0" y1="0" x2="0" y2="-28" />
                </g>
                <circle className="atlas-heart-ring" r="10" />
                <circle className="atlas-core" r="7" filter="url(#atlas-glow)" />
                <text className="atlas-point-code" x="17" y="-10">{destination.code}</text>
                <text className="atlas-point-name" x="17" y="5">{destination.place.toUpperCase()}</text>
              </g>
            </g>
          ))}
        </g>
      </svg>
      {activeDestination && <aside className={`atlas-project-panel${panelVisible ? " is-visible" : ""}${panelClosing ? " is-closing" : ""}`} aria-live="polite" aria-hidden={!panelVisible}><button type="button" className="atlas-close" onClick={closePanel} aria-label="Fermer le détail et revenir à la carte"><span>Fermer</span>×</button><span className="atlas-project-code">{activeDestination.code} · {activeDestination.place}, {activeDestination.country}</span><h3>{activeDestination.school}</h3><p className="atlas-project-school">{activeDestination.degree} · {activeDestination.years}</p><div><span>Spécialisation</span><strong>{activeDestination.specialization}</strong></div>{(activeDestination.stack.length > 0 || activeDestination.highlight) && <footer><span>{activeDestination.stack.join(" · ")}</span>{activeDestination.highlight && <b>{activeDestination.highlight}</b>}</footer>}</aside>}
      {selected === null && !flight && <p className="travel-atlas-prompt">Sélectionnez un campus pour découvrir la formation.</p>}
    </div>
  );
}
