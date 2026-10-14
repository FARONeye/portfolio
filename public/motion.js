(() => {
  const init = () => {
    if (window.__portfolioMotionReady) return;
    window.__portfolioMotionReady = true;

    const root = document.documentElement;
    const introJourney = document.querySelector("[data-intro-journey]");
    const introSticky = introJourney?.querySelector(".intro-sticky");
    const introCount = introJourney?.querySelector(".intro-meter-count");
    const introShutters = Array.from(introJourney?.querySelectorAll("[data-intro-shutter]") || []);
    const introGlyphs = Array.from(introJourney?.querySelectorAll("[data-intro-glyph]") || []);
    const introFilmFrames = Array.from(introJourney?.querySelectorAll(".film-frame") || []);
    const introVerbs = Array.from(introJourney?.querySelectorAll("[data-intro-verb]") || []);
    const storyIntro = document.querySelector(".story-intro");
    const travelIntroStage = storyIntro?.querySelector(".travel-intro-stage");
    const storyJourney = document.querySelector("[data-story-journey]");
    const storySticky = storyJourney?.querySelector(".story-sticky");
    const panels = Array.from(document.querySelectorAll("[data-chapter]"));
    const travelPhotoSets = panels.map((panel) => Array.from(panel.querySelectorAll("[data-travel-photo]")));
    const capabilityJourney = document.querySelector("[data-capability-journey]");
    const capabilitySticky = capabilityJourney?.querySelector(".capability-sticky");
    const capabilityCards = Array.from(document.querySelectorAll("[data-capability-card]"));
    const capabilityCount = capabilityJourney?.querySelector(".capability-count");
    const capabilityMeterLabel = capabilityJourney?.querySelector(".capability-meter > span:first-child");
    const projectViewer = document.querySelector("[data-project-viewer]");
    const projectPanels = Array.from(document.querySelectorAll("[data-project-panel]"));
    const projectOpenButtons = Array.from(document.querySelectorAll("[data-project-open]"));
    const projectCloseButton = projectViewer?.querySelector("[data-project-close]");
    const about = document.querySelector(".about");
    const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const range = (value, start, end) => clamp((value - start) / (end - start));
    const ease = (value) => value * value * (3 - 2 * value);
    const mix = (from, to, amount) => from + (to - from) * amount;
    const set = (element, property, value) => element?.style.setProperty(property, String(value));

    let lastProjectTrigger = null;
    let projectCloseTimer = 0;

    const openProject = (index, trigger) => {
      if (!projectViewer || !projectPanels[index]) return;
      window.clearTimeout(projectCloseTimer);
      lastProjectTrigger = trigger;
      projectPanels.forEach((panel, panelIndex) => { panel.hidden = panelIndex !== index; });
      projectViewer.setAttribute("aria-labelledby", `project-viewer-title-${index}`);
      const accent = getComputedStyle(projectPanels[index]).getPropertyValue("--project-accent").trim();
      if (accent) set(projectViewer, "--project-accent", accent);
      if (typeof projectViewer.showModal === "function") projectViewer.showModal();
      else projectViewer.setAttribute("open", "");
      root.classList.add("project-viewer-open");
      window.requestAnimationFrame(() => {
        projectViewer.classList.add("is-open");
        projectCloseButton?.focus();
      });
    };

    const closeProject = () => {
      if (!projectViewer?.hasAttribute("open")) return;
      projectViewer.classList.remove("is-open");
      const finish = () => {
        if (typeof projectViewer.close === "function") projectViewer.close();
        else projectViewer.removeAttribute("open");
        root.classList.remove("project-viewer-open");
        lastProjectTrigger?.focus();
      };
      if (reducedMotion.matches) finish();
      else projectCloseTimer = window.setTimeout(finish, 320);
    };

    projectOpenButtons.forEach((button, index) => button.addEventListener("click", () => openProject(index, button)));
    projectCloseButton?.addEventListener("click", closeProject);
    projectViewer?.addEventListener("click", (event) => { if (event.target === projectViewer) closeProject(); });
    projectViewer?.addEventListener("cancel", (event) => { event.preventDefault(); closeProject(); });
    projectViewer?.addEventListener("close", () => {
      projectViewer.classList.remove("is-open");
      root.classList.remove("project-viewer-open");
    });

    if (!reducedMotion.matches) {
      root.classList.add("motion-enhanced");
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });
      reveals.forEach((element) => revealObserver.observe(element));
    }

    const updateIntro = () => {
      if (!introJourney || !introSticky || reducedMotion.matches || window.innerWidth <= 760) return;
      const rect = introJourney.getBoundingClientRect();
      const travel = Math.max(1, introJourney.offsetHeight - window.innerHeight);
      const openingProgress = clamp(-rect.top / travel);
      const progress = clamp(openingProgress / .895);
      const heroDepart = ease(range(progress, .055, .16));
      const portraitExpand = ease(range(progress, .07, .18));
      const shutterReveal = ease(range(progress, .095, .175));
      const shutterDrift = ease(range(progress, .16, .285));
      const shutterExit = ease(range(progress, .285, .37));
      const filmVisibility = range(progress, .285, .33) * (1 - range(progress, .64, .7));
      const filmPosition = range(progress, .31, .62) * Math.max(0, introFilmFrames.length - 1);
      const foldVisibility = range(progress, .57, .63) * (1 - range(progress, .74, .8));
      const finale = ease(range(progress, .61, .9));
      const handoff = ease(range(progress, .84, .99));
      const handoffExit = ease(range(openingProgress, .88, .925));
      const grain = range(progress, .08, .16) * (1 - range(progress, .95, 1));

      set(introSticky, "--intro-progress", progress.toFixed(4));
      set(introSticky, "--hero-meta-opacity", (1 - range(progress, .035, .11)).toFixed(3));
      set(introSticky, "--hero-meta-y", `${mix(0, -30, heroDepart)}px`);
      set(introSticky, "--hero-title-x", `${mix(0, -34, heroDepart)}vw`);
      set(introSticky, "--hero-title-y", `${mix(0, 8, heroDepart)}vh`);
      set(introSticky, "--hero-title-scale", mix(1, .68, heroDepart).toFixed(4));
      set(introSticky, "--hero-title-rotate", `${mix(0, -7, heroDepart)}deg`);
      set(introSticky, "--hero-title-opacity", (1 - range(progress, .055, .13)).toFixed(3));
      set(introSticky, "--hero-first-x", `${mix(0, -10, heroDepart)}vw`);
      set(introSticky, "--hero-second-x", `${mix(0, 15, heroDepart)}vw`);
      set(introSticky, "--hero-bottom-opacity", (1 - range(progress, .03, .105)).toFixed(3));
      set(introSticky, "--hero-bottom-y", `${mix(0, 70, heroDepart)}px`);
      set(introSticky, "--scroll-invite-opacity", (1 - range(progress, 0, .09)).toFixed(3));
      set(introSticky, "--scroll-invite-y", `${mix(0, 30, heroDepart)}px`);

      const portraitExit = ease(range(progress, .245, .335));
      set(introSticky, "--portrait-left", `${mix(mix(58, 47, portraitExpand), 112, portraitExit)}%`);
      set(introSticky, "--portrait-top", `${mix(mix(0, 7, portraitExpand), -10, portraitExit)}%`);
      set(introSticky, "--portrait-width", `${mix(42, 48, portraitExpand)}%`);
      set(introSticky, "--portrait-height", `${mix(100, 86, portraitExpand)}%`);
      set(introSticky, "--portrait-rotate", `${mix(mix(0, -2.8, portraitExpand), 7, portraitExit)}deg`);
      set(introSticky, "--portrait-image-scale", mix(1.09, 1.025, portraitExpand).toFixed(4));
      set(introSticky, "--portrait-image-x", `${mix(0, -1.5, portraitExpand)}%`);
      set(introSticky, "--portrait-image-y", `${mix(0, -1, portraitExpand)}%`);
      set(introSticky, "--portrait-caption-opacity", (1 - range(progress, .08, .13)).toFixed(3));
      set(introSticky, "--portrait-opacity", (1 - range(progress, .285, .34)).toFixed(3));

      set(introSticky, "--shutter-stage-opacity", (range(progress, .08, .12) * (1 - range(progress, .33, .39))).toFixed(3));
      set(introSticky, "--shutter-open", `${mix(0, 132, shutterReveal)}%`);
      set(introSticky, "--shutter-stage-rotate", `${mix(-4.5, 0, shutterReveal)}deg`);
      const shutterStartX = [-68, 72, -58, 64, -74, 76];
      const shutterStartY = [-34, -29, 31, 36, 4, -2];
      const shutterSettleX = [-13, 18, -22, 25, -31, 34];
      const shutterSettleY = [-19, -13, 17, 22, 3, -1];
      introShutters.forEach((shutter, index) => {
        const direction = index % 2 ? 1 : -1;
        const stagger = ease(range(progress, .105 + index * .006, .17 + index * .006));
        set(shutter, "--shutter-x", `${mix(shutterStartX[index], shutterSettleX[index], stagger) + direction * shutterDrift * 5 + direction * shutterExit * 38}vw`);
        set(shutter, "--shutter-y", `${mix(shutterStartY[index], shutterSettleY[index], stagger) + Math.sin(progress * 18 + index) * shutterDrift * 2 + (index - 2.5) * shutterExit * 7}vh`);
        set(shutter, "--shutter-rotate", `${mix(direction * 18, direction * (index + 2), stagger) + direction * shutterDrift * 5 + direction * shutterExit * 14}deg`);
        set(shutter, "--shutter-scale", mix(.35, 1, stagger).toFixed(3));
        set(shutter, "--shutter-opacity", (stagger * (1 - shutterExit)).toFixed(3));
      });

      const glyphStartsX = [-34, 24, -16, 31, -27, 18, -22, 28];
      const glyphStartsY = [-28, 31, 18, -33, 35, -17, 27, -25];
      const glyphStartsR = [-18, 14, -9, 21, -16, 11, -22, 17];
      introGlyphs.forEach((glyph, index) => {
        const assemble = ease(range(progress, .115 + index * .006, .19 + index * .006));
        const disperse = ease(range(progress, .255 + index * .002, .345 + index * .002));
        const distance = index - (introGlyphs.length - 1) / 2;
        set(glyph, "--glyph-x", `${mix(glyphStartsX[index], 0, assemble) + distance * disperse * 12}vw`);
        set(glyph, "--glyph-y", `${mix(glyphStartsY[index], 0, assemble) + (index % 2 ? -1 : 1) * disperse * 33}vh`);
        set(glyph, "--glyph-rotate", `${mix(glyphStartsR[index], 0, assemble) + distance * disperse * 6}deg`);
        set(glyph, "--glyph-scale", (mix(.35, 1, assemble) * mix(1, 1.45, disperse)).toFixed(3));
        set(glyph, "--glyph-opacity", (assemble * (1 - disperse)).toFixed(3));
      });

      set(introSticky, "--beat-1-opacity", (range(progress, .205, .23) * (1 - range(progress, .265, .295))).toFixed(3));
      set(introSticky, "--beat-1-x", `${mix(-3, 0, range(progress, .205, .24))}vw`);
      set(introSticky, "--beat-1-y", `${mix(35, 0, range(progress, .205, .24))}px`);
      set(introSticky, "--film-opacity", filmVisibility.toFixed(3));

      introFilmFrames.forEach((frameElement, index) => {
        const delta = index - filmPosition;
        const distance = Math.min(1.8, Math.abs(delta));
        const entry = ease(range(progress, .275 + index * .018, .34 + index * .018));
        const exit = ease(range(progress, .625, .7));
        const direction = delta < 0 ? -1 : 1;
        const visibility = entry * clamp(1 - Math.max(0, distance - 1.05) * 1.6) * (1 - exit);
        set(frameElement, "--frame-x", `${delta * 39 + direction * exit * 42}vw`);
        set(frameElement, "--frame-y", `${Math.sin((filmPosition - index) * Math.PI) * 4 + (index - 1) * 1.8 + direction * exit * 14}vh`);
        set(frameElement, "--frame-z", `${-distance * 330 - exit * 260}px`);
        set(frameElement, "--frame-rotate-y", `${delta * -27}deg`);
        set(frameElement, "--frame-rotate-z", `${delta * 2.6 + direction * exit * 11}deg`);
        set(frameElement, "--frame-scale", (1 - distance * .14 - exit * .16).toFixed(3));
        set(frameElement, "--frame-opacity", visibility.toFixed(3));
        set(frameElement, "--frame-clip", `${mix(42, 0, entry) + exit * 42}%`);
        set(frameElement, "--frame-photo-x", `${delta * -7}%`);
        set(frameElement, "--frame-photo-scale", (1.06 + distance * .18).toFixed(3));
      });

      introVerbs.forEach((verb, index) => {
        const distance = Math.abs(index - filmPosition);
        const focus = 1 - Math.min(1, distance);
        set(verb, "--verb-opacity", (focus * filmVisibility).toFixed(3));
        set(verb, "--verb-x", `${(index - filmPosition) * 18}vw`);
        set(verb, "--verb-y", `${(1 - focus) * 70}px`);
        set(verb, "--verb-scale", (.82 + focus * .18).toFixed(3));
      });

      set(introSticky, "--fold-opacity", foldVisibility.toFixed(3));
      set(introSticky, "--fold-scale", mix(.25, 2.4, range(progress, .57, .78)).toFixed(3));
      set(introSticky, "--fold-rotate", `${mix(-28, 152, range(progress, .57, .8))}deg`);
      set(introSticky, "--beat-2-opacity", (range(progress, .65, .685) * (1 - range(progress, .735, .78))).toFixed(3));
      set(introSticky, "--beat-2-x", `${mix(6, 0, range(progress, .65, .7))}vw`);
      set(introSticky, "--beat-2-y", `${mix(50, 0, range(progress, .65, .7))}px`);
      set(introSticky, "--grain-opacity", (grain * .14).toFixed(3));

      set(introSticky, "--beat-3-opacity", (range(progress, .79, .85) * (1 - range(progress, .84, .92))).toFixed(3));
      set(introSticky, "--beat-3-scale", mix(.72, 1, range(progress, .77, .9)).toFixed(3));
      set(introSticky, "--curtain-radius", `${mix(0, 160, finale)}%`);
      set(introSticky, "--curtain-rotate", `${mix(-18, 0, finale)}deg`);
      set(introSticky, "--handoff-opacity", (handoff * (1 - handoffExit)).toFixed(3));
      set(introSticky, "--handoff-title-y", `${mix(90, 0, handoff)}px`);
      set(introSticky, "--handoff-title-scale", mix(.76, 1, handoff).toFixed(3));
      set(introSticky, "--handoff-route", mix(0, .32, handoff).toFixed(3));
      set(introSticky, "--handoff-orbit-scale", mix(.35, .82, handoff).toFixed(3));
      set(introSticky, "--handoff-orbit-rotate", `${mix(-42, 18, handoff)}deg`);

      const phase = progress < .11 ? 0 : progress < .3 ? 1 : progress < .63 ? 2 : progress < .91 ? 3 : 4;
      introSticky.dataset.phase = String(phase);
      if (introCount) introCount.textContent = String(Math.round(progress * 100)).padStart(2, "0");
    };

    const updateTravelIntro = () => {
      if (!introJourney || !storyIntro || !travelIntroStage || reducedMotion.matches || window.innerWidth <= 760) return;
      const rect = introJourney.getBoundingClientRect();
      const travel = Math.max(1, introJourney.offsetHeight - window.innerHeight);
      const openingProgress = clamp(-rect.top / travel);
      const progress = range(openingProgress, .86, 1);
      const arrival = ease(range(progress, 0, .22));
      const route = mix(.32, 1, ease(range(progress, .12, .6)));
      const departure = ease(range(progress, .57, .96));

      set(travelIntroStage, "--travel-intro-progress", progress.toFixed(4));
      set(storyIntro, "--travel-intro-stage-opacity", ease(range(openingProgress, .865, .905)).toFixed(3));
      set(travelIntroStage, "--travel-intro-eyebrow-opacity", (arrival * (1 - range(progress, .7, .88))).toFixed(3));
      set(travelIntroStage, "--travel-intro-line-one-x", `${mix(-8, -departure * 10, arrival)}vw`);
      set(travelIntroStage, "--travel-intro-line-two-x", `${mix(10, departure * 12, arrival)}vw`);
      set(travelIntroStage, "--travel-intro-title-scale", mix(.9, 1 + departure * .58, arrival).toFixed(3));
      set(travelIntroStage, "--travel-intro-title-opacity", ((.18 + arrival * .82) * (1 - range(progress, .78, .96))).toFixed(3));
      set(travelIntroStage, "--travel-intro-copy-opacity", (range(progress, .18, .38) * (1 - range(progress, .68, .86))).toFixed(3));
      set(travelIntroStage, "--travel-intro-copy-y", `${mix(38, -26, route)}px`);
      set(travelIntroStage, "--travel-intro-pass-opacity", (range(progress, .28, .46) * (1 - range(progress, .74, .9))).toFixed(3));
      set(travelIntroStage, "--travel-intro-pass-x", `${mix(16, -8, route)}vw`);
      set(travelIntroStage, "--travel-intro-pass-rotate", `${mix(-13, -3, route)}deg`);
      set(travelIntroStage, "--travel-intro-route", route.toFixed(3));
      set(travelIntroStage, "--travel-intro-orbit-scale", mix(.82, 1.25, range(route, .32, 1)).toFixed(3));
      set(travelIntroStage, "--travel-intro-orbit-rotate", `${mix(18, 128, range(route, .32, 1))}deg`);
      set(travelIntroStage, "--travel-intro-wipe", `${mix(0, 145, departure)}%`);
      set(travelIntroStage, "--travel-intro-wipe-label", (range(progress, .7, .82) * (1 - range(progress, .9, .98))).toFixed(3));
    };

    const updateStory = () => {
      if (!storyJourney || !storySticky || !panels.length || reducedMotion.matches || window.innerWidth <= 760) return;
      const rect = storyJourney.getBoundingClientRect();
      const travel = Math.max(1, storyJourney.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel);
      const position = progress * (panels.length - 1);
      const lastIndex = panels.length - 1;
      const atFinalDestination = position >= lastIndex - .0001;
      const segmentIndex = Math.min(lastIndex - 1, Math.floor(position));
      const segmentProgress = atFinalDestination ? 1 : position % 1;
      const active = atFinalDestination ? lastIndex : Math.min(lastIndex, Math.floor(position + .55));
      const departure = atFinalDestination ? 0 : ease(range(segmentProgress, .12, .28));
      const approach = atFinalDestination ? 1 : ease(range(segmentProgress, .3, .58));
      const arrival = atFinalDestination ? 1 : ease(range(segmentProgress, .48, .82));
      const flightProgress = atFinalDestination ? 1 : range(segmentProgress, .18, .6);
      const flightSurge = Math.sin(flightProgress * Math.PI);
      const globeFade = atFinalDestination ? 1 : ease(range(segmentProgress, .4, .58));
      const globeVisibility = atFinalDestination ? 0 : Math.sin(segmentProgress * Math.PI) * (1 - globeFade * .98);
      const globeScale = atFinalDestination
        ? 3.4
        : segmentProgress < .4
          ? mix(3.4, 1, departure)
          : mix(1, 3.4, approach);
      const globeTilt = Math.sin(segmentProgress * Math.PI * 2) * flightSurge * 4.5;
      const atmosphere = Math.sin(range(segmentProgress, .39, .68) * Math.PI) * (segmentProgress < .68 ? 1 : 0);

      set(storySticky, "--story-progress", progress.toFixed(4));
      set(storySticky, "--story-stage-opacity", rect.top <= 1 ? "1" : "0");
      set(storySticky, "--flight-surge", flightSurge.toFixed(4));
      set(storySticky, "--earth-opacity", globeVisibility.toFixed(3));
      set(storySticky, "--earth-scale", globeScale.toFixed(3));
      set(storySticky, "--earth-rotate", `${globeTilt}deg`);
      set(storySticky, "--earth-decor-opacity", (1 - globeFade).toFixed(3));
      set(storySticky, "--earth-x", `${Math.sin(segmentProgress * Math.PI) * -2.5}vw`);
      set(storySticky, "--earth-y", `${mix(7, 0, flightSurge)}vh`);
      set(storySticky, "--travel-plane-opacity", (range(segmentProgress, .17, .25) * (1 - range(segmentProgress, .46, .56))).toFixed(3));
      set(storySticky, "--travel-plane-scale", (0.82 + flightSurge * .28).toFixed(3));
      set(storySticky, "--travel-route-opacity", (flightSurge * .95).toFixed(3));
      set(storySticky, "--travel-stars-speed", `${position * -8}vh`);
      set(storySticky, "--travel-atmosphere", (atmosphere * .7).toFixed(3));
      set(storySticky, "--travel-atmosphere-scale", mix(.72, 1.28, approach).toFixed(3));
      set(storySticky, "--travel-space-vignette", (.48 + flightSurge * .3).toFixed(3));
      storySticky.dataset.activeChapter = String(active);

      window.dispatchEvent(new CustomEvent("portfolio:travel", {
        detail: {
          position,
          segment: segmentIndex,
          flightProgress,
          from: segmentIndex,
          to: segmentIndex + 1,
        },
      }));

      panels.forEach((panel, index) => {
        const isDeparting = index === segmentIndex && !atFinalDestination;
        const isArriving = index === segmentIndex + 1 && !atFinalDestination;
        const isFinal = index === lastIndex && atFinalDestination;
        const memoryPresence = isDeparting ? 1 - departure : isArriving ? arrival : isFinal ? 1 : 0;
        const presence = memoryPresence;
        const motion = isDeparting ? departure : isArriving ? 1 - arrival : 0;
        const direction = isDeparting ? -1 : 1;

        set(panel, "--scene-opacity", presence.toFixed(3));
        set(panel, "--scene-scale", mix(1, .72, motion).toFixed(3));
        set(panel, "--scene-z", `${motion * -720}px`);
        set(panel, "--scene-y", `${direction * motion * 7}vh`);
        set(panel, "--scene-rotate-x", `${direction * motion * 9}deg`);
        set(panel, "--memory-copy-opacity", range(memoryPresence, .48, .82).toFixed(3));
        set(panel, "--memory-copy-y", `${motion * 64}px`);
        set(panel, "--memory-word-opacity", (memoryPresence * .22).toFixed(3));
        set(panel, "--memory-word-scale", mix(.84, 1, memoryPresence).toFixed(3));
        set(panel, "--country-sign-opacity", (range(memoryPresence, .22, .72) * .82).toFixed(3));
        set(panel, "--country-sign-scale", mix(.62, 1, memoryPresence).toFixed(3));
        set(panel, "--country-sign-rotate", `${mix(direction * -18, 0, memoryPresence)}deg`);
        set(panel, "--country-sign-progress", memoryPresence.toFixed(3));

        travelPhotoSets[index]?.forEach((photo, photoIndex) => {
          const stagger = photoIndex * .1;
          const photoPresence = isDeparting
            ? 1 - range(departure, .35 + stagger, .8 + stagger * .35)
            : isArriving
              ? range(arrival, .08 + stagger, .56 + stagger)
              : isFinal ? 1 : 0;
          const photoMotion = 1 - photoPresence;
          const scatterX = [-8, 24, -20, 28][photoIndex] || 0;
          const scatterY = [10, -18, 22, 13][photoIndex] || 0;
          const scatterRotate = [-4, 13, -11, 9][photoIndex] || 0;
          set(photo, "--memory-photo-opacity", photoPresence.toFixed(3));
          set(photo, "--memory-photo-x", `${scatterX * photoMotion * direction}vw`);
          set(photo, "--memory-photo-y", `${scatterY * photoMotion}vh`);
          set(photo, "--memory-photo-z", `${photoMotion * -520}px`);
          set(photo, "--memory-photo-rotate", `${scatterRotate * photoMotion * direction}deg`);
          set(photo, "--memory-photo-scale", mix(1, .72, photoMotion).toFixed(3));
          set(photo, "--memory-photo-clip", `${photoMotion * 48}%`);
          set(photo, "--memory-image-scale", (1.04 + photoMotion * .28).toFixed(3));
        });

        panel.style.zIndex = presence > 0 ? String(20 + index) : String(index);
        panel.classList.toggle("is-current", index === active);
        panel.classList.toggle("is-present", presence > .01);
      });
    };

    const updateCapabilities = () => {
      if (!capabilityJourney || !capabilitySticky || !capabilityCards.length || reducedMotion.matches || window.innerWidth <= 760) return;
      const rect = capabilityJourney.getBoundingClientRect();
      const travel = Math.max(1, capabilityJourney.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel);
      const unfold = ease(range(progress, .06, .18));
      const carouselProgress = range(progress, .18, .78);
      const carouselPosition = carouselProgress * (capabilityCards.length - 1);
      const exit = ease(range(progress, .78, .9));
      const finale = ease(range(progress, .84, .99));
      const active = Math.min(capabilityCards.length - 1, Math.round(carouselPosition));

      set(capabilitySticky, "--cap-progress", progress.toFixed(4));
      set(capabilitySticky, "--cap-heading-opacity", (1 - range(progress, .12, .25)).toFixed(3));
      set(capabilitySticky, "--cap-grid-x", `${mix(0, -7, progress)}vw`);
      set(capabilitySticky, "--cap-grid-y", `${mix(0, 9, progress)}vh`);
      set(capabilitySticky, "--cap-grid-scale", mix(1.15, .78, unfold).toFixed(3));
      set(capabilitySticky, "--cap-title-x", "0vw");
      set(capabilitySticky, "--cap-title-y", "0vh");
      set(capabilitySticky, "--cap-title-scale", mix(1, .43, unfold).toFixed(3));
      set(capabilitySticky, "--cap-title-opacity", (1 - range(progress, .18, .28)).toFixed(3));

      const startRotations = [-9, -4, 1, 5, 9];

      capabilityCards.forEach((card, index) => {
        const delta = index - carouselPosition;
        const distance = Math.min(1.6, Math.abs(delta));
        const clampedDelta = clamp(delta, -1.35, 1.35);
        const direction = delta === 0 ? 0 : delta > 0 ? 1 : -1;
        const targetX = clampedDelta * 37;
        const targetY = distance * 5 + Math.sin((carouselPosition + index) * Math.PI) * 1.4;
        const targetZ = -distance * 220;
        const targetRotateY = clampedDelta * -26;
        const targetRotateZ = clampedDelta * 2.2;
        const targetScale = 1 - Math.min(1.35, distance) * .16;
        const distanceOpacity = clamp(1 - Math.max(0, distance - 1.08) * 1.8);
        const focus = 1 - Math.min(1, distance);

        set(card, "--cap-card-x", `${mix(0, targetX, unfold) + direction * exit * 20}vw`);
        set(card, "--cap-card-y", `${mix(index * 1.2, targetY, unfold) + (index % 2 ? -1 : 1) * exit * 18}vh`);
        set(card, "--cap-card-z", `${mix(index * -36, targetZ, unfold) - exit * 240}px`);
        set(card, "--cap-card-rotate", `${mix(startRotations[index], targetRotateZ, unfold) + direction * exit * 8}deg`);
        set(card, "--cap-card-rotate-y", `${mix(0, targetRotateY, unfold)}deg`);
        set(card, "--cap-card-scale", (mix(.68, targetScale, unfold) * mix(1, .7, exit)).toFixed(3));
        set(card, "--cap-card-opacity", (mix(1, distanceOpacity, unfold) * (1 - exit)).toFixed(3));
        set(card, "--cap-card-content-opacity", ((.18 + focus * .82) * unfold * (1 - exit)).toFixed(3));
        set(card, "--cap-card-content-y", `${mix(38, 0, focus * unfold)}px`);
        set(card, "--project-image-x", `${delta * -4.5}%`);
        set(card, "--project-image-y", `${Math.sin((carouselPosition - index) * Math.PI) * 4}%`);
        set(card, "--project-image-scale", (1.07 + distance * .14).toFixed(3));
        set(card, "--project-saturation", (.62 + focus * .38).toFixed(3));
        set(card, "--project-object-x", `${delta * -35}px`);
        set(card, "--project-object-y", `${Math.cos((carouselPosition + index) * Math.PI) * 22}px`);
        set(card, "--project-object-rotate", `${progress * (index % 2 ? -180 : 180) + delta * 12}deg`);
        set(card, "--project-object-scale", (.72 + focus * .28).toFixed(3));
        set(card, "--project-glint-x", `${mix(-140, 145, focus)}%`);
        set(card, "--project-action-opacity", (focus > .62 && unfold > .7 && exit < .2 ? 1 : 0).toFixed(3));
        card.style.zIndex = String(20 - Math.round(distance * 8));
        card.classList.toggle("is-current", index === active);
      });

      set(capabilitySticky, "--cap-finale-radius", `${mix(0, 145, finale)}%`);
      set(capabilitySticky, "--cap-finale-copy-opacity", range(progress, .82, .94).toFixed(3));
      set(capabilitySticky, "--cap-finale-title-scale", mix(.78, 1, range(progress, .8, .96)).toFixed(3));
      set(capabilitySticky, "--cap-finale-arrow-opacity", range(progress, .9, .98).toFixed(3));
      set(capabilitySticky, "--cap-finale-arrow-y", `${mix(-30, 0, range(progress, .9, .98))}px`);
      capabilitySticky.dataset.phase = progress > .9 ? "final" : "cards";
      capabilitySticky.dataset.activeProject = String(active);
      if (capabilityCount) capabilityCount.textContent = `${String(active + 1).padStart(2, "0")} / ${String(capabilityCards.length).padStart(2, "0")}`;
      if (capabilityMeterLabel) capabilityMeterLabel.textContent = progress > .9 ? "Poursuivre l’histoire" : progress < .18 ? "Déplier les projets" : "Cliquer pour ouvrir le projet";
    };

    const update = () => {
      frame = 0;
      scrollVelocity = scrollVelocity * .72 + (window.scrollY - lastScrollY) * .28;
      lastScrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      set(root, "--page-progress", Math.min(1, window.scrollY / maxScroll).toFixed(4));
      updateIntro();
      updateTravelIntro();
      updateStory();
      updateCapabilities();

      if (!reducedMotion.matches && about) {
        const rect = about.getBoundingClientRect();
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        set(about, "--about-title-x", `${(.5 - progress) * 9}vw`);
        set(about, "--about-clip", `${(1 - progress) * 32}%`);
        set(about, "--about-y", `${(1 - progress) * 80}px`);
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("pageshow", requestUpdate);
    reducedMotion.addEventListener?.("change", () => window.location.reload());
    update();
    window.requestAnimationFrame(() => window.requestAnimationFrame(update));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
