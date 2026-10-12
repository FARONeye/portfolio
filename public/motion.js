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
    const storyJourney = document.querySelector("[data-story-journey]");
    const storySticky = storyJourney?.querySelector(".story-sticky");
    const panels = Array.from(document.querySelectorAll("[data-chapter]"));
    const travelStops = Array.from(storyJourney?.querySelectorAll("[data-travel-stop]") || []);
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
      const progress = clamp(-rect.top / travel);
      const heroDepart = ease(range(progress, .055, .16));
      const portraitExpand = ease(range(progress, .07, .18));
      const shutterReveal = ease(range(progress, .095, .175));
      const shutterDrift = ease(range(progress, .16, .285));
      const shutterExit = ease(range(progress, .285, .37));
      const filmVisibility = range(progress, .285, .33) * (1 - range(progress, .64, .7));
      const filmPosition = range(progress, .31, .62) * Math.max(0, introFilmFrames.length - 1);
      const foldVisibility = range(progress, .57, .63) * (1 - range(progress, .74, .8));
      const finale = ease(range(progress, .61, .9));
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

      set(introSticky, "--beat-3-opacity", (range(progress, .79, .85) * (1 - range(progress, .955, 1))).toFixed(3));
      set(introSticky, "--beat-3-scale", mix(.72, 1, range(progress, .77, .9)).toFixed(3));
      set(introSticky, "--curtain-radius", `${mix(0, 160, finale)}%`);
      set(introSticky, "--curtain-rotate", `${mix(-18, 0, finale)}deg`);
      set(introSticky, "--curtain-label-opacity", range(progress, .91, .98).toFixed(3));

      const phase = progress < .11 ? 0 : progress < .3 ? 1 : progress < .63 ? 2 : progress < .91 ? 3 : 4;
      introSticky.dataset.phase = String(phase);
      if (introCount) introCount.textContent = String(Math.round(progress * 100)).padStart(2, "0");
    };

    const updateStory = () => {
      if (!storyJourney || !storySticky || !panels.length || reducedMotion.matches || window.innerWidth <= 760) return;
      const rect = storyJourney.getBoundingClientRect();
      const travel = Math.max(1, storyJourney.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel);
      const position = progress * (panels.length - 1);
      const active = Math.min(panels.length - 1, Math.round(position));
      set(storySticky, "--story-progress", progress.toFixed(4));
      storySticky.dataset.activeChapter = String(active);

      const routePoints = [[7, 61], [30, 41], [52, 59], [75, 40], [93, 35]];
      const routeIndex = Math.min(routePoints.length - 2, Math.floor(position));
      const routeAmount = Math.min(1, position - routeIndex);
      const routeFrom = routePoints[routeIndex];
      const routeTo = routePoints[routeIndex + 1];
      const planeX = mix(routeFrom[0], routeTo[0], routeAmount);
      const planeY = mix(routeFrom[1], routeTo[1], routeAmount) - Math.sin(routeAmount * Math.PI) * 13;
      const planeAngle = Math.atan2((routeTo[1] - routeFrom[1]) * .58, routeTo[0] - routeFrom[0]) * 180 / Math.PI;
      const landingPulse = 1 - Math.min(1, Math.min(routeAmount, 1 - routeAmount) * 8);
      set(storySticky, "--travel-plane-x", `${planeX}%`);
      set(storySticky, "--travel-plane-y", `${planeY}%`);
      set(storySticky, "--travel-plane-rotate", `${planeAngle}deg`);
      set(storySticky, "--travel-plane-scale", (1 + landingPulse * .22).toFixed(3));
      travelStops.forEach((stop, index) => {
        stop.classList.toggle("is-passed", index <= active);
        stop.classList.toggle("is-current", index === active);
      });

      panels.forEach((panel, index) => {
        const delta = index - position;
        const absoluteDelta = Math.abs(delta);
        const distance = Math.min(1, absoluteDelta);
        const direction = delta < 0 ? -1 : 1;
        const visible = absoluteDelta <= 1.05 ? 1 : 0;
        set(panel, "--scene-x", "0vw");
        set(panel, "--scene-y", `${Math.sin(distance * Math.PI) * direction * 1.2}vh`);
        set(panel, "--scene-rotate-y", `${delta * -11}deg`);
        set(panel, "--scene-rotate-z", `${delta * .9}deg`);
        set(panel, "--scene-scale", (1 - distance * .03).toFixed(3));
        set(panel, "--scene-opacity", String(visible));
        set(panel, "--scene-clip-left", `${delta > 0 ? Math.min(100, delta * 100) : 0}%`);
        set(panel, "--scene-clip-right", `${delta < 0 ? Math.min(100, -delta * 100) : 0}%`);
        set(panel, "--panel-copy-x", `${delta * 60}px`);
        set(panel, "--panel-copy-y", `${distance * 24}px`);
        set(panel, "--panel-copy-opacity", (1 - distance * .72).toFixed(3));
        set(panel, "--travel-ticket-rotate", `${delta * -2.2}deg`);
        set(panel, "--panel-image-x", `${delta * -6}vw`);
        set(panel, "--panel-image-y", `${Math.sin((position - index) * Math.PI) * 7}vh`);
        set(panel, "--panel-image-rotate", `${direction * distance * 8}deg`);
        set(panel, "--panel-image-scale", (1 - distance * .14).toFixed(3));
        set(panel, "--panel-photo-scale", (1.05 + distance * .22).toFixed(3));
        set(panel, "--panel-clip", `${distance * 15}%`);
        set(panel, "--panel-radius", `${distance * 64}px`);
        set(panel, "--panel-blur", `${distance * 3}px`);
        set(panel, "--panel-glint-x", `${mix(-140, 140, 1 - distance)}%`);
        set(panel, "--panel-word-x", `${delta * -20}vw`);
        set(panel, "--panel-number-x", `${delta * 15}vw`);
        set(panel, "--panel-light-x", `${68 - delta * 20}%`);
        set(panel, "--title-mask", `${distance * 62}%`);
        set(panel, "--title-x", `${delta * 2}vw`);
        set(panel, "--travel-stamp-opacity", (1 - distance).toFixed(3));
        set(panel, "--travel-stamp-scale", (1 + distance * 1.8).toFixed(3));
        set(panel, "--travel-stamp-rotate", `${-12 + delta * 28}deg`);
        panel.style.zIndex = String(10 + index);
        panel.classList.toggle("is-current", index === active);
      });

      const transitionAmount = Math.sin((position % 1) * Math.PI);
      set(storySticky, "--transition-mark-opacity", transitionAmount.toFixed(3));
      set(storySticky, "--transition-mark-x", `${50 + Math.sin(position * Math.PI) * 28}%`);
      set(storySticky, "--transition-mark-y", `${50 + Math.cos(position * Math.PI) * 18}%`);
      set(storySticky, "--transition-mark-rotate", `${position * 225}deg`);
      set(storySticky, "--transition-mark-scale", (0.4 + transitionAmount * 1.2).toFixed(3));
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
      updateStory();
      updateCapabilities();

      if (!reducedMotion.matches && storyIntro) {
        const rect = storyIntro.getBoundingClientRect();
        const progress = clamp(1 - rect.bottom / (window.innerHeight + rect.height));
        set(storyIntro, "--intro-x", `${progress * -7}vw`);
        set(storyIntro, "--intro-scale", (1 + progress * .08).toFixed(3));
      }

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
