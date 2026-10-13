"use client";

import { useEffect, useRef } from "react";
import { geoEquirectangular, geoGraticule10, geoInterpolate, geoPath } from "d3-geo";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const routeGhostRef = useRef<SVGPathElement>(null);
  const fromMarkerRef = useRef<HTMLDivElement>(null);
  const toMarkerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const drawMap = () => {
      const pixelRatio = Math.min(1.25, window.devicePixelRatio || 1);
      canvas.width = Math.round(1200 * pixelRatio);
      canvas.height = Math.round(600 * pixelRatio);
      context.setTransform(canvas.width / 1440, 0, 0, canvas.height / 720, 0, 0);
      context.clearRect(0, 0, 1440, 720);
      const projection = geoEquirectangular().translate([720, 360]).scale(229.18).precision(0.7);
      const path = geoPath(projection, context);

      const ocean = context.createLinearGradient(0, 0, 1440, 720);
      ocean.addColorStop(0, "#193d57");
      ocean.addColorStop(0.5, "#0b253d");
      ocean.addColorStop(1, "#06101f");
      context.fillStyle = ocean;
      context.fillRect(0, 0, 1440, 720);
      context.beginPath();
      path(graticule);
      context.strokeStyle = "#9fcfdc20";
      context.lineWidth = 0.7;
      context.stroke();
      context.beginPath();
      path(land);
      context.fillStyle = "#9aa891";
      context.fill();
      context.strokeStyle = "#d5ddbd80";
      context.lineWidth = 0.8;
      context.stroke();
      context.beginPath();
      path(borders);
      context.strokeStyle = "#0b1c288c";
      context.lineWidth = 0.52;
      context.stroke();
    };

    const screenPoint = (point: [number, number], focus: [number, number], altitude = 0) => ({
      x: 360 + (point[0] - focus[0]) * 4.05,
      y: 360 - (point[1] - focus[1]) * 4.05 - altitude,
    });
    const setMarker = (marker: HTMLDivElement | null, point: { x: number; y: number }, code: string, visible: boolean) => {
      if (!marker) return;
      const inside = point.x > 45 && point.x < 675 && point.y > 45 && point.y < 675;
      marker.style.opacity = visible && inside ? "1" : "0";
      marker.style.setProperty("--marker-x", `${(point.x / 720) * 100}%`);
      marker.style.setProperty("--marker-y", `${(point.y / 720) * 100}%`);
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
      const origin = destinations[Math.max(0, Math.min(destinations.length - 1, from))];
      const destination = destinations[Math.max(0, Math.min(destinations.length - 1, to))];
      const interpolate = geoInterpolate(origin.coordinates, destination.coordinates);
      const flight = ease(flightProgress);
      const cameraProgress = ease(clamp((flightProgress - 0.04) / 0.84));
      const focus = interpolate(cameraProgress) as [number, number];
      const originPoint = screenPoint(origin.coordinates, focus);
      const destinationPoint = screenPoint(destination.coordinates, focus);
      const planeCoordinates = interpolate(flight) as [number, number];
      const nextCoordinates = interpolate(clamp(flight + 0.012)) as [number, number];
      const planePoint = screenPoint(planeCoordinates, focus, Math.sin(flight * Math.PI) * 72);
      const nextPlanePoint = screenPoint(nextCoordinates, focus, Math.sin(clamp(flight + 0.012) * Math.PI) * 72);

      mapRef.current?.style.setProperty("--map-x", `${(-focus[0] / 360) * 100}%`);
      mapRef.current?.style.setProperty("--map-y", `${(focus[1] / 180) * 100}%`);
      const curve = Math.max(32, Math.abs(destinationPoint.x - originPoint.x) * 0.2);
      const route = `M${originPoint.x.toFixed(1)},${originPoint.y.toFixed(1)} Q${((originPoint.x + destinationPoint.x) / 2).toFixed(1)},${(Math.min(originPoint.y, destinationPoint.y) - curve).toFixed(1)} ${destinationPoint.x.toFixed(1)},${destinationPoint.y.toFixed(1)}`;
      routeGhostRef.current?.setAttribute("d", route);
      routeRef.current?.setAttribute("d", route);
      routeRef.current?.style.setProperty("--route-dash", String(1 - flight));

      setMarker(fromMarkerRef.current, originPoint, origin.code, flight < 0.93);
      setMarker(toMarkerRef.current, destinationPoint, destination.code, flight > 0.07);
      if (planeRef.current) {
        const angle = Math.atan2(nextPlanePoint.y - planePoint.y, nextPlanePoint.x - planePoint.x) * 180 / Math.PI;
        planeRef.current.style.setProperty("--plane-x", `${(planePoint.x / 720) * 100}%`);
        planeRef.current.style.setProperty("--plane-y", `${(planePoint.y / 720) * 100}%`);
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
    const handleResize = () => drawMap();
    drawMap();
    window.addEventListener("portfolio:travel", handleTravel);
    window.addEventListener("resize", handleResize, { passive: true });
    requestDraw(latestFrame, true);

    return () => {
      window.removeEventListener("portfolio:travel", handleTravel);
      window.removeEventListener("resize", handleResize);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="travel-world" aria-hidden="true">
      <div className="travel-stars travel-stars-back" />
      <div className="travel-stars travel-stars-front" />
      <div className="travel-earth-shadow" />
      <div className="travel-earth-shell">
        <div className="travel-earth-atmosphere" />
        <div className="travel-earth-clip">
          <div ref={mapRef} className="travel-earth-map-wrap"><canvas ref={canvasRef} className="travel-earth-map" /></div>
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
