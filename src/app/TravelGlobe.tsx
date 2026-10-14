"use client";

import { useEffect, useRef } from "react";
import { geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

type WorldObjects = { countries: GeometryCollection; land: GeometryCollection };
type TravelFrame = { position: number; segment: number; flightProgress: number; from: number; to: number };

const destinations = [
  { code: "PAR", coordinates: [2.3522, 48.8566] as [number, number] },
  { code: "DUB", coordinates: [-6.2603, 53.3498] as [number, number] },
  { code: "BCN", coordinates: [2.1734, 41.3851] as [number, number] },
  { code: "YUL", coordinates: [-73.5673, 45.5019] as [number, number] },
  { code: "BOS", coordinates: [-71.0589, 42.3601] as [number, number] },
];

const topology = worldAtlas as unknown as Topology<WorldObjects>;
const land = feature(topology, topology.objects.land);
const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);
const graticule = geoGraticule10();
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const amount = clamp(value);
  return amount * amount * (3 - 2 * amount);
};

export default function TravelGlobe() {
  const shellRef = useRef<HTMLDivElement>(null);
  const fromCanvasRef = useRef<HTMLCanvasElement>(null);
  const toCanvasRef = useRef<HTMLCanvasElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const routeGhostRef = useRef<SVGPathElement>(null);
  const fromMarkerRef = useRef<HTMLDivElement>(null);
  const toMarkerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromCanvas = fromCanvasRef.current;
    const toCanvas = toCanvasRef.current;
    if (!fromCanvas || !toCanvas) return;

    const pixelRatio = Math.min(1.25, window.devicePixelRatio || 1);
    const bitmapSize = Math.round(520 * pixelRatio);
    const snapshots = new Map<number, HTMLCanvasElement>();
    const projections = destinations.map((destination) => geoOrthographic()
      .translate([360, 360])
      .scale(300)
      .clipAngle(90)
      .precision(0.7)
      .rotate([-destination.coordinates[0], -destination.coordinates[1], 0]));
    const idleHandles: Array<
      { kind: "idle"; handle: number } |
      { kind: "timer"; handle: ReturnType<typeof setTimeout> }
    > = [];

    const renderSnapshot = (index: number) => {
      const cached = snapshots.get(index);
      if (cached) return cached;
      const snapshot = document.createElement("canvas");
      snapshot.width = bitmapSize;
      snapshot.height = bitmapSize;
      const context = snapshot.getContext("2d", { alpha: true });
      if (!context) return snapshot;
      context.setTransform(bitmapSize / 720, 0, 0, bitmapSize / 720, 0, 0);
      const projection = projections[index];
      const path = geoPath(projection, context);
      const ocean = context.createRadialGradient(270, 226, 12, 360, 360, 315);
      ocean.addColorStop(0, "#315f76");
      ocean.addColorStop(0.52, "#102c45");
      ocean.addColorStop(1, "#040914");
      context.beginPath();
      context.arc(360, 360, 300, 0, Math.PI * 2);
      context.fillStyle = ocean;
      context.fill();
      context.save();
      context.beginPath();
      context.arc(360, 360, 300, 0, Math.PI * 2);
      context.clip();
      context.beginPath();
      path(graticule);
      context.strokeStyle = "#9fcfdc22";
      context.lineWidth = 0.7;
      context.stroke();
      context.beginPath();
      path(land);
      context.fillStyle = "#9aa891";
      context.fill();
      context.strokeStyle = "#d5ddbd88";
      context.lineWidth = 0.7;
      context.stroke();
      context.beginPath();
      path(borders);
      context.strokeStyle = "#0b1c2878";
      context.lineWidth = 0.55;
      context.stroke();
      context.restore();
      context.beginPath();
      context.arc(360, 360, 300, 0, Math.PI * 2);
      context.strokeStyle = "#b9f5ff8c";
      context.lineWidth = 1.7;
      context.shadowColor = "#62d8e8";
      context.shadowBlur = 9;
      context.stroke();
      snapshots.set(index, snapshot);
      return snapshot;
    };

    const paint = (target: HTMLCanvasElement, snapshot: HTMLCanvasElement) => {
      if (target.width !== bitmapSize || target.height !== bitmapSize) {
        target.width = bitmapSize;
        target.height = bitmapSize;
      }
      const context = target.getContext("2d", { alpha: true });
      if (!context) return;
      context.clearRect(0, 0, bitmapSize, bitmapSize);
      context.drawImage(snapshot, 0, 0, bitmapSize, bitmapSize);
    };

    let currentPair = "";
    const paintPair = (from: number, to: number) => {
      const pair = `${from}:${to}`;
      if (pair === currentPair) return;
      currentPair = pair;
      paint(fromCanvas, renderSnapshot(from));
      paint(toCanvas, renderSnapshot(to));
    };

    const setMarker = (marker: HTMLDivElement | null, x: number, y: number, code: string, visible: boolean) => {
      if (!marker) return;
      marker.style.opacity = visible ? "1" : "0";
      marker.style.setProperty("--marker-x", `${(x / 720) * 100}%`);
      marker.style.setProperty("--marker-y", `${(y / 720) * 100}%`);
      const label = marker.querySelector("b");
      if (label) label.textContent = code;
    };

    let latestFrame: TravelFrame = { position: 0, segment: 0, flightProgress: 0, from: 0, to: 1 };
    let animationFrame = 0;
    let lastSignature = "";
    const drawTravel = ({ segment, flightProgress, from, to }: TravelFrame, force = false) => {
      const signature = `${segment}:${flightProgress.toFixed(3)}`;
      if (!force && signature === lastSignature) return;
      lastSignature = signature;
      paintPair(from, to);

      const origin = destinations[Math.max(0, Math.min(destinations.length - 1, from))];
      const destination = destinations[Math.max(0, Math.min(destinations.length - 1, to))];
      const flight = ease(flightProgress);
      const globeMorph = ease(clamp((flight - 0.38) / 0.24));
      const direction = segment % 2 ? -1 : 1;
      const fromProjection = projections[Math.max(0, Math.min(destinations.length - 1, from))];
      const toProjection = projections[Math.max(0, Math.min(destinations.length - 1, to))];
      const interpolateRoute = geoInterpolate(origin.coordinates, destination.coordinates);
      const project = (routeProgress: number) => {
        const coordinate = interpolateRoute(clamp(routeProgress));
        const fromPoint = fromProjection(coordinate) ?? [360, 360];
        const toPoint = toProjection(coordinate) ?? [360, 360];
        return [
          fromPoint[0] + (toPoint[0] - fromPoint[0]) * globeMorph,
          fromPoint[1] + (toPoint[1] - fromPoint[1]) * globeMorph,
        ] as const;
      };
      const routePoints = Array.from({ length: 33 }, (_, index) => project(index / 32));
      const [originX, originY] = routePoints[0];
      const [destinationX, destinationY] = routePoints[routePoints.length - 1];
      const [planeX, planeY] = project(flight);
      const nextFlight = clamp(flight + 0.012);
      const [nextPlaneX, nextPlaneY] = project(nextFlight);
      const route = routePoints
        .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
        .join(" ");

      shellRef.current?.style.setProperty("--globe-morph", globeMorph.toFixed(4));
      shellRef.current?.style.setProperty("--globe-from-opacity", (1 - globeMorph).toFixed(4));
      shellRef.current?.style.setProperty("--globe-to-opacity", globeMorph.toFixed(4));
      shellRef.current?.style.setProperty("--globe-from-shift", `${globeMorph * -3 * direction}%`);
      shellRef.current?.style.setProperty("--globe-to-shift", `${(1 - globeMorph) * 3 * direction}%`);
      routeGhostRef.current?.setAttribute("d", route);
      routeRef.current?.setAttribute("d", route);
      routeRef.current?.style.setProperty("--route-dash", String(1 - flight));
      setMarker(fromMarkerRef.current, originX, originY, origin.code, flight < 0.92);
      setMarker(toMarkerRef.current, destinationX, destinationY, destination.code, flight > 0.08);

      if (planeRef.current) {
        const angle = Math.atan2(nextPlaneY - planeY, nextPlaneX - planeX) * 180 / Math.PI;
        planeRef.current.style.setProperty("--plane-x", `${(planeX / 720) * 100}%`);
        planeRef.current.style.setProperty("--plane-y", `${(planeY / 720) * 100}%`);
        planeRef.current.style.setProperty("--plane-angle", `${angle}deg`);
      }
    };

    const requestDraw = (frame: TravelFrame, force = false) => {
      latestFrame = frame;
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        drawTravel(latestFrame, force);
      });
    };
    const handleTravel = (event: Event) => requestDraw((event as CustomEvent<TravelFrame>).detail);
    renderSnapshot(0);
    renderSnapshot(1);
    paintPair(0, 1);
    const queue = (index: number) => {
      if ("requestIdleCallback" in window) {
        const handle = window.requestIdleCallback(() => renderSnapshot(index), { timeout: 1800 });
        idleHandles.push({ kind: "idle", handle });
      } else {
        const handle = globalThis.setTimeout(() => renderSnapshot(index), index * 180);
        idleHandles.push({ kind: "timer", handle });
      }
    };
    [2, 3, 4].forEach(queue);
    window.addEventListener("portfolio:travel", handleTravel);
    requestDraw(latestFrame, true);

    return () => {
      window.removeEventListener("portfolio:travel", handleTravel);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      idleHandles.forEach((job) => {
        if (job.kind === "idle") window.cancelIdleCallback(job.handle);
        else globalThis.clearTimeout(job.handle);
      });
    };
  }, []);

  return (
    <div className="travel-world" aria-hidden="true">
      <div className="travel-stars travel-stars-back" />
      <div className="travel-stars travel-stars-front" />
      <div className="travel-earth-shadow" />
      <div ref={shellRef} className="travel-earth-shell">
        <div className="travel-earth-atmosphere" />
        <div className="travel-earth-clip">
          <canvas ref={fromCanvasRef} className="travel-earth-map travel-earth-map-from" />
          <canvas ref={toCanvasRef} className="travel-earth-map travel-earth-map-to" />
          <svg className="travel-route-layer" viewBox="0 0 720 720">
            <path ref={routeGhostRef} className="travel-globe-route-ghost" pathLength="1" />
            <path ref={routeRef} className="travel-globe-route" pathLength="1" />
          </svg>
          <div ref={fromMarkerRef} className="travel-world-marker travel-world-marker-from"><i /><span /><b /></div>
          <div ref={toMarkerRef} className="travel-world-marker travel-world-marker-to"><i /><span /><b /></div>
          <div ref={planeRef} className="travel-world-plane">
            <span className="travel-world-plane-halo" />
            <svg viewBox="0 0 64 64"><path d="M57.6 30.2 37 20.7 33.8 5.8c-.4-2-3.1-2-3.6 0L27 20.7 6.4 30.2c-2.1 1-1.3 4.1 1 4l19-1.2-1.5 12.6-7.1 5c-1.5 1.1-.5 3.5 1.3 3.1l12.9-3 12.9 3c1.8.4 2.8-2 1.3-3.1l-7.1-5L37.6 33l19 1.2c2.3.1 3.1-3 1-4Z" /></svg>
          </div>
        </div>
      </div>
      <div className="travel-orbit travel-orbit-one" />
      <div className="travel-orbit travel-orbit-two" />
      <div className="travel-lens-flare"><i /><i /><i /></div>
    </div>
  );
}
