"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { geoEqualEarth, geoGraticule10, geoInterpolate, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";
import { atlasTour, studies } from "./content";

/* 06 — the studies atlas. The scroll tells the journey (motion.js sends the chapter's progress as
   an "atlas-progress" event): the map boots up, then the camera flies from one city to the next,
   a plane drawing the route with its contrail, and each stop shows its card. Once the network is
   complete, a click on a city flies there and opens its boarding pass.

   Everything that moves runs in one animation loop that writes straight to the page: the world
   is a dot-matrix painted on a canvas, the beacons and routes ride an SVG above it with the same
   camera, and React only re-renders when the stop, the phase or the selection changes. */

type WorldObjects = { countries: GeometryCollection; land: GeometryCollection };
type Cam = { cx: number; cy: number; s: number; fx: number; fy: number };
type Rect = { x: number; y: number; w: number; h: number };
type Plane = { x: number; y: number; angle: number; altitude: number };
type Ui = { phase: "intro" | "tour" | "outro"; stop: number; card: number; flying: boolean };

const topology = worldAtlas as unknown as Topology<WorldObjects>;
const land = feature(topology, topology.objects.land);
const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);
const graticule = geoGraticule10();
const destinations = studies;
const stops = destinations.length;
const segment = (atlasTour.outro - atlasTour.intro) / stops;
const VIEW = { w: 1080, h: 600 };
// The dot-matrix covers more than the frame, for phones that see a tall slice of it.
const FIELD = { x: -220, y: -520, w: 1520, h: 1640 };
const TILE = 160;
const planeShape = "M13,0 L3.5,2.8 L-2,10 L-4,10 L-2.2,2.8 L-10,5 L-11,3.2 L-3.4,0 L-11,-3.2 L-10,-5 L-2.2,-2.8 L-4,-10 L-2,-10 L3.5,-2.8 Z";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value: number) => value * value * (3 - 2 * value);
const easeInOut = (t: number) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
// Scale mixes geometrically, so a zoom reads at an even pace; `dip` pulls back mid-way on long hops.
const mixCam = (a: Cam, b: Cam, t: number, dip = 0): Cam => ({
  cx: mix(a.cx, b.cx, t), cy: mix(a.cy, b.cy, t), fx: mix(a.fx, b.fx, t), fy: mix(a.fy, b.fy, t),
  s: Math.exp(mix(Math.log(a.s), Math.log(b.s), t)) * (1 - dip * Math.sin(Math.PI * t)),
});

// The part of the 1080 × 600 map a screen of this shape shows (the SVG slices to fill it).
const visibleRect = (width: number, height: number): Rect => {
  const aspect = width / Math.max(1, height);
  if (aspect < VIEW.w / VIEW.h) {
    const w = VIEW.h * aspect;
    return { x: (VIEW.w - w) / 2, y: 0, w, h: VIEW.h };
  }
  const h = VIEW.w / aspect;
  return { x: 0, y: (VIEW.h - h) / 2, w: VIEW.w, h };
};

export default function TravelMap() {
  const [ui, setUi] = useState<Ui>({ phase: "outro", stop: stops - 1, card: -1, flying: false });
  const [selected, setSelected] = useState<number | null>(null);
  const [passVisible, setPassVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const atlasRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<SVGGElement | null>(null);
  const shockRef = useRef<SVGGElement | null>(null);
  const planeRef = useRef<SVGGElement | null>(null);
  const planeBodyRef = useRef<SVGGElement | null>(null);
  const planeShadowRef = useRef<SVGGElement | null>(null);
  const cometRef = useRef<SVGPathElement | null>(null);
  const flightRouteRef = useRef<SVGPathElement | null>(null);
  const linkRefs = useRef<(SVGGElement | null)[]>([]);
  const engine = useRef({
    target: 1, shown: 1, size: { w: 1440, h: 860 }, drawn: "", angle: 0, landed: -1, openedAt: 0, ui: "",
    flight: null as null | { from: number; to: number; startedAt: number; start: Cam },
    focus: { city: null as number | null, blend: 0, goal: 0 },
    cam: null as Cam | null,
    wake: () => {},
    close: () => {},
  });

  const map = useMemo(() => {
    // Turned toward the Atlantic and fitted on the six cities, from Boston to Barcelona.
    const projection = geoEqualEarth().rotate([34, 0]).fitExtent([[250, 170], [830, 450]], { type: "MultiPoint", coordinates: destinations.map((item) => item.coordinates) });
    const path = geoPath(projection);
    const project = (coordinates: [number, number]) => projection(coordinates) ?? [VIEW.w / 2, VIEW.h / 2];
    // Stable SVG attributes on the server and in the browser avoid hydration mismatches.
    const points = destinations.map((destination) => {
      const [x, y] = project(destination.coordinates);
      return { ...destination, x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) };
    });
    const hop = (from: number, to: number, t: number) => project(geoInterpolate(destinations[from].coordinates, destinations[to].coordinates)(clamp(t)));
    const route = (from: number, to: number) => Array.from({ length: 64 }, (_, step) => hop(from, to, step / 63)).map(([x, y], step) => `${step === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const network = destinations.slice(1).map((_, index) => route(index, index + 1));
    const center = points.reduce((acc, p) => ({ x: acc.x + p.x / points.length, y: acc.y + p.y / points.length }), { x: 0, y: 0 });
    return { points, hop, route, network, center, landPath: path(land) || "", bordersPath: path(borders) || "", graticulePath: path(graticule) || "" };
  }, []);

  // ── Cameras ────────────────────────────────────────────────────────────────────────────────
  const cameras = useCallback((width: number, height: number) => {
    const compact = width <= 760;
    const view = visibleRect(width, height);
    const box = map.points.reduce((acc, { x, y }) => ({ x0: Math.min(acc.x0, x), x1: Math.max(acc.x1, x), y0: Math.min(acc.y0, y), y1: Math.max(acc.y1, y) }), { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity });
    // The whole journey, framed in the part of the screen left free by the heading and the cards.
    const area = compact
      ? { x: view.x + view.w * .1, y: view.y + view.h * .24, w: view.w * .8, h: view.h * .4 }
      : { x: view.x + view.w * .1, y: view.y + view.h * .22, w: view.w * .8, h: view.h * .62 };
    const fit = Math.min(area.w / (box.x1 - box.x0 + 60), area.h / (box.y1 - box.y0 + 60));
    const overview: Cam = { cx: (box.x0 + box.x1) / 2, cy: (box.y0 + box.y1) / 2, s: fit, fx: area.x + area.w / 2, fy: area.y + area.h / 2 };
    const zoom = fit * (compact ? 5 : 3.6);
    // A city during the tour sits clear of its card; with the boarding pass open, clear of the pass.
    const city = (index: number, withPass = false): Cam => ({
      cx: map.points[index].x, cy: map.points[index].y, s: zoom,
      fx: compact ? view.x + view.w / 2 : view.x + view.w * (withPass ? .3 : .62),
      fy: compact ? view.y + view.h * (withPass ? .22 : .36) : view.y + view.h * .5,
    });
    return { compact, overview, city };
  }, [map]);

  // The heading of the plane at t, read on a short stretch of the route that never collapses.
  const heading = useCallback((from: number, to: number, t: number) => {
    const a = map.hop(from, to, Math.min(t, .99) - .01);
    const b = map.hop(from, to, Math.max(t, .01) + .01);
    return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  }, [map]);

  // ── The loop ───────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const atlas = atlasRef.current;
    const canvas = canvasRef.current;
    const journey = atlas?.closest("[data-story-journey]");
    const context = canvas?.getContext("2d");
    if (!atlas || !canvas || !context || !journey) return;
    const state = engine.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The dot-matrix: the land is rasterised once, then sampled on a staggered grid. Two levels of
    // detail, so a camera far away never paints more dots than the eye can tell apart.
    const tiles = { near: new Map<string, Path2D>(), fine: new Map<string, Path2D>(), coarse: new Map<string, Path2D>() };
    const sample = document.createElement("canvas");
    sample.width = FIELD.w;
    sample.height = FIELD.h;
    const sampler = sample.getContext("2d", { willReadFrequently: true });
    if (sampler) {
      sampler.translate(-FIELD.x, -FIELD.y);
      sampler.fill(new Path2D(map.landPath));
      const pixels = sampler.getImageData(0, 0, FIELD.w, FIELD.h).data;
      const isLand = (x: number, y: number) => {
        const px = Math.round(x - FIELD.x);
        const py = Math.round(y - FIELD.y);
        return px >= 0 && py >= 0 && px < FIELD.w && py < FIELD.h && pixels[(py * FIELD.w + px) * 4 + 3] > 120;
      };
      const plant = (level: Map<string, Path2D>, step: number, size: number) => {
        for (let row = 0, y = FIELD.y + step / 2; y < FIELD.y + FIELD.h; y += step * .866, row += 1) {
          for (let x = FIELD.x + (row % 2 ? step : step / 2); x < FIELD.x + FIELD.w; x += step) {
            if (!isLand(x, y)) continue;
            const key = `${Math.floor(x / TILE)},${Math.floor(y / TILE)}`;
            let tile = level.get(key);
            if (!tile) level.set(key, tile = new Path2D());
            tile.rect(x - size / 2, y - size / 2, size, size);
          }
        }
      };
      plant(tiles.near, 4.2, .8);
      plant(tiles.fine, 4.2, 1.5);
      plant(tiles.coarse, 8.4, 2.6);
    }
    const tileList = {
      near: [...tiles.near.entries()].map(([key, path]) => ({ path, x: Number(key.split(",")[0]) * TILE, y: Number(key.split(",")[1]) * TILE })),
      fine: [...tiles.fine.entries()].map(([key, path]) => ({ path, x: Number(key.split(",")[0]) * TILE, y: Number(key.split(",")[1]) * TILE })),
      coarse: [...tiles.coarse.entries()].map(([key, path]) => ({ path, x: Number(key.split(",")[0]) * TILE, y: Number(key.split(",")[1]) * TILE })),
    };
    const coast = new Path2D(map.landPath);
    const frontiers = new Path2D(map.bordersPath);
    const grid = new Path2D(map.graticulePath);

    const resize = () => {
      const { width, height } = atlas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      state.size = { w: width, h: height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      state.drawn = "";
      state.wake();
    };

    const paint = (cam: Cam, reveal: number, spot: { x: number; y: number; color: string; power: number }) => {
      const { w, h } = state.size;
      const dpr = canvas.width / Math.max(1, w);
      const k = Math.max(w / VIEW.w, h / VIEW.h);
      const scale = k * cam.s;
      const tx = (w - VIEW.w * k) / 2 + k * (cam.fx - cam.s * cam.cx);
      const ty = (h - VIEW.h * k) / 2 + k * (cam.fy - cam.s * cam.cy);
      const unit = 1 / scale;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * tx, dpr * ty);
      const view = { x0: -tx / scale, y0: -ty / scale, x1: (w - tx) / scale, y1: (h - ty) / scale };
      // Booting: the map materialises in a widening circle from the middle of the journey.
      const radius = reveal * Math.hypot(view.x1 - view.x0, view.y1 - view.y0);
      context.save();
      if (reveal < 1) {
        context.beginPath();
        context.arc(map.center.x, map.center.y, Math.max(0, radius), 0, Math.PI * 2);
        context.clip();
      }
      context.lineWidth = unit;
      context.strokeStyle = "rgba(199, 195, 215, .07)";
      context.stroke(grid);
      // Far away, the coarse grid; closer, every dot; close up, finer dots so they stay points.
      const level = scale * 4.2 < 3.4 ? "coarse" : scale * 4.2 > 11 ? "near" : "fine";
      context.fillStyle = "#4d3f68";
      tileList[level].forEach((tile) => {
        if (tile.x + TILE < view.x0 || tile.x > view.x1 || tile.y + TILE < view.y0 || tile.y > view.y1) return;
        context.fill(tile.path);
      });
      // The dots light up around the city in view, and under the plane while it flies.
      if (spot.power > 0) {
        context.globalCompositeOperation = "source-atop";
        const light = context.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, 170);
        light.addColorStop(0, spot.color);
        light.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.globalAlpha = spot.power;
        context.fillStyle = light;
        context.fillRect(spot.x - 170, spot.y - 170, 340, 340);
        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";
      }
      context.lineJoin = "round";
      context.strokeStyle = "rgba(146, 115, 178, .14)";
      context.lineWidth = 5 * unit;
      context.stroke(coast);
      context.strokeStyle = "rgba(182, 154, 214, .62)";
      context.lineWidth = 1.1 * unit;
      context.stroke(coast);
      context.strokeStyle = "rgba(235, 234, 229, .08)";
      context.lineWidth = .7 * unit;
      context.stroke(frontiers);
      context.restore();
      if (reveal < 1) {
        context.strokeStyle = "rgba(127, 214, 201, .75)";
        context.lineWidth = 2 * unit;
        context.beginPath();
        context.arc(map.center.x, map.center.y, Math.max(0, radius), 0, Math.PI * 2);
        context.stroke();
      }
    };

    // Touch-down: two rings run out from the city.
    const landing = (index: number) => {
      const layer = shockRef.current;
      if (!layer || reduced) return;
      const point = map.points[index];
      [0, 1].forEach((ring) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("class", "atlas-shock");
        circle.setAttribute("cx", String(point.x));
        circle.setAttribute("cy", String(point.y));
        circle.setAttribute("r", "10");
        circle.style.setProperty("--point-color", point.color);
        circle.style.animationDelay = `${ring * .22}s`;
        layer.append(circle);
        window.setTimeout(() => circle.remove(), 1700);
      });
    };

    let frame = 0;
    let last = performance.now();
    let visible = true;

    const tick = (now: number) => {
      frame = 0;
      const elapsed = Math.min(64, now - last);
      last = now;
      const { w, h } = state.size;
      const { compact, overview, city } = cameras(w, h);

      // The scroll arrives in steps; the journey follows it smoothly, and jumps across far ones.
      const gap = state.target - state.shown;
      state.shown = Math.abs(gap) > .25 || reduced ? state.target : state.shown + gap * (1 - Math.exp(-elapsed / 110));
      if (Math.abs(state.target - state.shown) < 1e-4) state.shown = state.target;
      const p = state.shown;

      // ── The tour at p ──
      let phase: Ui["phase"] = "tour";
      let stop = 0;
      let local = 0;
      let travel = 1;
      let cam: Cam;
      let plane: Plane | null = null;
      let pitch = 0;
      let reveal = 1;
      if (p < atlasTour.intro) {
        phase = "intro";
        stop = -1;
        reveal = .3 + .7 * clamp(p / (atlasTour.intro * .85));
        cam = mixCam({ ...overview, s: overview.s * .8 }, overview, ease(p / atlasTour.intro));
      } else if (p >= atlasTour.outro) {
        phase = "outro";
        stop = stops - 1;
        cam = mixCam(city(stops - 1), overview, easeInOut(clamp((p - atlasTour.outro) / .07)));
      } else {
        stop = Math.min(stops - 1, Math.floor((p - atlasTour.intro) / segment));
        local = (p - atlasTour.intro - stop * segment) / segment;
        travel = easeInOut(clamp(local / .58));
        const to = city(stop);
        if (stop === 0) cam = mixCam(overview, to, travel);
        else {
          // The camera rides with the plane, pulling back and tilting on the long hops.
          const from = city(stop - 1);
          const distance = Math.hypot(to.cx - from.cx, to.cy - from.cy);
          cam = mixCam(from, to, travel, clamp(distance / 260) * .62);
          const [x, y] = map.hop(stop - 1, stop, travel);
          cam.cx = x;
          cam.cy = y;
          if (travel > 0 && travel < 1) {
            plane = { x, y, angle: heading(stop - 1, stop, travel), altitude: Math.sin(Math.PI * travel) };
            pitch = (compact ? 20 : 28) * Math.sin(Math.PI * travel) * clamp(distance / 90);
          }
        }
      }

      // ── A click: the flight to the chosen city, then the camera holds it beside its pass ──
      const { flight, focus } = state;
      let flown = 0;
      if (flight) {
        const t = clamp((now - flight.startedAt) / 1600);
        flown = easeInOut(t);
        const target = city(flight.to, true);
        const [x, y] = map.hop(flight.from, flight.to, flown);
        const distance = Math.hypot(target.cx - map.points[flight.from].x, target.cy - map.points[flight.from].y);
        cam = mixCam(flight.start, target, flown, clamp(distance / 260) * .55);
        cam.cx = mix(flight.start.cx, x, Math.min(1, flown * 3));
        cam.cy = mix(flight.start.cy, y, Math.min(1, flown * 3));
        cam.cx = mix(cam.cx, target.cx, flown);
        cam.cy = mix(cam.cy, target.cy, flown);
        plane = t < 1 ? { x, y, angle: heading(flight.from, flight.to, flown), altitude: Math.sin(Math.PI * flown) } : null;
        pitch = (compact ? 18 : 26) * Math.sin(Math.PI * flown) * clamp(distance / 90);
        if (t >= 1) {
          state.flight = null;
          state.focus = { city: flight.to, blend: 1, goal: 1 };
          landing(flight.to);
          setSelected(flight.to);
        }
      } else if (focus.city !== null) {
        focus.blend = focus.goal > focus.blend ? Math.min(focus.goal, focus.blend + elapsed / 900) : Math.max(focus.goal, focus.blend - elapsed / 900);
        cam = mixCam(cam, city(focus.city, true), easeInOut(focus.blend));
        if (focus.blend === 0 && focus.goal === 0) focus.city = null;
      }
      state.cam = cam;

      // Scrolling on through the chapter closes the pass.
      if (state.focus.city !== null && state.focus.goal === 1 && !state.flight && Math.abs(state.target - state.openedAt) > segment * .6) state.close();
      // Touch-down during the tour.
      if (phase === "tour" && travel >= 1 && state.landed !== stop) {
        if (state.landed !== -1 && stop > 0) landing(stop);
        state.landed = stop;
      }
      if (phase !== "tour") state.landed = stop;

      // ── Write the frame ──
      if (stageRef.current) stageRef.current.style.transform = `translate(${cam.fx.toFixed(2)}px, ${cam.fy.toFixed(2)}px) scale(${cam.s.toFixed(4)}) translate(${(-cam.cx).toFixed(2)}px, ${(-cam.cy).toFixed(2)}px)`;
      atlas.style.setProperty("--cam-s", cam.s.toFixed(4));
      atlas.style.setProperty("--pt", mix(compact ? .55 : .75, compact ? 1.15 : 1, clamp((cam.s / overview.s - 1) / 1.5)).toFixed(3));
      if (worldRef.current) worldRef.current.style.transform = pitch > .05 ? `perspective(1300px) rotateX(${pitch.toFixed(2)}deg) scale(${(1 + pitch / 260).toFixed(4)})` : "";
      map.network.forEach((_, index) => {
        const value = phase === "outro" ? 1 : phase === "intro" ? 0 : index < stop - 1 ? 1 : index === stop - 1 ? travel : 0;
        linkRefs.current[index]?.style.setProperty("--route", value.toFixed(4));
      });
      // The contrail: a bright stretch of route just behind the plane.
      const comet = cometRef.current;
      if (comet) {
        const key = flight ? `f${flight.from}-${flight.to}` : `h${stop}`;
        if (plane) {
          if (comet.dataset.key !== key) { comet.setAttribute("d", flight ? map.route(flight.from, flight.to) : map.network[stop - 1]); comet.dataset.key = key; }
          comet.style.strokeDashoffset = String(16 - (flight ? flown : travel) * 100);
          comet.style.opacity = "1";
        } else comet.style.opacity = "0";
      }
      const route = flightRouteRef.current;
      if (route) {
        if (flight) {
          const key = `${flight.from}-${flight.to}`;
          if (route.dataset.key !== key) { route.setAttribute("d", map.route(flight.from, flight.to)); route.dataset.key = key; }
          route.style.strokeDashoffset = String(100 - flown * 100);
          route.style.opacity = "1";
        } else route.style.opacity = "0";
      }
      // The plane climbs mid-flight: it grows and its shadow drifts away below it.
      if (planeRef.current && planeBodyRef.current && planeShadowRef.current) {
        if (plane) {
          // The heading follows the route closely, and never spins the long way round.
          const delta = ((plane.angle - state.angle + 540) % 360) - 180;
          state.angle += delta * Math.min(1, elapsed / 50);
          const size = (1.05 + plane.altitude * .65) / cam.s;
          const drift = plane.altitude * 16 / cam.s;
          planeRef.current.setAttribute("transform", `translate(${plane.x.toFixed(2)} ${plane.y.toFixed(2)})`);
          planeBodyRef.current.setAttribute("transform", `rotate(${state.angle.toFixed(2)}) scale(${size.toFixed(4)})`);
          planeShadowRef.current.setAttribute("transform", `translate(${drift.toFixed(2)} ${drift.toFixed(2)}) rotate(${state.angle.toFixed(2)}) scale(${(size * .9).toFixed(4)})`);
          planeShadowRef.current.style.opacity = (.15 + plane.altitude * .25).toFixed(3);
          planeRef.current.style.display = "";
        } else {
          planeRef.current.style.display = "none";
          // Ready for the next take-off: already pointing along the next route.
          state.angle = state.flight ? heading(state.flight.from, state.flight.to, 0) : stop >= 0 && stop < stops - 1 ? heading(stop, stop + 1, 0) : state.angle;
        }
      }
      // The world, repainted only when the camera or the light moved.
      const lit = flight ? map.points[flight.to] : phase === "tour" ? map.points[stop] : focus.city !== null ? map.points[focus.city] : null;
      const spotAt = plane ?? lit;
      const spot = { x: spotAt?.x ?? 0, y: spotAt?.y ?? 0, color: lit?.color ?? "#000", power: spotAt ? (plane ? .6 : .72) : 0 };
      const signature = `${cam.cx.toFixed(2)}|${cam.cy.toFixed(2)}|${cam.s.toFixed(4)}|${cam.fx.toFixed(1)}|${cam.fy.toFixed(1)}|${reveal.toFixed(3)}|${spot.x.toFixed(1)}|${spot.y.toFixed(1)}|${spot.power}|${spot.color}|${canvas.width}|${canvas.height}`;
      if (signature !== state.drawn) { paint(cam, reveal, spot); state.drawn = signature; }

      // React only hears about what changes the words on screen.
      const card = phase === "tour" && state.focus.city === null && !state.flight && local >= .45 ? stop : -1;
      const next: Ui = { phase, stop, card, flying: Boolean(state.flight) };
      const uiKey = `${next.phase}|${next.stop}|${next.card}|${next.flying}`;
      if (uiKey !== state.ui) { state.ui = uiKey; setUi(next); }

      // Once everything rests, the loop sleeps until the scroll or a click wakes it (a flight that
      // has just landed takes one more frame to clear its route).
      const settled = !flight && state.shown === state.target && !state.flight && (state.focus.city === null || state.focus.blend === state.focus.goal);
      if (visible && !settled) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame || !visible) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    state.wake = wake;
    const onProgress = (event: Event) => {
      state.target = Number((event as CustomEvent<number>).detail);
      wake();
    };
    journey.addEventListener("atlas-progress", onProgress);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(atlas);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { state.drawn = ""; wake(); }
    });
    visibility.observe(atlas);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibility.disconnect();
      journey.removeEventListener("atlas-progress", onProgress);
    };
  }, [map, cameras, heading]);

  // The pass unfolds once the camera has landed; the chapter rail steps aside while it is open.
  useEffect(() => {
    if (selected === null) return;
    const timer = window.setTimeout(() => setPassVisible(true), 300);
    document.documentElement.classList.add("atlas-pass-open");
    return () => window.clearTimeout(timer);
  }, [selected]);

  const travelTo = (index: number) => {
    const state = engine.current;
    if (state.flight || closing || selected === index || !state.cam) return;
    const from = selected ?? Math.max(0, ui.stop);
    state.openedAt = state.target;
    setPassVisible(false);
    if (from === index) {
      state.focus = { city: index, blend: state.focus.city === index ? state.focus.blend : 0, goal: 1 };
      setSelected(index);
    } else {
      setSelected(null);
      state.focus = { city: null, blend: 0, goal: 0 };
      state.flight = { from, to: index, startedAt: performance.now(), start: state.cam };
    }
    state.wake();
  };
  const closePass = () => {
    const state = engine.current;
    if (selected === null || closing) return;
    setClosing(true);
    setPassVisible(false);
    state.focus.goal = 0;
    state.wake();
    window.setTimeout(() => {
      setSelected(null);
      setClosing(false);
      document.documentElement.classList.remove("atlas-pass-open");
    }, 380);
  };
  // The loop closes the pass when the visitor scrolls on; it always reaches the current handler.
  useEffect(() => { engine.current.close = closePass; });

  // Escape closes the pass.
  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") engine.current.close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const active = selected === null ? null : map.points[selected];
  const previous = selected === null ? null : map.points[selected - 1] ?? null;
  const visited = ui.phase === "outro" ? stops - 1 : ui.stop;
  const hud = ui.flying ? "Vol en cours" : selected !== null ? "Mode escale" : ui.phase === "tour" ? `Escale ${String(ui.stop + 1).padStart(2, "0")} / ${String(stops).padStart(2, "0")} — ${map.points[ui.stop].place}` : ui.phase === "outro" ? "Choisissez une escale" : `${stops} villes · un même fil`;

  return (
    <div ref={atlasRef} className={`travel-atlas atlas-tour is-${ui.phase}${selected !== null ? " is-focused" : ""}${ui.flying ? " is-flying" : ""}`}>
      <div className="travel-atlas-hud"><span><i /> Parcours académique</span><b>{hud}</b><small>{Math.max(0, visited + 1)} / {stops} villes reliées</small></div>
      <div ref={worldRef} className="atlas-world">
        <canvas ref={canvasRef} className="atlas-canvas" aria-hidden="true" />
        <svg className="travel-atlas-svg travel-atlas-overlay" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="xMidYMid slice" aria-label="Carte interactive des études de Mathis">
          <g ref={stageRef} className="travel-atlas-stage">
            <g className="atlas-network" aria-hidden="true">
              {map.network.map((route, index) => (
                <g key={route} ref={(node) => { linkRefs.current[index] = node; }}>
                  <path className="atlas-route-glow" d={route} pathLength={100} />
                  <path className="atlas-route-line" d={route} pathLength={100} />
                  <circle r="3"><animateMotion dur={`${2.4 + index * .35}s`} repeatCount="indefinite" path={route} /></circle>
                </g>
              ))}
            </g>
            <path ref={flightRouteRef} className="atlas-flight-route" pathLength="100" style={{ opacity: 0 }} />
            <path ref={cometRef} className="atlas-comet" pathLength="100" style={{ opacity: 0 }} />
            <g ref={shockRef} className="atlas-shocks" aria-hidden="true" />
            {map.points.map((destination, index) => (
              <g
                key={destination.code}
                className={`atlas-point${selected === index ? " is-selected" : ""}${index > visited && selected === null && !ui.flying ? " is-ahead" : ""}${ui.phase === "tour" && index === ui.stop && selected === null ? " is-current" : ""}`}
                transform={`translate(${destination.x} ${destination.y})`}
                style={{ "--point-color": destination.color, "--radar-delay": `${index * -0.72}s` } as CSSProperties}
                role="button"
                tabIndex={0}
                aria-label={`Ouvrir la carte d’embarquement de ${destination.place}`}
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
                  <circle className="atlas-core-halo" r="13" />
                  <circle className="atlas-core" r="7" />
                  <text className="atlas-point-code" x="17" y="-10">{destination.code}</text>
                  <text className="atlas-point-name" x="17" y="5">{destination.place.toUpperCase()}</text>
                </g>
              </g>
            ))}
            <g ref={planeRef} className="atlas-plane" style={{ display: "none" }} aria-hidden="true">
              <g ref={planeShadowRef} className="atlas-plane-shadow"><path d={planeShape} /></g>
              <g ref={planeBodyRef} className="atlas-plane-body"><circle r="17" /><path d={planeShape} /></g>
            </g>
          </g>
        </svg>
      </div>

      {/* The stop being visited during the scroll tour. */}
      {destinations.map((stop, index) => (
        <div className={`atlas-stop-card${ui.card === index ? " is-visible" : ""}`} key={stop.code} aria-hidden={ui.card !== index} style={{ "--point-color": stop.color } as CSSProperties}>
          <span className="atlas-stop-n">Escale {String(index + 1).padStart(2, "0")} / {String(stops).padStart(2, "0")}</span>
          <b className="atlas-stop-code">{[...stop.code].map((letter, k) => <span key={k} style={{ "--l": k } as CSSProperties}>{letter}</span>)}</b>
          <strong>{stop.place}</strong>
          <small>{stop.country} · {stop.years}</small>
          <p>{stop.school}</p>
          <button type="button" className="atlas-stop-open" tabIndex={ui.card === index ? 0 : -1} onClick={() => travelTo(index)}>Ouvrir la carte d’embarquement <span aria-hidden="true">↗</span></button>
        </div>
      ))}

      {active && (
        <aside className={`atlas-pass${passVisible ? " is-visible" : ""}${closing ? " is-closing" : ""}`} key={active.code} aria-live="polite" aria-hidden={!passVisible} style={{ "--point-color": active.color } as CSSProperties}>
          <span className="atlas-pass-scan" aria-hidden="true" />
          <span className="atlas-pass-ghost" aria-hidden="true">{active.code}</span>
          <header className="atlas-pass-head">
            <button type="button" className="atlas-close" onClick={closePass} aria-label="Fermer la carte d’embarquement et revenir à la carte"><span aria-hidden="true">×</span> Fermer</button>
            <span className="atlas-pass-kicker">Carte d’embarquement · {String((selected ?? 0) + 1).padStart(2, "0")} / {String(stops).padStart(2, "0")}</span>
          </header>
          <div className="atlas-pass-route">
            <div><small>De</small><b>{previous?.code ?? "—"}</b><span>{previous?.place ?? "Départ"}</span></div>
            <i aria-hidden="true"><span>✈</span></i>
            <div><small>Vers</small><b>{active.code}</b><span>{active.place}</span></div>
          </div>
          <h3>{active.school}</h3>
          <p className="atlas-pass-degree">{active.degree} · {active.years}</p>
          <div className="atlas-pass-spec"><span>Spécialisation</span><strong>{active.specialization}</strong></div>
          {active.stack.length > 0 && <ul className="atlas-pass-stack">{active.stack.map((item) => <li key={item}>{item}</li>)}</ul>}
          {active.highlight && <p className="atlas-pass-highlight"><span aria-hidden="true">★</span> {active.highlight}</p>}
          <span className="atlas-pass-stamp" aria-hidden="true"><b>{active.place}</b><small>{active.years}</small></span>
          <footer className="atlas-pass-foot">
            <span className="atlas-pass-barcode" aria-hidden="true" />
            <nav aria-label="Escales voisines">
              <button type="button" disabled={selected === 0} onClick={() => selected !== null && travelTo(selected - 1)}>← {map.points[(selected ?? 0) - 1]?.code ?? ""}</button>
              <button type="button" disabled={selected === stops - 1} onClick={() => selected !== null && travelTo(selected + 1)}>{map.points[(selected ?? 0) + 1]?.code ?? ""} →</button>
            </nav>
          </footer>
        </aside>
      )}
      {ui.phase === "outro" && selected === null && !ui.flying && <p className="travel-atlas-prompt">Touchez une ville pour ouvrir sa carte d’embarquement.</p>}
    </div>
  );
}
