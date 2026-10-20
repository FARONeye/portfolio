(() => {
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const ease = (value) => value * value * (3 - 2 * value);
  const easeOut = (value) => 1 - (1 - value) ** 3;
  const mix = (from, to, amount) => from + (to - from) * amount;
  const mixArrays = (from, to, amount) => from.map((value, index) => mix(value, to[index], amount));
  const set = (element, property, value) => element?.style.setProperty(property, String(value));
  const px = (value) => `${value.toFixed(1)}px`;
  const seeded = (index, salt = 0) => {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };

  // Each variant stages the same six chapters differently. `update` returns true
  // while it needs frames without scrolling (idle loops, settling echoes).
  const variants = {};

  /* Fragments — the image is cut into shards that assemble, burst, orbit and fall. */
  variants.fragments = {
    init(ctx) {
      this.layer = ctx.stage.querySelector(".fr-shards");
      this.glow = ctx.stage.querySelector(".fr-glow");
      this.shards = ctx.q(".fr-shard");
      this.seeds = this.shards.map((_, index) => [seeded(index, 1) * 2 - 1, seeded(index, 2) * 2 - 1, seeded(index, 3) * 2 - 1, seeded(index, 4) * 2 - 1, seeded(index, 5)]);
    },
    update(ctx) {
      const { width: W, height: H, mobile, intro, scene, time } = ctx;
      const h0 = mobile ? Math.min(H * .4, W * 1.05) : Math.min(H * .74, 760);
      const w0 = h0 * .75;
      const tw = w0 / 4;
      const th = h0 / 5;
      set(this.layer, "--tw", px(tw));
      set(this.layer, "--th", px(th));
      set(this.layer, "--w0", px(w0));
      set(this.layer, "--h0", px(h0));
      const centers = mobile
        ? [[W * .5, H * .73], [W * .5, H * .5], [W * .5, H * .16], [W * .5, H * .42], [W * .5, H * .3], [W * .5, H * .3]]
        : [[W * .7, H * .52], [W * .5, H * .5], [W * .84, H * .28], [W * .5, H * .5], [W * .29, H * .52], [W * .29, H * .52]];
      const ringRadius = mobile ? W * .4 : H * .36;

      this.shards.forEach((shard, index) => {
        const [sx, sy, sz, sr, sd] = this.seeds[index];
        const column = index % 4;
        const row = Math.floor(index / 4);
        const ox = (column - 1.5) * tw;
        const oy = (row - 2) * th;
        const assembled = ([cx, cy], scale, gap = 1, spin = 0, z = 0) => {
          const angle = spin * Math.PI / 180;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return [cx + (ox * cos - oy * sin) * scale * gap, cy + (ox * sin + oy * cos) * scale * gap, z, 0, 0, spin, scale, 1];
        };
        const side = sx < 0 ? -1 : 1;
        // Burst shards keep clear of the centred question.
        const burst = mobile
          ? [W * .5 + sx * W * .52, H * .5 + (sy < 0 ? -1 : 1) * (H * .25 + Math.abs(sy) * H * .22), sz * 260, sr * 50, sx * 60, sr * 140 + scene[1].inner * 70 * sr, .45 + sd * .35, .7]
          : [W * .5 + side * (W * .31 + Math.abs(sx) * W * .19), H * .5 + sy * H * .44, sz * 320, sr * 50, sx * 70, sr * 140 + scene[1].inner * 80 * sr, .55 + sd * .45, .78];
        const angle = (index / this.shards.length) * Math.PI * 2 + scene[3].inner * Math.PI * .8;
        const ring = [centers[3][0] + Math.cos(angle) * ringRadius * (mobile ? 1 : 1.5), centers[3][1] + Math.sin(angle) * ringRadius, Math.sin(angle * 2) * 90, 0, 0, angle * 180 / Math.PI + 90, mobile ? .3 : .4, .9];
        const breathe = Math.sin(column * 1.3 + row * .9 + time * 1.4) * 7;
        const fall = [centers[5][0] + ox + sx * W * .25, H * (1.25 + sd * .5), sz * 240, sr * 90, sx * 70, sr * 220, 1, 0];
        const states = [
          assembled(centers[0], 1, 1.014),
          burst,
          assembled(centers[2], mobile ? .3 : .44, 1.04, -8 + scene[2].inner * 16),
          ring,
          assembled(centers[4], mobile ? .72 : 1, 1.004, 0, breathe),
          fall,
        ];
        // Centred stagger: shards leave a little early or late, yet all settle within the chapter.
        let value = ctx.morph(states, (sd - .5) * .2, .32);
        if (intro < 1) {
          const arrival = easeOut(clamp(intro * 1.55 - sd * .55));
          value = mixArrays([W * .5 + sx * W * .75, H * .5 + sy * H * .9, sz * 900 - 500, sr * 170, sx * 130, sr * 320, 1.5, 0], value, arrival);
        }
        const [x, y, z, rx, ry, rz, scale, opacity] = value;
        shard.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        shard.style.opacity = opacity.toFixed(3);
      });

      const [gx, gy] = ctx.morph(centers);
      set(this.glow, "--gx", px(gx));
      set(this.glow, "--gy", px(gy));
      return scene[4].vis > .01;
    },
  };

  /* Afterimage — a horizontal rail; the image leaves coloured echoes at speed. */
  variants.afterimage = {
    init(ctx) {
      this.rail = ctx.stage.querySelector(".af-rail");
      this.frames = ctx.stage.querySelector(".af-frames");
      this.main = ctx.stage.querySelector(".af-main");
      this.echoes = [1, 2, 3].map((index) => ctx.stage.querySelector(`.af-echo-${index}`));
      this.svg = ctx.stage.querySelector(".af-wave");
      this.wave = ctx.stage.querySelector(".af-wave-main");
      this.waveEcho = ctx.stage.querySelector(".af-wave-echo");
      this.counter = ctx.stage.querySelector(".af-live b");
      this.lastChapter = ctx.chapter;
      this.railVelocity = 0;
      this.count = "";
      this.formatter = new Intl.NumberFormat("fr-FR");
    },
    update(ctx) {
      const { width: W, height: H, mobile, chapter, velocity, unit, scene, time } = ctx;
      set(this.rail, "--rail", chapter.toFixed(4));
      this.railVelocity = this.railVelocity * .72 + (chapter - this.lastChapter) * .28;
      this.lastChapter = chapter;

      const h0 = mobile ? H * .42 : H * .72;
      set(this.frames, "--fh", px(h0));
      set(this.frames, "--fw", px(h0 * .75));
      const states = mobile
        ? [[W * .5, H * .7, H * .36, 0, 1], [W * .5, H * .29, H * .3, -4, 1], [W * .5, H * .17, H * .17, 0, 1], [W * .5, H * .33, H * .17, 0, 1], [W * .5, H * .29, H * .28, 0, 1], [-W * .5, H * .4, H * .3, -8, 0]]
        : [[W * .72, H * .5, H * .72, 0, 1], [W * .25, H * .53, H * .62, -4, 1], [W * .12, H * .57, H * .3, 0, 1], [W * .63, H * .53, H * .3, 0, 1], [W * .5, H * .36, H * .44, 0, 1], [-W * .3, H * .5, H * .5, -8, 0]];
      const [cx, cy, h, rotate, opacity] = ctx.morph(states);
      const scale = h / h0;
      const tilt = clamp(this.railVelocity * 1500 + velocity * .35, -42, 42);
      const triptych = ease(scene[4].vis);
      const frame = (element, x, y, s, turn, alpha) => {
        element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) perspective(1200px) rotateY(${turn.toFixed(2)}deg) rotateZ(${rotate.toFixed(2)}deg) scale(${s.toFixed(4)})`;
        element.style.opacity = alpha.toFixed(3);
      };
      frame(this.main, cx, cy, scale, -tilt, opacity);
      // Echoes trail behind motion, then become the other clients' screens.
      this.echoes.forEach((echo, index) => {
        const order = index + 1;
        const trail = clamp(-(velocity * 2.6 + this.railVelocity * 2800) * order, -300, 300);
        const screen = order === 3 ? 0 : (order === 1 ? 1 : -1) * W * (mobile ? .34 : .3);
        const x = cx + mix(trail, screen, triptych);
        const base = [.5, .3, .16][index] * clamp(Math.abs(trail) / 50 + .3);
        set(echo, "--tint", (1 - triptych).toFixed(3));
        frame(echo, x, cy + trail * .06, scale * mix(1, mobile ? .6 : .82, triptych), -tilt * (1 + order * .18), mix(base, order === 3 ? 0 : opacity, triptych) * opacity);
      });

      // A live signal: calm at rest, agitated by fast scrolling.
      if (this.svg.dataset.size !== `${W}x${H}`) {
        this.svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        this.svg.dataset.size = `${W}x${H}`;
      }
      const amplitude = 9 + Math.min(70, Math.abs(velocity) * 3.2) + scene[2].vis * 14;
      const baseline = H * (mobile ? .9 : .86);
      const path = (phase, gain) => {
        let d = "";
        for (let step = 0; step <= 64; step++) {
          const x = (step / 64) * W;
          const y = baseline + Math.sin(x * .011 + time * 1.7 + unit * 5 + phase) * amplitude * gain + Math.sin(x * .029 - time * 2.4 - unit * 7 + phase) * amplitude * .38 * gain;
          d += `${step ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        return d;
      };
      set(ctx.stage, "--wave-o", (1 - scene[4].vis * .75).toFixed(3));
      this.wave.setAttribute("d", path(0, 1));
      this.waveEcho.setAttribute("d", path(-.9, .7));

      const count = this.formatter.format(Math.round(1240 + ctx.progress * 48210 + time * 3.4));
      if (count !== this.count) {
        this.counter.textContent = count;
        this.count = count;
      }
      return true;
    },
  };

  /* Horizon — chapters wait on the horizon and rush past the camera. */
  variants.horizon = {
    init(ctx) {
      this.floor = ctx.stage.querySelector(".hz-floor");
      this.monolith = ctx.stage.querySelector(".hz-monolith");
      this.billboards = ctx.q(".hz-billboard");
      this.slabs = ctx.q(".hz-slab");
    },
    update(ctx) {
      const { width: W, height: H, mobile, chapter, unit, scene, scenes } = ctx;
      const depth = mobile ? 1100 : 1500;
      scenes.forEach((element, index) => {
        const distance = chapter - index;
        const opacity = distance <= 0 ? clamp(1 + distance * .92) : 1 - range(distance, .04, .3);
        // Never let a plane reach the camera: browsers cannot draw what is behind it.
        element.style.visibility = distance > .35 || distance < -1.25 ? "hidden" : "";
        set(element, "--z", px(Math.min(distance * depth, 700)));
        set(element, "--plane-x", px(distance < 0 ? distance * (index % 2 ? -1 : 1) * W * .1 : 0));
        set(element, "--plane-o", opacity.toFixed(3));
      });
      set(this.floor, "--floor-y", px(unit * 540));

      const h0 = mobile ? H * .5 : H * .66;
      set(this.monolith, "--mh", px(h0));
      set(this.monolith, "--mw", px(h0 * .75));
      const states = mobile
        ? [[.5, .73, 0, -14, .7, 1], [.5, .27, -260, 10, .6, 1], [.5, .22, -900, 0, .45, .6], [.5, .3, -1500, 0, .4, .4], [.5, .3, 80, 0, .66, 1], [.5, .6, -2600, 0, .4, 0]]
        : [[.74, .5, 0, -20, 1, 1], [.22, .53, -220, 22, .92, 1], [.84, .48, -900, -12, .62, .7], [.5, .44, -1600, 0, .55, .45], [.72, .5, 80, -10, .95, 1], [.5, .6, -2600, 0, .5, 0]];
      const [mx, my, mz, rotate, scale, opacity] = ctx.morph(states);
      this.monolith.style.transform = `translate3d(${(mx * W).toFixed(1)}px, ${(my * H).toFixed(1)}px, ${mz.toFixed(1)}px) translate(-50%, -50%) rotateY(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      this.monolith.style.opacity = opacity.toFixed(3);

      // Technologies: each billboard flies out of the distance and past the camera.
      const presence = clamp(1 - Math.abs(chapter - 3) * 1.6);
      this.billboards.forEach((billboard, index) => {
        const travel = scene[3].inner * (this.billboards.length + .6) - index;
        const z = Math.min((travel - 1) * 1300, 600);
        const side = index % 2 ? 1 : -1;
        const opacity = range(travel, -.7, .15) * (1 - range(travel, 1.02, 1.32)) * presence;
        billboard.style.transform = `translate3d(${(W * .5 + side * W * (mobile ? .16 : .25)).toFixed(1)}px, ${(H * (.46 + index * .05)).toFixed(1)}px, ${z.toFixed(1)}px) translate(-50%, -50%) rotateY(${side * -24}deg)`;
        billboard.style.opacity = opacity.toFixed(3);
        billboard.style.visibility = opacity > .001 ? "" : "hidden";
      });
      this.slabs.forEach((slab, index) => set(slab, "--s", (ctx.stepReveal[index] ?? 0).toFixed(4)));
      set(ctx.stage, "--sunrise", clamp(scene[4].vis + ctx.progress * .35).toFixed(3));
      return false;
    },
  };

  /* Solstice — a day passes (sky, sun, clock) while the pages of an issue turn. */
  const skies = [
    [[18, 16, 40], [124, 60, 74]],
    [[22, 30, 60], [152, 98, 88]],
    [[24, 38, 66], [104, 112, 132]],
    [[40, 18, 46], [192, 86, 62]],
    [[7, 8, 16], [24, 19, 36]],
  ];
  variants.solstice = {
    // The next page is already in place under the one being turned.
    enter: [-.4, .02],
    leave: [-.32, .1],
    init(ctx) {
      this.clock = ctx.stage.querySelector(".so-clock b");
      this.time = "";
    },
    update(ctx) {
      const { width: W, height: H, mobile, progress } = ctx;
      const arc = clamp(progress * 1.06);
      // The sun crosses the window left beside (or under, on phones) the pages.
      set(ctx.stage, "--sun-x", px((mobile ? mix(.12, .9, arc) : mix(.75, .95, arc)) * W));
      set(ctx.stage, "--sun-y", px(mobile ? H - 40 - Math.sin(Math.PI * arc) * 70 : H * .8 - Math.sin(Math.PI * arc) * H * .56));
      set(ctx.stage, "--sun-o", (1 - range(progress, .86, .96)).toFixed(3));
      set(ctx.stage, "--stars", range(progress, .74, .94).toFixed(3));
      const position = progress * (skies.length - 1);
      const from = skies[Math.floor(position)];
      const to = skies[Math.min(skies.length - 1, Math.floor(position) + 1)];
      const blend = ease(position - Math.floor(position));
      const rgb = (index) => `rgb(${mixArrays(from[index], to[index], blend).map(Math.round).join(" ")})`;
      set(ctx.stage, "--sky-top", rgb(0));
      set(ctx.stage, "--sky-bottom", rgb(1));
      const minutes = Math.round(6 * 60 + progress * 16 * 60);
      const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
      if (time !== this.time) {
        this.clock.textContent = time;
        this.time = time;
      }
      set(ctx.stage, "--clock-turn", `${(minutes / 720).toFixed(4)}turn`);
      return false;
    },
  };

  /* Elsewhere — a camera follows a route drawn across a map, stop after stop. */
  const bezier = ([a, b, c, d], t) => {
    const u = 1 - t;
    return [0, 1].map((axis) => u * u * u * a[axis] + 3 * u * u * t * b[axis] + 3 * u * t * t * c[axis] + t * t * t * d[axis]);
  };
  const splitBezier = ([a, b, c, d], t) => {
    const lerp = (p, q) => [mix(p[0], q[0], t), mix(p[1], q[1], t)];
    const ab = lerp(a, b);
    const bc = lerp(b, c);
    const cd = lerp(c, d);
    const abc = lerp(ab, bc);
    const bcd = lerp(bc, cd);
    return [a, ab, abc, lerp(abc, bcd)];
  };
  const curve = ([a, b, c, d], move = true) => `${move ? `M${a[0]} ${a[1]}` : ""}C${b[0].toFixed(1)} ${b[1].toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)} ${d[0].toFixed(1)} ${d[1].toFixed(1)}`;
  variants.elsewhere = {
    init(ctx) {
      this.map = ctx.stage.querySelector(".el-map");
      this.done = ctx.stage.querySelector(".el-route-done");
      this.marker = ctx.stage.querySelector(".el-marker");
      this.pins = ctx.q(".el-pin");
      this.waypoints = ctx.q(".el-waypoint");
      this.coords = ctx.stage.querySelector(".el-coords span");
      this.altitude = ctx.stage.querySelector(".el-coords b");
      this.lens = ctx.stage.querySelector(".el-lens");
      this.route = JSON.parse(this.map.dataset.route);
      this.stops = JSON.parse(this.map.dataset.stops);
      this.segments = this.route.slice(0, -1).map((start, index) => {
        const end = this.route[index + 1];
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const length = Math.hypot(dx, dy);
        const bend = index === 2 || index === 3 ? 0 : (index % 2 ? -1 : 1) * Math.min(90, length * .24);
        const nx = -dy / length * bend;
        const ny = dx / length * bend;
        return [start, [start[0] + dx * .33 + nx, start[1] + dy * .33 + ny], [start[0] + dx * .66 + nx, start[1] + dy * .66 + ny], end];
      });
      ctx.stage.querySelector(".el-route-ghost").setAttribute("d", this.segments.map((segment, index) => curve(segment, index === 0)).join(""));
      this.text = "";
    },
    update(ctx) {
      const { width: W, height: H, mobile, chapter, scene } = ctx;
      // The approach walks its three waypoints while its chapter holds still.
      const position = Math.min(this.segments.length, chapter + scene[2].inner * 2);
      const index = Math.min(this.segments.length - 1, Math.floor(position));
      const t = clamp(position - index);
      const [px0, py0] = bezier(this.segments[index], t);
      const partial = splitBezier(this.segments[index], t);
      this.done.setAttribute("d", this.segments.slice(0, index).map((segment, at) => curve(segment, at === 0)).join("") + curve(partial, index === 0));

      const k = mobile ? Math.max(W * 3.4 / 1600, H * 2 / 1000) : Math.max(W * 3 / 1600, H * 2.6 / 1000);
      set(this.map, "--map-w", px(1600 * k));
      set(this.map, "--map-h", px(1000 * k));
      const anchors = mobile
        ? [[.3, .62], [.5, .28], [.5, .22], [.5, .26], [.5, .27], [.5, .36]]
        : [[.64, .28], [.7, .48], [.72, .52], [.7, .5], [.67, .5], [.5, .5]];
      let [ax, ay] = ctx.morph(anchors);
      const fraction = chapter - Math.floor(chapter);
      let zoom = 1 - Math.sin(Math.PI * fraction) * .32;
      let mx = px0;
      let my = py0;
      // The last chapter pulls back to show the whole journey.
      const overview = ease(range(chapter, 4, 5));
      if (overview > 0) {
        const fit = Math.min(W * .9 / (1600 * k), H * .84 / (1000 * k));
        zoom = mix(zoom, fit, overview);
        mx = mix(mx, 800, overview);
        my = mix(my, 500, overview);
        ax = mix(ax, .5, overview);
        ay = mix(ay, .5, overview);
      }
      const rotate = Math.sin(chapter * 1.1) * 2.6 * (1 - overview);
      this.map.style.transform = `translate3d(${(ax * W).toFixed(1)}px, ${(ay * H).toFixed(1)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${zoom.toFixed(4)}) translate3d(${(-mx * k).toFixed(1)}px, ${(-my * k).toFixed(1)}px, 0)`;
      set(ctx.stage, "--compass", `${(-rotate).toFixed(2)}deg`);
      this.marker.style.left = `${(px0 / 16).toFixed(3)}%`;
      this.marker.style.top = `${(py0 / 10).toFixed(3)}%`;
      this.pins.forEach((pin, at) => pin.classList.toggle("is-reached", position >= this.stops[at] - .04));
      this.waypoints.forEach((waypoint, at) => waypoint.classList.toggle("is-reached", position >= 2 + at - .04));

      const latitude = 52.37 - (my / 1000) * 14.2;
      const longitude = -4.9 + (mx / 1600) * 23.6;
      const text = `${latitude.toFixed(4)}° N · ${Math.abs(longitude).toFixed(4)}° ${longitude < 0 ? "O" : "E"}`;
      if (text !== this.text) {
        this.coords.textContent = text;
        this.altitude.textContent = `Altitude ${new Intl.NumberFormat("fr-FR").format(Math.round(400 + (1 - zoom) * 6200 + overview * 9000))} m`;
        this.text = text;
      }

      const lensSize = mobile ? W * .72 : Math.min(H * .62, W * .4);
      const reveal = ease(scene[4].vis);
      set(this.lens, "--lens-d", px(lensSize));
      set(this.lens, "--lx", px(W * (mobile ? .5 : .67)));
      set(this.lens, "--ly", px(H * (mobile ? .29 : .5)));
      set(this.lens, "--ls", (.2 + reveal * .8 + scene[4].inner * .06).toFixed(4));
      set(this.lens, "--lo", reveal.toFixed(3));
      return false;
    },
  };

  const init = () => {
    const track = document.querySelector("[data-project-story]");
    if (!track || window.__projectStoryReady) return;
    window.__projectStoryReady = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const root = document.documentElement;
    const stage = track.querySelector(".ps-stage");
    const scenes = Array.from(track.querySelectorAll("[data-story-scene]"));
    const steps = Array.from(track.querySelectorAll("[data-story-step]"));
    const chapterButtons = Array.from(track.querySelectorAll("[data-story-goto]"));
    const progressLabel = track.querySelector(".ps-progress-label");
    const count = track.querySelector(".ps-count");
    const variant = variants[track.dataset.variant] || {};
    const [enterFrom, enterTo] = variant.enter || [-.08, .3];
    const [leaveFrom, leaveTo] = variant.leave || [-.3, .08];
    const weights = scenes.map((scene) => Number(scene.dataset.storyWeight || 1));
    const starts = weights.map((_, index) => weights.slice(0, index).reduce((sum, weight) => sum + weight, 0));
    const units = weights.reduce((sum, weight) => sum + weight, 0);
    const boundaries = starts.slice(1);
    const stepScene = scenes.findIndex((scene) => scene.contains(steps[0]));

    // Resting points in story units: one per chapter, one per step of the approach.
    const stops = scenes.flatMap((_, index) => {
      const start = starts[index];
      const weight = weights[index];
      if (index === 0) return [{ scene: index, unit: 0 }];
      if (index === scenes.length - 1) return [{ scene: index, unit: units }];
      if (index === stepScene) return steps.map((__, step) => ({ scene: index, unit: start + .3 + (step + .5) / steps.length * (weight - .6) }));
      return [{ scene: index, unit: start + weight / 2 }];
    });
    const scrollTopFor = (unit) => window.scrollY + track.getBoundingClientRect().top + (unit / units) * Math.max(1, track.offsetHeight - window.innerHeight);

    root.classList.add("has-project-story");
    stops.forEach(({ unit }) => {
      const stop = document.createElement("span");
      stop.className = "ps-snap";
      stop.setAttribute("aria-hidden", "true");
      stop.style.top = `calc(${(unit / units).toFixed(5)} * (100% - 100svh))`;
      track.append(stop);
    });
    chapterButtons.forEach((button) => button.addEventListener("click", () => {
      const stop = stops.find(({ scene }) => scene === Number(button.dataset.storyGoto));
      if (stop) window.scrollTo({ top: scrollTopFor(stop.unit), behavior: "smooth" });
    }));

    const ctx = {
      stage, scenes, steps, units, starts, weights, boundaries,
      q: (selector) => Array.from(stage.querySelectorAll(selector)),
      scene: scenes.map(() => ({ in: 0, out: 0, inner: 0, vis: 0 })),
      stepReveal: steps.map((_, index) => (index === 0 ? 1 : 0)),
      chapter: 0, unit: 0, progress: 0, velocity: 0, intro: 0, time: 0,
    };
    // Blends one state per chapter, each change centred on its chapter boundary.
    ctx.morph = (states, delay = 0, spread = .4) => {
      let value = states[0];
      boundaries.forEach((boundary, index) => {
        const amount = ease(range(ctx.unit - delay, boundary - spread, boundary + spread));
        if (amount > 0) value = mixArrays(value, states[index + 1], amount);
      });
      return value;
    };

    const startedAt = performance.now();
    let lastY = window.scrollY;
    let frame = 0;
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    function update(now = performance.now()) {
      frame = 0;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const rect = track.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(1, track.offsetHeight - height));
      const unit = progress * units;
      ctx.velocity = ctx.velocity * .82 + (window.scrollY - lastY) * .18;
      lastY = window.scrollY;
      Object.assign(ctx, {
        width, height, progress, unit,
        mobile: width <= 760,
        time: now / 1000,
        intro: easeOut(clamp((now - startedAt) / 1900)),
        chapter: boundaries.reduce((sum, boundary) => sum + ease(range(unit, boundary - .4, boundary + .4)), 0),
      });

      let active = 0;
      scenes.forEach((element, index) => {
        const start = starts[index];
        const end = start + weights[index];
        const enter = index === 0 ? 1 : ease(range(unit, start + enterFrom, start + enterTo));
        const leave = index === scenes.length - 1 ? 0 : ease(range(unit, end + leaveFrom, end + leaveTo));
        const state = { in: enter, out: leave, inner: range(unit, start + .3, end - .3), vis: enter * (1 - leave) };
        ctx.scene[index] = state;
        set(element, "--in", state.in.toFixed(4));
        set(element, "--out", state.out.toFixed(4));
        set(element, "--inner", state.inner.toFixed(4));
        set(element, "--vis", state.vis.toFixed(4));
        const hidden = state.vis < .01;
        if (element.inert !== hidden) element.inert = hidden;
        if (state.vis > ctx.scene[active].vis) active = index;
      });

      if (stepScene >= 0) {
        const inner = ctx.scene[stepScene].inner;
        ctx.stepReveal = steps.map((_, step) => (step === 0 ? 1 : ease(range(inner, step / steps.length - .12, step / steps.length + .1))));
        const stepPosition = ctx.stepReveal.slice(1).reduce((sum, value) => sum + value, 0);
        steps.forEach((step, index) => {
          set(step, "--s", ctx.stepReveal[index].toFixed(4));
          set(step, "--dim", (ctx.stepReveal[index + 1] || 0).toFixed(4));
          set(step, "--focus", clamp(1 - Math.abs(stepPosition - index)).toFixed(4));
        });
        set(scenes[stepScene], "--steps-fill", inner.toFixed(4));
        set(scenes[stepScene], "--step-pos", stepPosition.toFixed(4));
      }

      set(stage, "--u", unit.toFixed(4));
      set(stage, "--chapter", ctx.chapter.toFixed(4));
      set(stage, "--vel", clamp(ctx.velocity, -60, 60).toFixed(2));
      set(stage, "--story-progress", progress.toFixed(4));
      set(stage, "--cue-opacity", (1 - range(unit, 0, .25)).toFixed(3));
      chapterButtons.forEach((button, index) => button.classList.toggle("is-active", index === active));
      if (count) count.textContent = `${String(active + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
      if (progressLabel) progressLabel.textContent = chapterButtons[active]?.textContent || "";

      const busy = variant.update?.(ctx);
      if (busy || ctx.intro < 1 || Math.abs(ctx.velocity) > .05) request();
    }

    ctx.unit = 0;
    variant.init?.(ctx);
    stage.classList.add("is-live");
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("pageshow", request);
    update();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
