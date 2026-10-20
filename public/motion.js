(() => {
  const init = () => {
    if (window.__portfolioMotionReady) return;
    window.__portfolioMotionReady = true;

    const root = document.documentElement;
    const introJourney = document.querySelector("[data-intro-journey]");
    const introSticky = introJourney?.querySelector(".intro-sticky");
    const introCount = introJourney?.querySelector(".intro-meter-count");
    const devStage = introJourney?.querySelector(".dev-stage");
    const devPart = (selector) => Array.from(devStage?.querySelectorAll(selector) || []);
    const devStepItems = devPart("[data-dev-step]");
    const devCaptionItems = devPart(".dev-captions p");
    const devLines = devPart("[data-dev-line]");
    const devBuild = devPart("[data-dev-build]");
    const devTerm = devPart("[data-dev-term]");
    const storyJourney = document.querySelector("[data-story-journey]");
    const storySticky = storyJourney?.querySelector(".story-sticky");
    const atlasStops = storySticky?.querySelectorAll(".atlas-point").length || 0;
    const capabilityJourney = document.querySelector("[data-capability-journey]");
    const capabilitySticky = capabilityJourney?.querySelector(".capability-sticky");
    const capabilityCards = Array.from(document.querySelectorAll("[data-capability-card]"));
    const capabilityCount = capabilityJourney?.querySelector(".capability-count");
    const capabilityMeterLabel = capabilityJourney?.querySelector(".capability-meter > span:first-child");
    const registryRows = Array.from(capabilityJourney?.querySelectorAll("[data-registry-row]") || []);
    const outroJourney = document.querySelector("[data-outro-journey]");
    const outroSticky = outroJourney?.querySelector(".outro-sticky");
    const scrambleTargets = Array.from(outroJourney?.querySelectorAll("[data-scramble]") || []);
    // Scene sequences (experiences, student jobs): each pinned journey plays its scenes in turn.
    const sceneJourneys = Array.from(document.querySelectorAll("[data-xp-journey]")).map((journey) => {
      const scenes = Array.from(journey.querySelectorAll("[data-xp-scene]"));
      const weights = scenes.map((scene) => Number(scene.dataset.weight || 1));
      return {
        journey, scenes, weights,
        sticky: journey.querySelector(".xp-sticky"),
        starts: weights.map((_, index) => weights.slice(0, index).reduce((sum, weight) => sum + weight, 0)),
        units: weights.reduce((sum, weight) => sum + weight, 0),
        counters: scenes.map((scene) => Array.from(scene.querySelectorAll("[data-count]"))),
        hudStep: journey.querySelector(".xp-hud-step"),
        hudCompanies: Array.from(journey.querySelectorAll("[data-hud-company]")),
        active: -1,
      };
    });
    const passionJourney = document.querySelector("[data-passion-journey]");
    const passionSticky = passionJourney?.querySelector(".passion-sticky");
    const passionPanels = Array.from(passionJourney?.querySelectorAll("[data-passion]") || []);
    const chapterRail = document.querySelector(".chapter-rail");
    const chapterLinks = Array.from(chapterRail?.querySelectorAll("[data-chapter-link]") || []);
    const chapterSections = chapterLinks.map((link) => document.getElementById(link.dataset.chapterLink));
    const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
    const sectionScenes = Array.from(document.querySelectorAll("[data-section-motion]"));
    const pageProgress = document.querySelector(".page-progress");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const carouselStart = .18;
    const carouselEnd = .78;
    let projectNavigationFrame = 0;
    let openingProject = null;
    let frame = 0;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const range = (value, start, end) => clamp((value - start) / (end - start));
    const ease = (value) => value * value * (3 - 2 * value);
    const mix = (from, to, amount) => from + (to - from) * amount;
    // Every custom property written invalidates the styles beneath it, so unchanged values are never rewritten.
    const written = new WeakMap();
    const set = (element, property, value) => {
      if (!element) return;
      const text = String(value);
      let properties = written.get(element);
      if (!properties) written.set(element, properties = new Map());
      if (properties.get(property) === text) return;
      properties.set(property, text);
      element.style.setProperty(property, text);
    };

    // The scroll loop never reads layout: interleaving reads with style writes forced the browser to
    // lay out the page several times per frame. Positions are measured once, then again on resize.
    const boxes = new Map();
    let viewportHeight = window.innerHeight;
    let maxScroll = 1;
    let forceUpdate = true;
    const journeys = [introJourney, ...sceneJourneys.map(({ journey }) => journey), passionJourney, capabilityJourney, storyJourney, outroJourney];
    const measure = () => {
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(1, root.scrollHeight - viewportHeight);
      new Set([...journeys, ...chapterSections, ...sectionScenes.map((scene) => scene.parentElement)]).forEach((element) => {
        if (!element) return;
        boxes.set(element, { top: element.getBoundingClientRect().top + window.scrollY, height: element.offsetHeight });
      });
      forceUpdate = true;
    };
    // Progress through a pinned journey; `screens` is how many viewports at its end sit outside the animation.
    const journeyProgress = (element, screens = 1) => {
      const box = boxes.get(element);
      return clamp((window.scrollY - box.top) / Math.max(1, box.height - viewportHeight * screens));
    };
    // A scene renders only when its progress moved and it is near the screen: scenes resting or
    // passed over off screen cost nothing, and catch up in the frame they come back into view.
    const rendered = new Map();
    const nearViewport = (box) => box.top < window.scrollY + viewportHeight * 1.5 && box.top + box.height > window.scrollY - viewportHeight * .5;
    const moved = (scene, progress, box = boxes.get(scene)) => {
      if (box && !nearViewport(box)) return false;
      if (!forceUpdate && rendered.get(scene) === progress) return false;
      rendered.set(scene, progress);
      return true;
    };
    // Phones play the same scroll story; only the geometry is recomposed for a portrait screen.
    const isCompact = () => window.innerWidth <= 760;

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

    // Reveals a sequence one item after another across a 0–1 progress.
    const stagger = (items, progress, property) => items.forEach((item, index) => {
      set(item, property, clamp(progress * items.length - index).toFixed(3));
    });

    const updateIntro = () => {
      if (!introJourney || !introSticky || reducedMotion.matches) return;
      const compact = isCompact();
      // Keep one viewport at the end of the intro as a completed, static frame.
      // The next chapter uses that runway to rise over the intro instead of interrupting it.
      const openingProgress = journeyProgress(introJourney, 2);
      if (!moved(introJourney, openingProgress)) return;
      const progress = clamp(openingProgress / .895);
      const heroDepart = ease(range(progress, .045, .14));

      set(introSticky, "--intro-progress", progress.toFixed(4));
      // The pipeline meter waits for the hero to leave: it shares the bottom edge with the scroll invitation.
      set(introSticky, "--intro-meter-opacity", (range(progress, .06, .12) * .75).toFixed(3));
      set(introSticky, "--hero-meta-opacity", (1 - range(progress, .03, .09)).toFixed(3));
      set(introSticky, "--hero-meta-y", `${mix(0, -30, heroDepart)}px`);
      set(introSticky, "--hero-title-x", `${mix(0, -18, heroDepart)}vw`);
      set(introSticky, "--hero-title-y", `${mix(0, -6, heroDepart)}vh`);
      set(introSticky, "--hero-title-scale", mix(1, .82, heroDepart).toFixed(4));
      set(introSticky, "--hero-title-rotate", "0deg");
      set(introSticky, "--hero-title-opacity", (1 - range(progress, .05, .12)).toFixed(3));
      set(introSticky, "--hero-first-x", "0vw");
      set(introSticky, "--hero-second-x", "0vw");
      set(introSticky, "--hero-bottom-opacity", (1 - range(progress, .03, .09)).toFixed(3));
      set(introSticky, "--hero-bottom-y", `${mix(0, 40, heroDepart)}px`);
      set(introSticky, "--scroll-invite-opacity", (1 - range(progress, 0, .06)).toFixed(3));
      set(introSticky, "--scroll-invite-y", `${mix(0, 30, heroDepart)}px`);

      // The portrait slides away as the workspace opens; [left, top, width, height] in % of the hero.
      const portrait = compact ? [6, 33, 88, 39] : [58, 0, 42, 100];
      const portraitExit = ease(range(progress, .06, .15));
      set(introSticky, "--portrait-left", `${mix(portrait[0], portrait[0] + 8, portraitExit)}%`);
      set(introSticky, "--portrait-top", `${mix(portrait[1], portrait[1] - 4, portraitExit)}%`);
      set(introSticky, "--portrait-width", `${portrait[2]}%`);
      set(introSticky, "--portrait-height", `${portrait[3]}%`);
      set(introSticky, "--portrait-rotate", `${mix(0, 3, portraitExit)}deg`);
      set(introSticky, "--portrait-image-scale", mix(1.09, 1.18, portraitExit).toFixed(4));
      set(introSticky, "--portrait-caption-opacity", (1 - range(progress, .05, .1)).toFixed(3));
      set(introSticky, "--portrait-opacity", (1 - portraitExit).toFixed(3));

      // 01 Concevoir — the editor opens and the idea is typed out.
      const editorIn = ease(range(progress, .1, .18));
      const typing = range(progress, .17, .35);
      // 02 Développer — the editor steps aside and the preview builds the interface it describes.
      const split = ease(range(progress, .36, .44));
      const build = range(progress, .42, .56);
      // Then the terminal checks the stack, and the scene clears for what comes next.
      const workExit = ease(range(progress, .56, .63));
      const termIn = ease(range(progress, .58, .64));
      const term = range(progress, .62, .76);
      const step = progress < .36 ? 0 : 1;

      set(introSticky, "--dev-stage-opacity", range(progress, .07, .13).toFixed(3));
      set(introSticky, "--dev-steps-fill", range(progress, .12, .82).toFixed(4));
      set(introSticky, "--dev-editor-in", editorIn.toFixed(3));
      set(introSticky, "--dev-split", split.toFixed(3));
      set(introSticky, "--dev-preview-in", ease(range(progress, .38, .46)).toFixed(3));
      set(introSticky, "--dev-work-exit", workExit.toFixed(3));
      set(introSticky, "--dev-term-in", (termIn * (1 - ease(range(progress, .84, .9)))).toFixed(3));
      devStepItems.forEach((item, index) => {
        item.classList.toggle("is-active", index === step && progress < .82);
        item.classList.toggle("is-done", index < step || progress >= .82);
      });
      const captionWindows = [[.12, .34], [.38, .8], [.84, 1.1]];
      devCaptionItems.forEach((caption, index) => {
        const [from, to] = captionWindows[index];
        set(caption, "--caption", (range(progress, from, from + .04) * (1 - range(progress, to, to + .04))).toFixed(3));
      });
      stagger(devLines, typing, "--type");
      const typingLine = typing > 0 && typing < 1 ? Math.floor(typing * devLines.length) : -1;
      devLines.forEach((line, index) => line.classList.toggle("is-typing", index === typingLine));
      stagger(devBuild, build, "--build");
      stagger(devTerm, term, "--line");

      const phase = progress < .1 ? 0 : progress < .36 ? 1 : progress < .58 ? 2 : progress < .82 ? 3 : 4;
      introSticky.dataset.phase = String(phase);
      if (introCount) introCount.textContent = String(Math.round(progress * 100)).padStart(2, "0");
    };

    const updateStory = () => {
      if (!storyJourney || !storySticky || reducedMotion.matches) return;
      const progress = journeyProgress(storyJourney);
      if (!moved(storyJourney, progress)) return;
      // The atlas draws its data network as it settles: one link, then the next, until every city answers.
      const network = ease(range(progress, .04, .5));
      set(storySticky, "--atlas-link", network.toFixed(4));
      set(storySticky, "--atlas-count", String(1 + Math.round(network * Math.max(0, atlasStops - 1))));
      set(storySticky, "--studies-heading", (1 - ease(range(progress, .3, .5))).toFixed(3));
    };

    const updateCapabilities = () => {
      if (!capabilityJourney || !capabilitySticky || !capabilityCards.length) return;
      if (reducedMotion.matches) {
        capabilityCards.forEach((card) => { card.inert = false; card.removeAttribute("aria-hidden"); });
        return;
      }
      const progress = journeyProgress(capabilityJourney);
      if (!moved(capabilityJourney, progress)) return;
      const unfold = ease(range(progress, .06, .18));
      const carouselProgress = range(progress, carouselStart, carouselEnd);
      const carouselPosition = carouselProgress * (capabilityCards.length - 1);
      const exit = ease(range(progress, .78, .9));
      const finale = ease(range(progress, .84, .99));
      const active = Math.min(capabilityCards.length - 1, Math.round(carouselPosition));
      // `ls ~/projets` lists the work first; each row then compiles into its card.
      const appear = ease(range(progress, .05, .12));
      // The listing is already printed when the chapter arrives, then compiles into the cards.
      stagger(registryRows, range(progress, -.06, 0), "--row");
      set(capabilitySticky, "--registry-out", ease(range(progress, .06, .13)).toFixed(3));

      set(capabilitySticky, "--cap-progress", progress.toFixed(4));
      // On a phone the hint shares the screen with the deck, so it clears before the cards unfold over it.
      const headingFade = isCompact() ? range(progress, .07, .14) : range(progress, .12, .25);
      set(capabilitySticky, "--cap-heading-opacity", (1 - headingFade).toFixed(3));
      set(capabilitySticky, "--cap-grid-x", `${mix(0, -7, progress)}vw`);
      set(capabilitySticky, "--cap-grid-y", `${mix(0, 9, progress)}vh`);
      set(capabilitySticky, "--cap-grid-scale", mix(1.15, .78, unfold).toFixed(3));
      set(capabilitySticky, "--cap-title-x", "0vw");
      set(capabilitySticky, "--cap-title-y", "0vh");
      set(capabilitySticky, "--cap-title-scale", mix(1, .43, unfold).toFixed(3));
      // On a phone the first card unfolds over the title, so the title clears sooner.
      set(capabilitySticky, "--cap-title-opacity", (1 - (isCompact() ? range(progress, .05, .1) : range(progress, .18, .28))).toFixed(3));

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
        const distanceOpacity = clamp(1 - Math.max(0, distance - 1.08) * 1.8) * appear;
        const focus = 1 - Math.min(1, distance);

        set(card, "--cap-card-x", `${mix(0, targetX, unfold) + direction * exit * 20}vw`);
        set(card, "--cap-card-y", `${mix(index * 1.2, targetY, unfold) + (index % 2 ? -1 : 1) * exit * 18}vh`);
        set(card, "--cap-card-z", `${mix(index * -36, targetZ, unfold) - exit * 240}px`);
        set(card, "--cap-card-rotate", `${mix(startRotations[index], targetRotateZ, unfold) + direction * exit * 8}deg`);
        set(card, "--cap-card-rotate-y", `${mix(0, targetRotateY, unfold)}deg`);
        set(card, "--cap-card-scale", (mix(.68, targetScale, unfold) * mix(1, .7, exit)).toFixed(3));
        const cardOpacity = mix(appear, distanceOpacity, unfold) * (1 - exit);
        set(card, "--cap-card-opacity", cardOpacity.toFixed(3));
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
        // The card's source code dissolves as it comes into focus, revealing the finished project.
        set(card, "--focus", (focus * unfold).toFixed(3));
        set(card, "--project-action-opacity", (focus > .62 && unfold > .7 && exit < .2 ? 1 : 0).toFixed(3));
        card.style.zIndex = String(20 - Math.round(distance * 8));
        card.classList.toggle("is-current", index === active);
        // Match the opacity rounded for rendering: even a faint visible card is a link.
        const hidden = Number(cardOpacity.toFixed(3)) === 0;
        if (card.inert !== hidden) {
          card.inert = hidden;
          card.setAttribute("aria-hidden", String(hidden));
        }
      });

      set(capabilitySticky, "--cap-finale-radius", `${mix(0, 145, finale)}%`);
      set(capabilitySticky, "--cap-finale-copy-opacity", range(progress, .82, .94).toFixed(3));
      set(capabilitySticky, "--cap-finale-title-scale", mix(.78, 1, range(progress, .8, .96)).toFixed(3));
      set(capabilitySticky, "--cap-finale-arrow-opacity", range(progress, .9, .98).toFixed(3));
      set(capabilitySticky, "--cap-finale-arrow-y", `${mix(-30, 0, range(progress, .9, .98))}px`);
      capabilitySticky.dataset.phase = progress > .9 ? "final" : "cards";
      capabilitySticky.dataset.activeProject = String(active);
      if (capabilityCount) capabilityCount.textContent = `${String(active + 1).padStart(2, "0")} / ${String(capabilityCards.length).padStart(2, "0")}`;
      if (capabilityMeterLabel) capabilityMeterLabel.textContent = progress > .9 ? "Direction mes études" : progress < .18 ? "Déplier les projets" : "Cliquer pour ouvrir le projet";
    };

    // Experiences play as a sequence of scenes. Each scene gets three values: --enter (its transition
    // over the previous one), --inner (its own story) and --leave (as the next scene covers it).
    const updateSceneJourney = (sequence) => {
      const { journey, sticky, scenes, weights, starts, units, counters, hudStep } = sequence;
      if (!sticky || !scenes.length || reducedMotion.matches) return;
      // The last screen stays still: the next chapter rises over it.
      const progress = journeyProgress(journey, 2);
      if (!moved(journey, progress)) return;
      const unit = progress * units;
      let active = 0;
      scenes.forEach((scene, index) => {
        const start = starts[index];
        const end = start + weights[index];
        const enter = index === 0 ? 1 : ease(range(unit, start - .35, start + .05));
        const leave = index === scenes.length - 1 ? 0 : ease(range(unit, end - .35, end + .05));
        const on = enter > 0 && leave < 1;
        if (scene.classList.contains("is-on") !== on) scene.classList.toggle("is-on", on);
        if (enter >= .5) active = index;
        if (!on) return;
        const inner = range(unit, start + .05, end - .3);
        set(scene, "--enter", enter.toFixed(4));
        set(scene, "--inner", inner.toFixed(4));
        set(scene, "--leave", leave.toFixed(4));
        counters[index].forEach((counter) => {
          const text = `${Math.round(Number(counter.dataset.count) * ease(clamp(inner * 3)))}${counter.dataset.suffix || ""}`;
          if (counter.textContent !== text) counter.textContent = text;
        });
        if (scene.hasAttribute("data-otp")) {
          // Ten codes: each rests while its ring empties, then the reel slides to the next one.
          const position = clamp((inner - .5) / .5) * 9.999;
          const step = Math.floor(position);
          set(scene, "--otp-reel", (step + ease(clamp((position - step - .78) / .22))).toFixed(4));
          set(scene, "--otp-ring", (position - step).toFixed(4));
        }
      });
      set(sticky, "--xp-progress", progress.toFixed(4));
      if (active !== sequence.active) {
        sequence.active = active;
        if (hudStep) hudStep.textContent = scenes[active].dataset.label || "";
        // The HUD lights the company the visitor is in, so each experience reads as its own chapter.
        const company = scenes[active].dataset.company;
        sequence.hudCompanies.forEach((item) => item.classList.toggle("is-current", item.dataset.hudCompany === company));
      }
    };

    // Each passion opens like a lens iris over the previous one, then plays its own scene.
    const updatePassions = () => {
      if (!passionJourney || !passionSticky || !passionPanels.length || reducedMotion.matches) return;
      // The last screen stays still: the project gallery rises over it.
      const progress = journeyProgress(passionJourney, 2);
      if (!moved(passionJourney, progress)) return;
      const timeline = range(progress, .03, .97) * passionPanels.length;
      set(passionSticky, "--passion-intro", ease(range(timeline, .1, .45)).toFixed(3));
      passionPanels.forEach((panel, index) => {
        const inner = clamp((timeline - index - .35) / .6);
        set(panel, "--enter", ease(clamp((timeline - index - .1) / .4)).toFixed(4));
        set(panel, "--inner", inner.toFixed(4));
        // The shutter fires once, as the photograph finishes developing.
        set(panel, "--flash", Math.max(0, 1 - Math.abs(inner - .55) * 14).toFixed(3));
      });
    };

    // Scroll-driven decoding: resolved characters lead, the rest flicker through code glyphs.
    const scrambleGlyphs = "<>/{}[]=+*#01abcdefxyz";
    const scrambleText = (decode, tick) => {
      const total = scrambleTargets.reduce((sum, element) => sum + element.dataset.scramble.length, 0);
      let offset = 0;
      scrambleTargets.forEach((element) => {
        const text = element.dataset.scramble;
        const shown = Math.floor(clamp(decode * total - offset, 0, text.length));
        offset += text.length;
        const output = Array.from(text, (char, index) => (index < shown || char === " " ? char : scrambleGlyphs[(index * 7 + tick) % scrambleGlyphs.length])).join("");
        if (element.textContent !== output) element.textContent = output;
      });
    };

    const updateOutro = () => {
      if (!outroJourney || !outroSticky || reducedMotion.matches) return;
      const progress = journeyProgress(outroJourney);
      if (!moved(outroJourney, progress)) return;
      // The frame, prompt and (still scrambled) headline rise with the panel, so it never arrives empty.
      set(outroSticky, "--outro-wave", range(progress, 0, .7).toFixed(4));
      set(outroSticky, "--outro-window", "1");
      set(outroSticky, "--outro-prompt", range(progress, 0, .16).toFixed(3));
      set(outroSticky, "--outro-title", "1");
      set(outroSticky, "--outro-copy", ease(range(progress, .42, .54)).toFixed(3));
      set(outroSticky, "--outro-cta", ease(range(progress, .5, .62)).toFixed(3));
      // Mostly resolved already as the panel arrives; the last characters settle as the visitor scrolls.
      scrambleText(range(progress, -.3, .1), Math.floor(window.scrollY / 9));
    };

    let currentChapter = -1;
    let announceTimer = 0;
    const updateChapters = () => {
      if (!chapterRail) return;
      chapterRail.classList.toggle("is-visible", window.scrollY > viewportHeight * .6);
      const line = window.scrollY + viewportHeight * .5;
      const current = chapterSections.reduce((found, section, index) => (section && boxes.get(section).top <= line ? index : found), 0);
      chapterLinks.forEach((link, index) => link.classList.toggle("is-current", index === current));
      // The chapter name shows for a moment when it changes, then folds away so it never covers a scene.
      if (current !== currentChapter) {
        currentChapter = current;
        chapterRail.classList.add("is-announcing");
        window.clearTimeout(announceTimer);
        announceTimer = window.setTimeout(() => chapterRail.classList.remove("is-announcing"), 1800);
      }
    };

    const update = () => {
      frame = 0;
      // Written on the bar itself: on <html> it restyled the whole document every frame.
      set(pageProgress, "--page-progress", Math.min(1, window.scrollY / maxScroll).toFixed(4));
      updateIntro();
      sceneJourneys.forEach(updateSceneJourney);
      updatePassions();
      updateStory();
      updateCapabilities();
      updateOutro();
      updateChapters();
      if (!reducedMotion.matches) sectionScenes.forEach((scene) => {
        const box = boxes.get(scene.parentElement);
        const progress = clamp((window.scrollY + viewportHeight - box.top) / (viewportHeight + box.height));
        if (!moved(scene, progress, box)) return;
        set(scene, "--scene-progress", progress.toFixed(4));
        set(scene, "--scene-drift", `${(progress - .5) * 70}px`);
      });
      forceUpdate = false;
    };

    const cancelProjectNavigation = () => {
      window.cancelAnimationFrame(projectNavigationFrame);
      projectNavigationFrame = 0;
      openingProject?.classList.remove("is-opening");
      openingProject = null;
      root.classList.remove("project-navigating");
    };

    capabilityCards.forEach((card, index) => {
      card.addEventListener("click", (event) => {
        // Keep native links for reduced motion and opening new tabs.
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!capabilityJourney || reducedMotion.matches) return;
        event.preventDefault();
        cancelProjectNavigation();
        openingProject = card;
        card.classList.add("is-opening");
        root.classList.add("project-navigating");

        const startY = window.scrollY;
        const journeyTop = boxes.get(capabilityJourney).top;
        const travel = Math.max(1, boxes.get(capabilityJourney).height - viewportHeight);
        const position = index / Math.max(1, capabilityCards.length - 1);
        const targetY = clamp(journeyTop + travel * mix(carouselStart, carouselEnd, position), 0, maxScroll);
        // A card already in focus opens almost at once; a distant one travels longer.
        const cardSteps = Math.abs(targetY - startY) / Math.max(1, travel * (carouselEnd - carouselStart) / Math.max(1, capabilityCards.length - 1));
        const duration = Math.abs(targetY - startY) < 2 ? 0 : Math.round(mix(220, 900, clamp(cardSteps / 3)));
        const startedAt = performance.now();
        const animate = (now) => {
          const elapsed = now - startedAt;
          const progress = duration === 0 ? 1 : clamp(elapsed / duration);
          // html.project-navigating disables smooth scrolling, so each frame lands exactly.
          window.scrollTo(0, mix(startY, targetY, ease(progress)));
          update();
          // Let the centered card paint before leaving the gallery.
          if (elapsed >= duration + 120) {
            window.location.assign(card.href);
            return;
          }
          projectNavigationFrame = window.requestAnimationFrame(animate);
        };
        projectNavigationFrame = window.requestAnimationFrame(animate);
      });
    });

    // Wheel events are deliberately ignored: trackpad momentum keeps firing them after
    // the click, which would silently cancel the navigation the visitor just asked for.
    window.addEventListener("keydown", (event) => {
      if (["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key)) cancelProjectNavigation();
    });
    window.addEventListener("pagehide", cancelProjectNavigation);
    window.addEventListener("pageshow", cancelProjectNavigation);
    // Phone toolbars resize the viewport's height while scrolling; only a new width is a real layout change.
    let viewportWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      if (window.innerWidth === viewportWidth) return;
      viewportWidth = window.innerWidth;
      cancelProjectNavigation();
    });

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      requestUpdate();
    };

    // A long in-page jump (back to top, chapter rail, header links) teleports to one screen short of
    // its target and glides the rest: smooth-scrolling through every pinned scene replayed them all.
    const jumpTo = (top) => {
      const distance = top - window.scrollY;
      const glide = Math.min(Math.abs(distance), viewportHeight * .9);
      if (Math.abs(distance) > glide) {
        root.classList.add("project-navigating");
        window.scrollTo(0, top - Math.sign(distance) * glide);
        root.classList.remove("project-navigating");
      }
      window.scrollTo({ top, behavior: reducedMotion.matches ? "auto" : "smooth" });
    };
    document.addEventListener("click", (event) => {
      const link = event.target?.closest?.("a[href^='#']");
      if (!link || link.classList.contains("skip-link") || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = decodeURIComponent(link.getAttribute("href").slice(1));
      const target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      cancelProjectNavigation();
      const top = target.getBoundingClientRect().top + window.scrollY;
      const settle = Number(target.dataset?.jumpProgress || 0) * Math.max(0, (target.offsetHeight || 0) - viewportHeight);
      jumpTo(clamp(top + settle, 0, maxScroll));
      window.history.pushState(null, "", `#${id}`);
    });

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", remeasure);
    // Late images and fonts can change the page height; positions follow it.
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(remeasure).observe(document.body);
    window.addEventListener("pageshow", requestUpdate);
    reducedMotion.addEventListener?.("change", () => window.location.reload());
    measure();
    update();
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      // The browser resolved the #hash before the scroll scenes grew to full height.
      const anchor = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (anchor && !reducedMotion.matches) {
        root.classList.add("project-navigating");
        window.scrollTo(0, window.scrollY + anchor.getBoundingClientRect().top);
        root.classList.remove("project-navigating");
      }
      measure();
      update();
    }));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
