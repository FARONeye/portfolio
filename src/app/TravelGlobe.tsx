"use client";

import { useEffect, useRef } from "react";
import { geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

type WorldObjects = {
  countries: GeometryCollection;
  land: GeometryCollection;
};

type TravelFrame = {
  position: number;
  segment: number;
  flightProgress: number;
  from: number;
  to: number;
};

const destinations = [
  { code: "PAR", name: "Paris", coordinates: [2.3522, 48.8566] as [number, number] },
  { code: "DUB", name: "Dublin", coordinates: [-6.2603, 53.3498] as [number, number] },
  { code: "BCN", name: "Barcelone", coordinates: [2.1734, 41.3851] as [number, number] },
  { code: "YUL", name: "Montréal", coordinates: [-73.5673, 45.5019] as [number, number] },
  { code: "BOS", name: "Boston", coordinates: [-71.0589, 42.3601] as [number, number] },
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
  const landRef = useRef<SVGPathElement>(null);
  const borderRef = useRef<SVGPathElement>(null);
  const graticuleRef = useRef<SVGPathElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const routeGhostRef = useRef<SVGPathElement>(null);
  const fromMarkerRef = useRef<SVGGElement>(null);
  const toMarkerRef = useRef<SVGGElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const projection = geoOrthographic()
      .translate([360, 360])
      .scale(300)
      .clipAngle(90)
      .precision(0.3);
    const path = geoPath(projection);

    const setMarker = (
      marker: SVGGElement | null,
      point: [number, number],
      code: string,
      visible: boolean,
    ) => {
      if (!marker) return;
      const projected = projection(point);
      if (!projected) {
        marker.style.opacity = "0";
        return;
      }
      marker.style.opacity = visible ? "1" : "0";
      marker.setAttribute("transform", `translate(${projected[0]} ${projected[1]})`);
      const label = marker.querySelector("text");
      if (label) label.textContent = code;
    };

    const draw = ({ segment, flightProgress, from, to }: TravelFrame) => {
      const origin = destinations[Math.max(0, Math.min(destinations.length - 1, from))];
      const destination = destinations[Math.max(0, Math.min(destinations.length - 1, to))];
      const interpolate = geoInterpolate(origin.coordinates, destination.coordinates);
      const flight = ease(flightProgress);
      const cameraProgress = ease(clamp((flightProgress - 0.07) / 0.93));
      const focus = interpolate(cameraProgress);
      const roll = Math.sin(flight * Math.PI) * (segment % 2 ? -5 : 5);

      projection.rotate([-focus[0], -focus[1], roll]);

      if (landRef.current) landRef.current.setAttribute("d", path(land) || "");
      if (borderRef.current) borderRef.current.setAttribute("d", path(borders) || "");
      if (graticuleRef.current) graticuleRef.current.setAttribute("d", path(graticule) || "");

      const fullRoute = Array.from({ length: 65 }, (_, index) => interpolate(index / 64));
      const traveledPointCount = Math.max(2, Math.ceil(flight * 64) + 1);
      const traveledRoute = Array.from(
        { length: traveledPointCount },
        (_, index) => interpolate((index / Math.max(1, traveledPointCount - 1)) * flight),
      );
      const fullPath = path({ type: "LineString", coordinates: fullRoute });
      const traveledPath = path({ type: "LineString", coordinates: traveledRoute });
      if (routeGhostRef.current) routeGhostRef.current.setAttribute("d", fullPath || "");
      if (routeRef.current) routeRef.current.setAttribute("d", traveledPath || "");

      setMarker(fromMarkerRef.current, origin.coordinates, origin.code, flight < 0.93);
      setMarker(toMarkerRef.current, destination.coordinates, destination.code, flight > 0.07);

      const planePoint = projection(interpolate(flight));
      const nextPlanePoint = projection(interpolate(clamp(flight + 0.012)));
      if (planeRef.current && planePoint && nextPlanePoint) {
        const angle = Math.atan2(nextPlanePoint[1] - planePoint[1], nextPlanePoint[0] - planePoint[0]) * 180 / Math.PI;
        planeRef.current.style.setProperty("--plane-x", `${(planePoint[0] / 720) * 100}%`);
        planeRef.current.style.setProperty("--plane-y", `${(planePoint[1] / 720) * 100}%`);
        planeRef.current.style.setProperty("--plane-angle", `${angle}deg`);
      }
    };

    const handleTravel = (event: Event) => draw((event as CustomEvent<TravelFrame>).detail);
    window.addEventListener("portfolio:travel", handleTravel);
    draw({ position: 0, segment: 0, flightProgress: 0, from: 0, to: 1 });

    return () => window.removeEventListener("portfolio:travel", handleTravel);
  }, []);

  return (
    <div className="travel-world" aria-hidden="true">
      <div className="travel-stars travel-stars-back" />
      <div className="travel-stars travel-stars-front" />
      <div className="travel-earth-shadow" />
      <div className="travel-earth-shell">
        <div className="travel-earth-atmosphere" />
        <svg className="travel-earth-map" viewBox="0 0 720 720">
          <defs>
            <radialGradient id="earth-ocean" cx="35%" cy="28%" r="72%">
              <stop offset="0" stopColor="#315f76" />
              <stop offset="0.52" stopColor="#102c45" />
              <stop offset="1" stopColor="#040914" />
            </radialGradient>
            <filter id="land-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <clipPath id="earth-disc"><circle cx="360" cy="360" r="300" /></clipPath>
          </defs>
          <circle className="travel-ocean" cx="360" cy="360" r="300" fill="url(#earth-ocean)" />
          <g clipPath="url(#earth-disc)">
            <path ref={graticuleRef} className="travel-graticule" />
            <path ref={landRef} className="travel-land" filter="url(#land-glow)" />
            <path ref={borderRef} className="travel-borders" />
            <path ref={routeGhostRef} className="travel-globe-route-ghost" />
            <path ref={routeRef} className="travel-globe-route" />
            <g ref={fromMarkerRef} className="travel-world-marker travel-world-marker-from">
              <circle r="6" /><circle r="17" /><text x="14" y="-11" />
            </g>
            <g ref={toMarkerRef} className="travel-world-marker travel-world-marker-to">
              <circle r="7" /><circle r="22" /><text x="16" y="-13" />
            </g>
          </g>
          <circle className="travel-earth-rim" cx="360" cy="360" r="300" />
          <ellipse className="travel-earth-light" cx="278" cy="250" rx="208" ry="244" />
        </svg>
        <div ref={planeRef} className="travel-world-plane">
          <span className="travel-world-plane-halo" />
          <svg viewBox="0 0 64 64">
            <path d="M57.6 30.2 37 20.7 33.8 5.8c-.4-2-3.1-2-3.6 0L27 20.7 6.4 30.2c-2.1 1-1.3 4.1 1 4l19-1.2-1.5 12.6-7.1 5c-1.5 1.1-.5 3.5 1.3 3.1l12.9-3 12.9 3c1.8.4 2.8-2 1.3-3.1l-7.1-5L37.6 33l19 1.2c2.3.1 3.1-3 1-4Z" />
          </svg>
        </div>
      </div>
      <div className="travel-orbit travel-orbit-one" />
      <div className="travel-orbit travel-orbit-two" />
      <div className="travel-lens-flare"><i /><i /><i /></div>
    </div>
  );
}
