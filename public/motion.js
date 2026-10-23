(() => {
  const init = () => {
    if (window.__portfolioMotionReady) return;
    window.__portfolioMotionReady = true;

    const root = document.documentElement;
    const storyJourney = document.querySelector("[data-story-journey]");
    const storySticky = storyJourney?.querySelector(".story-sticky");
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
    const journeys = [...sceneJourneys.map(({ journey }) => journey), capabilityJourney, storyJourney, outroJourney];
    const measure = () => {
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(1, root.scrollHeight - viewportHeight);
      new Set([...journeys, ...chapterSections, ...sectionScenes.map((scene) => scene.parentElement)]).forEach((element) => {
        if (!element) return;
        boxes.set(element, { top: element.getBoundingClientRect().top + window.scrollY, height: element.offsetHeight });
      });
      forceUpdate = true;
      collectRests();
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

    // The atlas tells its journey itself (TravelMap): it only needs to know how far the scroll is.
    // Its last screen stays still while the closing chapter rises over it.
    const updateStory = () => {
      if (!storyJourney || !storySticky || reducedMotion.matches) return;
      const progress = journeyProgress(storyJourney, 2);
      if (!moved(storyJourney, progress)) return;
      set(storySticky, "--studies-heading", (1 - ease(range(progress, .03, .09))).toFixed(3));
      storyJourney.dispatchEvent(new CustomEvent("atlas-progress", { detail: progress }));
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
        const inner = range(unit, start + .05, end - .35);
        set(scene, "--enter", enter.toFixed(4));
        set(scene, "--inner", inner.toFixed(4));
        set(scene, "--leave", leave.toFixed(4));
        counters[index].forEach((counter) => {
          const text = `${Math.round(Number(counter.dataset.count) * ease(clamp(inner * 3)))}${counter.dataset.suffix || ""}`;
          if (counter.textContent !== text) counter.textContent = text;
        });
        if (scene.hasAttribute("data-otp")) {
          // Ten codes: each rests while its ring empties, then the reel slides to the next one.
          // It rests on the tenth code once the scene is over, never past the end of the reel.
          const position = clamp((inner - .5) / .5) * 9;
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

    // ── Sound: a scene with data-sound plays it while it is the current scene. Browsers only allow
    // sound after the visitor has interacted once (a tap, click or key), so the first interaction
    // anywhere on the page unlocks it; until then each player shows an "Activer le son" chip.
    // Two sources: an <audio> element for the artists' previews, and the official SoundCloud player
    // for Mathis's own tracks (data-sound="sc:<soundcloud url>"), driven through its Widget API.
    const soundSequences = sceneJourneys.filter(({ scenes }) => scenes.some((scene) => scene.dataset.sound));
    const audio = typeof Audio !== "undefined" && soundSequences.length ? new Audio() : null;
    const isSoundCloud = (src) => typeof src === "string" && src.startsWith("sc:");
    let soundUnlocked = false;
    let unlockedAt = -1e9;
    let soundPaused = false;
    let wanted = null;
    let fadeFrame = 0;
    const fadeTo = (target, done) => {
      if (!audio) return;
      window.cancelAnimationFrame(fadeFrame);
      const from = audio.volume;
      const startedAt = performance.now();
      const step = (now) => {
        const t = clamp((now - startedAt) / 450);
        audio.volume = mix(from, target, t);
        if (t < 1) fadeFrame = window.requestAnimationFrame(step);
        else done?.();
      };
      fadeFrame = window.requestAnimationFrame(step);
    };

    // The SoundCloud player lives in an iframe inside the studio deck, created once the page has loaded.
    // The deck shows what really happens (data-state): a track only counts as playing once its
    // position moves. Safari and phones refuse to start a cross-site player from the page; when
    // nothing moves after a few seconds the deck opens the official player so one click on it plays,
    // and when SoundCloud never answers it says so instead of staying silent.
    const soundCloud = { widget: null, ready: false, failed: false, url: "", pending: null, playing: false, heard: false, everHeard: false, watchdog: 0 };
    const scDeck = document.querySelector?.("[data-sc-deck]") || null;
    const setScState = (state) => { if (scDeck && scDeck.dataset.state !== state) scDeck.dataset.state = state; };
    const firstSoundCloud = soundSequences.flatMap(({ scenes }) => scenes).map((scene) => scene.dataset.sound).find(isSoundCloud);
    const watchSoundCloud = () => {
      window.clearTimeout(soundCloud.watchdog);
      soundCloud.watchdog = window.setTimeout(() => {
        if (!soundCloud.playing || soundCloud.heard) return;
        const offline = typeof navigator !== "undefined" && navigator.onLine === false;
        setScState(!soundCloud.ready || soundCloud.failed || offline ? "error" : "blocked");
      }, soundCloud.ready ? 5000 : 9000);
    };
    const setupSoundCloud = () => {
      if (!firstSoundCloud || soundCloud.widget || soundCloud.frame || typeof document.createElement !== "function") return;
      const frame = document.createElement("iframe");
      frame.className = "sc-player";
      frame.title = "Lecteur SoundCloud";
      frame.allow = "autoplay; encrypted-media";
      soundCloud.url = firstSoundCloud.slice(3);
      frame.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundCloud.url)}&auto_play=false&visual=false&show_comments=false&show_user=false&color=%23ff8a00`;
      (document.querySelector("[data-sc-host]") || document.body).append(frame);
      soundCloud.frame = frame;
      const script = document.createElement("script");
      script.src = "https://w.soundcloud.com/player/api.js";
      script.onerror = () => {
        soundCloud.failed = true;
        if (soundCloud.playing || soundCloud.pending) setScState("error");
      };
      script.onload = () => {
        const widget = window.SC.Widget(frame);
        const events = window.SC.Widget.Events;
        soundCloud.widget = widget;
        widget.bind(events.READY, () => {
          soundCloud.ready = true;
          widget.setVolume(85);
          if (soundCloud.pending) { const src = soundCloud.pending; soundCloud.pending = null; playSoundCloud(src); }
        });
        // Started from the official player itself (the click Safari asks for): the page follows.
        widget.bind(events.PLAY, () => {
          // Mathis's tracks only sound on the studio page: anywhere else the player is stopped at once.
          if (!wanted || !isSoundCloud(wanted.src)) { widget.pause(); return; }
          if (soundCloud.playing) return;
          soundCloud.playing = true;
          soundPaused = false;
          renderSound();
        });
        // Progress only counts while the page wants sound: late ticks after a pause are ignored.
        widget.bind(events.PLAY_PROGRESS, (event) => {
          if (!wanted || !isSoundCloud(wanted.src)) { widget.pause(); return; }
          if (!soundCloud.playing || !(event.currentPosition > 0)) return;
          soundCloud.heard = true;
          soundCloud.everHeard = true;
          setScState("playing");
          const progress = Number(event.relativePosition || 0).toFixed(4);
          set(wanted.scene, "--play", progress);
          const button = wanted.scene.querySelector(`[data-play-track="${CSS.escape(wanted.src)}"]`);
          set(button, "--track-play", progress);
          wanted.scene.classList.add("is-sounding");
        });
        // Paused from the official player: the page shows it paused too.
        widget.bind(events.PAUSE, () => {
          if (!soundCloud.playing || !soundCloud.heard) return;
          soundCloud.playing = false;
          soundPaused = true;
          setScState("paused");
          renderSound();
        });
        // A track ends: the next one in the list follows, back to the first after the last.
        widget.bind(events.FINISH, () => {
          if (!wanted || !isSoundCloud(wanted.src)) return;
          const buttons = Array.from(wanted.scene.querySelectorAll("[data-play-track]"));
          const index = buttons.findIndex((button) => button.dataset.playTrack === wanted.src);
          playTrack(buttons[(index + 1) % buttons.length]);
        });
      };
      document.head.append(script);
    };
    const playSoundCloud = (src) => {
      const url = src.slice(3);
      if (soundCloud.failed) { soundCloud.playing = true; setScState("error"); return; }
      if (soundCloud.playing && soundCloud.heard && soundCloud.url === url) return;
      soundCloud.playing = true;
      soundCloud.heard = false;
      setScState("loading");
      watchSoundCloud();
      if (!soundCloud.ready) { soundCloud.pending = src; setupSoundCloud(); return; }
      if (soundCloud.url !== url) {
        soundCloud.url = url;
        soundCloud.widget.load(url, { auto_play: true, visual: false, show_comments: false, show_user: false, color: "#ff8a00", callback: () => {
          // The visitor may have left the studio while the track loaded: then it stays silent.
          if (!soundCloud.playing || !wanted || !isSoundCloud(wanted.src)) { soundCloud.widget.pause(); return; }
          soundCloud.widget.setVolume(85);
          soundCloud.widget.play();
        } });
      } else soundCloud.widget.play();
    };
    const pauseSoundCloud = () => {
      soundCloud.pending = null;
      window.clearTimeout(soundCloud.watchdog);
      const wasPlaying = soundCloud.playing;
      soundCloud.playing = false;
      if (soundCloud.ready && wasPlaying) soundCloud.widget.pause();
      setScState(soundCloud.failed ? "error" : soundCloud.everHeard ? "paused" : "idle");
    };

    // Each scene shows its own player; the page only says whether sound plays or waits to be turned on.
    const renderSound = () => {
      root.classList.toggle("sound-playing", Boolean(wanted) && soundUnlocked && !soundPaused);
      root.classList.toggle("sound-locked", Boolean(wanted) && !soundUnlocked);
      document.querySelectorAll?.("[data-play-track]").forEach((button) => button.classList.toggle("is-current", button.dataset.playTrack === wanted?.src));
      const title = scDeck?.querySelector("[data-now-title]");
      if (title && wanted && isSoundCloud(wanted.src) && title.textContent !== wanted.title) title.textContent = wanted.title;
    };
    const applySound = () => {
      renderSound();
      if (!audio) return;
      if (!wanted || !soundUnlocked || soundPaused || document.hidden) {
        if (!audio.paused) fadeTo(0, () => audio.pause());
        pauseSoundCloud();
        return;
      }
      if (isSoundCloud(wanted.src)) {
        if (!audio.paused) fadeTo(0, () => audio.pause());
        playSoundCloud(wanted.src);
        return;
      }
      pauseSoundCloud();
      if (audio.dataset.src !== wanted.src) {
        audio.dataset.src = wanted.src;
        audio.src = wanted.src;
        audio.loop = true;
        audio.volume = 0;
      }
      const playing = audio.play();
      // Only a refusal locks the sound again; a play cut short by the next song (AbortError) is normal.
      playing?.catch?.((error) => { if (error?.name !== "NotAllowedError") return; soundUnlocked = false; renderSound(); });
      fadeTo(.85);
    };
    const setWanted = (scene) => {
      const next = scene?.dataset.sound ? { src: scene.dataset.sound, title: scene.dataset.soundTitle || "", artist: scene.dataset.soundArtist || "", artwork: scene.dataset.soundArtwork || "", scene } : null;
      // The same song on the next scene (the Big 3 opens on Joji's, his page follows) keeps playing.
      if (next?.src === wanted?.src) {
        if (next && next.scene !== wanted.scene) wanted.scene.classList.remove("is-sounding");
        wanted = next;
        return;
      }
      wanted?.scene.classList.remove("is-sounding");
      wanted = next;
      // A pause only holds for the song it paused: the next scene's song starts on its own.
      if (next) soundPaused = false;
      applySound();
    };
    // Called every frame: the playing scene is the active scene of a sequence the visitor is inside.
    const updateSound = () => {
      if (!audio) return;
      let scene = null;
      soundSequences.forEach((sequence) => {
        const box = boxes.get(sequence.journey);
        const inside = box && window.scrollY >= box.top - viewportHeight * .3 && window.scrollY <= box.top + box.height - viewportHeight * 1.3;
        if (inside && sequence.active >= 0) scene = sequence.scenes[sequence.active];
      });
      if (scene !== wanted?.scene) setWanted(scene);
    };
    const unlock = () => {
      if (soundUnlocked || !audio) return;
      soundUnlocked = true;
      unlockedAt = performance.now();
      // iOS only lets an <audio> element play from code once it has played inside a gesture.
      const preview = soundSequences.flatMap(({ scenes }) => scenes).map((scene) => scene.dataset.sound).find((src) => src && !isSoundCloud(src));
      if (wanted && !soundPaused && !isSoundCloud(wanted.src)) applySound();
      else {
        if (preview) {
          audio.muted = true;
          audio.src = preview;
          audio.play()?.then?.(() => { audio.pause(); audio.muted = false; audio.removeAttribute("src"); audio.dataset.src = ""; }).catch?.(() => { audio.muted = false; });
        }
        if (wanted && !soundPaused) applySound();
      }
      renderSound();
    };
    // One of Mathis's own tracks: it becomes its scene's sound and plays at once.
    const playTrack = (button) => {
      if (!button) return;
      const scene = button.closest("[data-xp-scene]");
      scene.dataset.sound = button.dataset.playTrack;
      scene.dataset.soundTitle = button.dataset.trackTitle || "";
      set(scene, "--play", "0");
      soundPaused = false;
      wanted = null;
      setWanted(scene);
    };
    if (audio) {
      ["pointerdown", "keydown", "touchend"].forEach((name) => window.addEventListener(name, unlock, { capture: true, passive: true }));
      window.setTimeout(setupSoundCloud, 1500);
      document.addEventListener("click", (event) => {
        const toggle = event.target?.closest?.("[data-sound-toggle]");
        const track = event.target?.closest?.("[data-play-track]");
        if (track) {
          // A click on the track really playing pauses it; any other track, or one that is still
          // loading, blocked or failed, (re)starts.
          if (track.dataset.playTrack === wanted?.src && scDeck?.dataset.state === "playing" && performance.now() - unlockedAt > 1500) {
            soundPaused = true;
            applySound();
          } else playTrack(track);
          return;
        }
        if (!toggle) return;
        // The press that unlocked the sound is the same gesture as this click: it means "play",
        // never "pause" — toggling here used to stop the music the instant it started.
        const justUnlocked = !soundUnlocked || performance.now() - unlockedAt < 1500;
        if (!soundUnlocked) unlock();
        // The studio deck toggles on what it really does: a blocked or failed track is retried, not paused.
        const isPlaying = wanted && isSoundCloud(wanted.src) ? scDeck?.dataset.state === "playing" : !soundPaused;
        soundPaused = justUnlocked ? false : isPlaying;
        if (!soundPaused && wanted && isSoundCloud(wanted.src)) soundCloud.heard = false;
        applySound();
      });
      audio.addEventListener("timeupdate", () => {
        if (!wanted || isSoundCloud(wanted.src) || !audio.duration) return;
        const progress = (audio.currentTime / audio.duration).toFixed(4);
        set(wanted.scene, "--play", progress);
        wanted.scene.classList.add("is-sounding");
      });
      document.addEventListener("visibilitychange", applySound);
    }

    const update = () => {
      frame = 0;
      // Written on the bar itself: on <html> it restyled the whole document every frame.
      set(pageProgress, "--page-progress", Math.min(1, window.scrollY / maxScroll).toFixed(4));
      sceneJourneys.forEach(updateSceneJourney);
      updateStory();
      updateCapabilities();
      updateOutro();
      updateChapters();
      updateDock();
      if (!reducedMotion.matches) sectionScenes.forEach((scene) => {
        const box = boxes.get(scene.parentElement);
        const progress = clamp((window.scrollY + viewportHeight - box.top) / (viewportHeight + box.height));
        if (!moved(scene, progress, box)) return;
        set(scene, "--scene-progress", progress.toFixed(4));
        set(scene, "--scene-drift", `${(progress - .5) * 70}px`);
      });
      updateSound();
      forceUpdate = false;
    };

    const cancelProjectNavigation = () => {
      window.cancelAnimationFrame(projectNavigationFrame);
      window.clearTimeout(portalTimer);
      projectNavigationFrame = 0;
      document.querySelector(".project-portal")?.remove();
      openingProject?.classList.remove("is-opening");
      openingProject = null;
      root.classList.remove("project-navigating");
    };

    // The chosen card opens like a portal: from its own place on screen it grows to fill the
    // window, its photograph and title in front, and the project page opens on that same frame.
    let portalTimer = 0;
    const openPortal = (card) => {
      const rect = card.getBoundingClientRect();
      const portal = document.createElement("div");
      portal.className = "project-portal";
      portal.setAttribute("aria-hidden", "true");
      portal.style.setProperty("--project-accent", card.style.getPropertyValue("--project-accent"));
      const image = card.querySelector(".project-card-image img");
      if (image) {
        const copy = document.createElement("img");
        copy.src = image.currentSrc || image.src;
        copy.alt = "";
        portal.append(copy);
      }
      const text = document.createElement("div");
      text.className = "project-portal-copy";
      const kicker = document.createElement("span");
      kicker.textContent = `Projet ${card.querySelector(".project-card-top span")?.textContent || ""} · ouverture`;
      const title = document.createElement("strong");
      title.textContent = card.querySelector("h3")?.textContent || "";
      text.append(kicker, title);
      const bar = document.createElement("i");
      bar.className = "project-portal-bar";
      portal.append(text, bar);
      document.body.append(portal);
      const from = `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round 22px)`;
      portal.animate([{ clipPath: from }, { clipPath: "inset(0px 0px 0px 0px round 0px)" }], { duration: 780, easing: "cubic-bezier(.7, 0, .2, 1)", fill: "forwards" });
      portalTimer = window.setTimeout(() => window.location.assign(card.href), 1050);
    };

    capabilityCards.forEach((card, index) => {
      card.addEventListener("click", (event) => {
        // Keep native links for reduced motion and opening new tabs.
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!capabilityJourney || reducedMotion.matches) return;
        event.preventDefault();
        cancelProjectNavigation();
        stopGlide();
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
          // Let the centered card paint, then open it.
          if (elapsed >= duration + 120) {
            openPortal(card);
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

    // ── Scroll guidance ─────────────────────────────────────────────────────────────────────────
    // Rest points are the scroll positions where nothing is half played: a scene fully told, a
    // chapter fully arrived, a project card centred. Between two close rest points the page is in a
    // transition; when the visitor stops there, it glides on to the end of what they were watching.
    // A "done" point is a scene fully played: the ↓ button stops only there, never on a scene that
    // has only just arrived.
    let rests = [{ y: 0, done: true }];
    function collectRests() {
      const points = [[0, true], [maxScroll, true]];
      chapterSections.forEach((section) => {
        const box = section && boxes.get(section);
        if (box) points.push([box.top, reducedMotion.matches]);
      });
      if (!reducedMotion.matches) {
        // Each chapter rises over the previous one during the screen before it arrives; just before,
        // the previous chapter has finished (unless its last scene already rests a moment earlier).
        chapterSections.forEach((section) => {
          const box = section && boxes.get(section);
          if (box && box.top > viewportHeight) points.push([box.top - viewportHeight, true, "cover"]);
        });
        sceneJourneys.forEach(({ journey, scenes, weights, starts, units }) => {
          const box = boxes.get(journey);
          if (!box) return;
          const span = Math.max(1, box.height - viewportHeight * 2);
          const at = (unit) => box.top + span * unit / units;
          scenes.forEach((scene, index) => {
            points.push([index === 0 ? box.top : at(starts[index] + .05), false]);
            // A scene whose own motion is only an exit (the opening screen) has no resting end.
            if (!scene.hasAttribute("data-no-rest")) points.push([at(starts[index] + weights[index] - .35), true]);
          });
        });
        if (capabilityJourney && boxes.get(capabilityJourney)) {
          const box = boxes.get(capabilityJourney);
          const span = Math.max(1, box.height - viewportHeight);
          capabilityCards.forEach((_, index) => points.push([box.top + span * mix(carouselStart, carouselEnd, index / Math.max(1, capabilityCards.length - 1)), true]));
        }
        // The atlas rests on each city once the plane has landed, then on the whole network.
        if (storyJourney && boxes.get(storyJourney)) {
          const box = boxes.get(storyJourney);
          const span = Math.max(1, box.height - viewportHeight * 2);
          const stops = Number(storyJourney.dataset.atlasStops || 0);
          const intro = Number(storyJourney.dataset.atlasIntro || 0);
          const outro = Number(storyJourney.dataset.atlasOutro || 1);
          const hop = (outro - intro) / Math.max(1, stops);
          for (let stop = 0; stop < stops; stop += 1) points.push([box.top + span * (intro + (stop + .8) * hop), true]);
          points.push([box.top + span * Math.min(1, outro + .08), true]);
        }
        if (outroJourney && boxes.get(outroJourney)) {
          const box = boxes.get(outroJourney);
          points.push([box.top + Number(outroJourney.dataset.jumpProgress || 0) * Math.max(0, box.height - viewportHeight), true]);
        }
      }
      // Points a few pixels apart are one: it counts as done if either is.
      const merged = points.map(([y, done, kind]) => ({ y: clamp(Math.round(y), 0, maxScroll), done, kind })).sort((a, b) => a.y - b.y)
        .reduce((list, point) => {
          const previous = list[list.length - 1];
          if (previous && point.y - previous.y <= 4) previous.done ||= point.done;
          else list.push(point);
          return list;
        }, []);
      // A still stretch between a finished scene and the next chapter's rise is not a stop: a scroll
      // there would move the page without anything changing on screen.
      rests = merged.filter((point) => point.kind !== "cover" || !merged.some((other) => other !== point && other.done && other.y < point.y && point.y - other.y < viewportHeight * .35));
    }
    // Where to settle from a stop at y, heading in `direction`: on to the end of the scene being
    // watched (or back to the end of the previous one), null when already resting or far from any stop.
    const settlePoint = (y, direction) => {
      if (rests.some((point) => Math.abs(point.y - y) <= 4)) return null;
      const reach = viewportHeight * 1.6;
      const behind = rests.filter((point) => point.y < y).reverse();
      const ahead = rests.filter((point) => point.y > y);
      const previous = behind[0]?.y ?? 0;
      const next = ahead[0]?.y ?? maxScroll;
      // A nudge that barely left a stop falls back to it.
      const nudge = Math.min(90, (next - previous) * .15);
      if (direction > 0 && y - previous < nudge) return previous;
      if (direction < 0 && next - y < nudge) return next;
      if (!direction) return y - previous < next - y ? previous : next;
      const way = direction > 0 ? ahead : behind;
      const within = (point) => Math.abs(point.y - y) <= reach;
      const target = way.find((point) => point.done && within(point)) || way.find(within);
      return target ? target.y : null;
    };
    const nextRest = () => rests.find((point) => point.done && point.y > window.scrollY + viewportHeight * .3)?.y ?? maxScroll;

    // One glide drives the page: the wheel eases toward where it points (smooth on a mouse as on a
    // trackpad), and settling, the ↓ button and in-page links travel along a timed curve.
    const glide = { active: false, current: 0, target: 0, written: -1, tau: 100, last: 0, frame: 0, tween: null, velocity: 0 };
    // A timed glide leaves at the speed the page already has and lands at rest (a cubic Hermite curve),
    // so a wheel that turns into a settle reads as one movement.
    const hermite = (from, to, speed, t) => {
      const t2 = t * t;
      const t3 = t2 * t;
      return from * (2 * t3 - 3 * t2 + 1) + speed * (t3 - 2 * t2 + t) + to * (3 * t2 - 2 * t3);
    };
    // html.is-gliding turns CSS smooth scrolling off, so each position written lands at once.
    const placeAt = (top) => {
      root.classList.add("is-gliding");
      window.scrollTo(0, top);
      if (!glide.active) root.classList.remove("is-gliding");
    };
    const writeScroll = (top) => {
      glide.written = top;
      placeAt(top);
      update();
    };
    const stopGlide = () => {
      if (!glide.active) return;
      window.cancelAnimationFrame(glide.frame);
      glide.active = false;
      glide.tween = null;
      root.classList.remove("is-gliding");
    };
    const glideStep = (now) => {
      const elapsed = Math.min(64, now - glide.last);
      glide.last = now;
      const before = glide.current;
      if (glide.tween) {
        const { from, to, startedAt, duration, speed } = glide.tween;
        const t = clamp((now - startedAt) / duration);
        glide.current = hermite(from, to, speed, t);
        if (t >= 1) glide.current = glide.target = to;
      } else {
        const gap = glide.target - glide.current;
        glide.current = Math.abs(gap) < .5 ? glide.target : glide.current + gap * (1 - Math.exp(-elapsed / glide.tau));
      }
      if (elapsed > 0) glide.velocity = (glide.current - before) / elapsed;
      writeScroll(glide.current);
      if (glide.current === glide.target) {
        stopGlide();
        scheduleSettle();
        return;
      }
      glide.frame = window.requestAnimationFrame(glideStep);
    };
    const startGlide = () => {
      if (glide.active) return;
      glide.active = true;
      glide.last = performance.now();
      root.classList.add("is-gliding");
      glide.frame = window.requestAnimationFrame(glideStep);
    };
    const travelTo = (top) => {
      const to = clamp(top, 0, maxScroll);
      if (reducedMotion.matches) { placeAt(to); return; }
      const moving = glide.active;
      const from = moving ? glide.current : window.scrollY;
      if (Math.abs(to - from) < 2) return;
      const duration = mix(380, 950, clamp(Math.abs(to - from) / viewportHeight / 1.2));
      // Keep the current speed only when it already heads to the target, and never so fast it overshoots.
      const distance = to - from;
      const carried = moving ? glide.velocity * duration : 0;
      const speed = Math.sign(carried) === Math.sign(distance) ? Math.sign(distance) * Math.min(Math.abs(carried), Math.abs(distance) * 2.5) : 0;
      glide.current = from;
      glide.target = to;
      glide.tween = { from, to, startedAt: performance.now(), duration, speed };
      if (!moving) glide.velocity = 0;
      startGlide();
    };

    // A wheel inside something that scrolls on its own (a list, the guide) stays native.
    const scrollsInside = (node, delta) => {
      for (let element = node; element && element !== document.body && element !== root; element = element.parentElement) {
        if (!(element instanceof Element) || element.scrollHeight <= element.clientHeight + 1) continue;
        if (!/(auto|scroll)/.test(getComputedStyle(element).overflowY)) continue;
        if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) return true;
      }
      return false;
    };
    let direction = 0;
    let lastY = window.scrollY;
    let touching = false;
    let pressing = false;
    let settleTimer = 0;
    const guide = document.querySelector("[data-guide]");
    const guideOpen = () => Boolean(guide?.open);
    function scheduleSettle(delay = 170) {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, delay);
    }
    function settle() {
      if (glide.tween || touching || pressing || guideOpen() || reducedMotion.matches || root.classList.contains("project-navigating")) return;
      // The wheel has stopped while the page still eases toward where it pointed: judge from there,
      // and bend that same movement toward the stop.
      const point = settlePoint(glide.active ? glide.target : window.scrollY, direction);
      if (point !== null) travelTo(point);
    }

    if (!reducedMotion.matches) {
      window.addEventListener("wheel", (event) => {
        if (event.defaultPrevented || event.ctrlKey) return;
        if (guideOpen()) { if (!scrollsInside(event.target, event.deltaY)) event.preventDefault(); return; }
        if (root.classList.contains("project-navigating") || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        if (scrollsInside(event.target, event.deltaY)) return;
        event.preventDefault();
        const delta = event.deltaY * (event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? viewportHeight : 1);
        if (!delta) return;
        direction = Math.sign(delta);
        // A wheel during a timed glide takes the page back from where it is.
        if (!glide.active || glide.tween) glide.current = glide.target = window.scrollY;
        glide.tween = null;
        glide.target = clamp(glide.target + delta, 0, maxScroll);
        // Mouse notches arrive as big steps and get a longer ease; trackpad streams stay close to the finger.
        glide.tau = Math.abs(delta) >= 50 ? 120 : 70;
        startGlide();
        scheduleSettle(140);
      }, { passive: false });
      window.addEventListener("touchstart", () => { touching = true; stopGlide(); }, { passive: true });
      window.addEventListener("touchend", () => { touching = false; scheduleSettle(); }, { passive: true });
      window.addEventListener("touchcancel", () => { touching = false; scheduleSettle(); }, { passive: true });
      // Holding the scrollbar (or a selection) is the visitor steering: nothing glides until they let go.
      window.addEventListener("pointerdown", (event) => { if (event.pointerType === "mouse") pressing = true; }, { passive: true });
      window.addEventListener("pointerup", () => { pressing = false; scheduleSettle(); }, { passive: true });
      window.addEventListener("pointercancel", () => { pressing = false; }, { passive: true });
      window.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stopGlide();
      });
    }
    const onScroll = () => {
      const y = window.scrollY;
      // Anything else moving the page (scrollbar, keys, find in page) wins over a glide.
      if (glide.active && Math.abs(y - glide.written) > 4) stopGlide();
      if (y !== lastY) {
        if (!glide.active) direction = Math.sign(y - lastY);
        lastY = y;
      }
      if (!glide.active) scheduleSettle();
      requestUpdate();
    };

    // The dock: the ↓ plays the next scene, the label folds once the visit has started, and a
    // first-time visitor who hasn't moved after a few seconds is shown where the guide is.
    const dock = document.querySelector("[data-guide-dock]");
    const updateDock = () => {
      if (!dock) return;
      dock.classList.toggle("is-compact", window.scrollY > viewportHeight * .5);
      dock.classList.toggle("is-at-end", window.scrollY >= maxScroll - 4);
    };
    dock?.querySelector("[data-scroll-next]")?.addEventListener("click", () => {
      stopGlide();
      direction = 1;
      travelTo(nextRest());
    });
    const remembered = (key) => { try { return window.localStorage.getItem(key) === "1"; } catch { return false; } };
    const remember = (key) => { try { window.localStorage.setItem(key, "1"); } catch { /* private mode: the hint simply returns */ } };
    if (dock && !remembered("guide-seen")) {
      window.setTimeout(() => {
        if (window.scrollY < 40 && !guideOpen()) dock.classList.add("is-hinting");
      }, 6000);
    }

    // The guide: a native dialog (focus kept inside, Escape closes). Each step is learnt by doing
    // it in its practice area; once done, the step says so and the next one follows on its own.
    if (guide) {
      const slides = Array.from(guide.querySelectorAll("[data-guide-step]"));
      const dots = Array.from(guide.querySelectorAll(".guide-dots i"));
      const prev = guide.querySelector("[data-guide-prev]");
      const next = guide.querySelector("[data-guide-next]");
      let step = 0;
      let advanceTimer = 0;
      const last = slides.length - 1;
      const renderFoot = () => {
        const done = slides[step]?.classList.contains("is-done");
        if (prev) prev.disabled = step === 0;
        if (!next) return;
        next.classList.toggle("is-ready", Boolean(done));
        next.innerHTML = step === last && done ? "C’est parti <span aria-hidden=\"true\">↓</span>" : done ? "Suivant <span aria-hidden=\"true\">→</span>" : step === last ? "Terminer" : "Passer";
      };
      const show = (index) => {
        window.clearTimeout(advanceTimer);
        step = clamp(index, 0, last);
        guide.style.setProperty("--guide-step", String(step));
        slides.forEach((slide, k) => { slide.inert = k !== step; slide.classList.toggle("is-current", k === step); });
        dots.forEach((dot, k) => { dot.classList.toggle("is-current", k === step); dot.classList.toggle("is-done", slides[k].classList.contains("is-done")); });
        renderFoot();
      };
      const complete = (slide) => {
        if (!slide || slide.classList.contains("is-done")) return;
        slide.classList.add("is-done");
        const index = slides.indexOf(slide);
        dots[index]?.classList.add("is-done");
        renderFoot();
        if (index === step && index < last) advanceTimer = window.setTimeout(() => { if (step === index) show(index + 1); }, 1200);
      };
      const slideOf = (element) => element.closest("[data-guide-step]");

      // 1 — a small page to scroll: done once read to the end.
      guide.querySelectorAll("[data-try-scroll]").forEach((scroller) => scroller.addEventListener("scroll", () => {
        const progress = clamp(scroller.scrollTop / Math.max(1, scroller.scrollHeight - scroller.clientHeight));
        slideOf(scroller).style.setProperty("--try", progress.toFixed(3));
        if (progress > .92) complete(slideOf(scroller));
      }, { passive: true }));

      // 2 — a scene to bring in; stopped half-way, it finishes itself, as the page does.
      const sceneScroller = guide.querySelector("[data-try-scroll-scene]");
      const sceneBox = guide.querySelector("[data-try-scene]");
      const caption = guide.querySelector("[data-try-caption]");
      let sceneTimer = 0;
      let sceneFrame = 0;
      const finishScene = () => {
        const from = sceneScroller.scrollTop;
        const to = sceneScroller.scrollHeight - sceneScroller.clientHeight;
        const startedAt = performance.now();
        if (caption) caption.textContent = "Vous vous êtes arrêté : la page termine l’animation…";
        const tick = (now) => {
          const t = clamp((now - startedAt) / 650);
          sceneScroller.scrollTop = mix(from, to, ease(t));
          if (t < 1) sceneFrame = window.requestAnimationFrame(tick);
        };
        sceneFrame = window.requestAnimationFrame(tick);
      };
      sceneScroller?.addEventListener("scroll", () => {
        const progress = clamp(sceneScroller.scrollTop / Math.max(1, sceneScroller.scrollHeight - sceneScroller.clientHeight));
        sceneBox.style.setProperty("--t", progress.toFixed(3));
        window.clearTimeout(sceneTimer);
        if (progress > .97) {
          if (caption) caption.textContent = "✓ L’écran suivant est arrivé";
          complete(slideOf(sceneScroller));
          return;
        }
        if (progress > .04) sceneTimer = window.setTimeout(finishScene, 260);
      }, { passive: true });
      ["wheel", "touchstart"].forEach((name) => sceneScroller?.addEventListener(name, () => window.cancelAnimationFrame(sceneFrame), { passive: true }));

      // 3 — the three signs that mean "click me".
      guide.querySelectorAll("[data-try-target]").forEach((target) => target.addEventListener("click", () => {
        target.classList.add("is-done");
        const slide = slideOf(target);
        const found = slide.querySelectorAll("[data-try-target].is-done").length;
        const total = slide.querySelectorAll("[data-try-target]").length;
        const count = slide.querySelector("[data-try-count]");
        if (count) count.textContent = `${found} / ${total}`;
        if (found === total) complete(slide);
      }));

      // 4 — the chapter rail: the chosen chapter lights up.
      guide.querySelectorAll("[data-try-rail]").forEach((button) => button.addEventListener("click", () => {
        const slide = slideOf(button);
        slide.querySelectorAll("[data-try-rail]").forEach((other) => other.classList.toggle("is-current", other === button));
        if (button.dataset.tryRail === "goal") complete(slide);
        else slide.classList.add("is-wrong");
        window.setTimeout(() => slide.classList.remove("is-wrong"), 500);
      }));

      // 5 — the ↓ button: each press brings the next scene of the miniature page.
      guide.querySelectorAll("[data-try-next]").forEach((button) => button.addEventListener("click", () => {
        const slide = slideOf(button);
        const reel = Number(slide.style.getPropertyValue("--reel") || 0);
        slide.style.setProperty("--reel", String(Math.min(3, reel + 1)));
        complete(slide);
      }));

      const reset = () => {
        slides.forEach((slide) => {
          slide.classList.remove("is-done", "is-wrong");
          slide.style.removeProperty("--try");
          slide.style.removeProperty("--reel");
        });
        guide.querySelectorAll("[data-try-scroll], [data-try-scroll-scene]").forEach((scroller) => { scroller.scrollTop = 0; });
        guide.querySelectorAll("[data-try-target], [data-try-rail]").forEach((item) => item.classList.remove("is-done", "is-current"));
        guide.querySelectorAll("[data-try-count]").forEach((count) => { count.textContent = `0 / ${count.parentElement.querySelectorAll("[data-try-target]").length}`; });
        sceneBox?.style.setProperty("--t", "0");
        if (caption) caption.textContent = "Défilez dans l’écran ↓";
      };
      const close = () => { if (guide.open) guide.close(); };
      document.querySelectorAll("[data-guide-open]").forEach((button) => button.addEventListener("click", () => {
        stopGlide();
        dock?.classList.remove("is-hinting");
        remember("guide-seen");
        reset();
        show(0);
        root.classList.add("guide-open");
        guide.showModal();
        slides[0]?.querySelector("[data-try-scroll]")?.focus({ preventScroll: true });
      }));
      guide.addEventListener("close", () => { window.clearTimeout(advanceTimer); root.classList.remove("guide-open"); });
      guide.querySelector("[data-guide-close]")?.addEventListener("click", close);
      prev?.addEventListener("click", () => show(step - 1));
      next?.addEventListener("click", () => {
        if (step < last) { show(step + 1); return; }
        close();
        // From the top of the page, the guide's last word is the first step of the visit.
        if (window.scrollY < viewportHeight * .3) { direction = 1; travelTo(nextRest()); }
      });
      // A click on the dimmed page around the card closes it.
      guide.addEventListener("click", (event) => { if (event.target === guide) close(); });
      guide.addEventListener("keydown", (event) => {
        if (event.target?.closest?.("[data-try-scroll], [data-try-scroll-scene]")) return;
        if (event.key === "ArrowRight") show(step + 1);
        if (event.key === "ArrowLeft") show(step - 1);
      });
    }

    // A long in-page jump (back to top, chapter rail, header links) teleports to one screen short of
    // its target and glides the rest: travelling through every pinned scene replayed them all.
    const jumpTo = (top) => {
      stopGlide();
      const distance = top - window.scrollY;
      const glideLength = Math.min(Math.abs(distance), viewportHeight * .9);
      if (Math.abs(distance) > glideLength) placeAt(top - Math.sign(distance) * glideLength);
      direction = Math.sign(distance);
      travelTo(top);
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

    window.addEventListener("scroll", onScroll, { passive: true });
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
