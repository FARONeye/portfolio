import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../public/motion.js', import.meta.url), 'utf8');

// Exercise the production scroll controller with a deterministic clock and layout.
function gallery({ width = 1440, reduced = false, progress = .48 } = {}) {
  const frames = new Map();
  let frameId = 0;
  let now = 0;
  const target = () => {
    const listeners = new Map();
    return {
      addEventListener(name, callback) {
        listeners.set(name, [...(listeners.get(name) || []), callback]);
      },
      emit(name, event = {}) { listeners.get(name)?.forEach(callback => callback(event)); },
    };
  };
  const element = () => {
    const values = new Map();
    const classes = new Set();
    return {
      ...target(),
      style: { setProperty: (key, value) => values.set(key, value), removeProperty: key => values.delete(key), [Symbol.iterator]: () => values.keys() },
      classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name), toggle: (name, yes) => yes ? classes.add(name) : classes.delete(name) },
      dataset: {}, values,
      setAttribute() {}, removeAttribute() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    };
  };
  const root = element();
  root.scrollHeight = 16000;
  const sticky = element();
  const cards = Array.from({ length: 5 }, (_, index) => Object.assign(element(), { href: `/projets/${index}` }));
  const journey = Object.assign(element(), { offsetHeight: 7200 });
  journey.querySelector = selector => selector === '.capability-sticky' ? sticky : null;
  const navigations = [];
  const scrolls = [];
  const window = {
    ...target(), innerWidth: width, innerHeight: 1000, scrollY: 3000 + 6200 * progress,
    location: { assign: href => navigations.push(href), reload() {} },
    matchMedia: query => ({ matches: query.includes('reduced') ? reduced : width <= 760, ...target() }),
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    history: { pushState() {} },
    scrollTo(x, y) { scrolls.push(typeof x === 'object' ? x : { top: y }); this.scrollY = typeof x === 'object' ? x.top : y; this.emit('scroll'); },
  };
  journey.getBoundingClientRect = () => ({ top: 3000 - window.scrollY });
  const document = {
    ...target(), documentElement: root, readyState: 'complete', getElementById: id => id === 'accueil' ? { getBoundingClientRect: () => ({ top: -window.scrollY }) } : null,
    querySelector: selector => selector === '[data-capability-journey]' ? journey : null,
    querySelectorAll: selector => selector === '[data-capability-card]' ? cards : [],
  };
  class IntersectionObserver { observe() {} }
  runInNewContext(source, { window, document, IntersectionObserver, performance: { now: () => now } });
  const advance = ms => {
    for (let elapsed = 0; elapsed < ms; elapsed += 16) {
      now += 16;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(now));
    }
  };
  const click = (index, overrides = {}) => {
    const event = { button: 0, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...overrides };
    cards[index].emit('click', event);
    return event;
  };
  // Clicks an in-page link, as the footer's "Retour en haut" does.
  const follow = href => {
    const link = { getAttribute: () => href, classList: { contains: () => false } };
    const event = { target: { closest: () => link }, button: 0, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    document.emit('click', event);
    return event;
  };
  return { cards, sticky, window, root, navigations, scrolls, advance, click, follow };
}

test('every rendered card remains clickable, including faint background cards and the opening stack', () => {
  for (const progress of [0, .1, .18, .33, .48, .63, .78, .88]) {
    const scene = gallery({ progress });
    for (const card of scene.cards) {
      if (Number(card.values.get('--cap-card-opacity')) > 0) assert.equal(card.inert, false);
    }
  }
  assert(gallery({ progress: .9 }).cards.every(card => card.inert));
});

test('a background card scrolls into focus before its own page opens', () => {
  const scene = gallery();
  assert.equal(scene.sticky.dataset.activeProject, '2');
  assert(scene.click(3).defaultPrevented);
  scene.advance(400);
  assert.deepEqual(scene.navigations, []);
  scene.advance(400);
  assert(Math.abs(scene.window.scrollY - (3000 + 6200 * .63)) < 1);
  assert.equal(scene.sticky.dataset.activeProject, '3');
  assert.deepEqual(scene.navigations, ['/projets/3']);
});

test('all five destinations can be selected from either scroll direction', () => {
  for (let index = 0; index < 5; index++) {
    const scene = gallery({ progress: index < 2 ? .7 : .2 });
    scene.click(index);
    scene.advance(1200);
    assert.equal(scene.sticky.dataset.activeProject, String(index));
    assert.deepEqual(scene.navigations, [`/projets/${index}`]);
  }
});

test('a second selection replaces the first pending navigation', () => {
  const scene = gallery();
  scene.click(1);
  scene.advance(200);
  scene.click(3);
  scene.advance(800);
  assert.deepEqual(scene.navigations, ['/projets/3']);
});

test('reduced motion and modified clicks retain native link behavior', () => {
  for (const options of [{ reduced: true }, {}]) {
    const scene = gallery(options);
    const event = scene.click(1, options.reduced ? {} : { metaKey: true });
    assert.equal(event.defaultPrevented, false);
    scene.advance(1000);
    assert.deepEqual(scene.navigations, []);
  }
});

test('a phone plays the same carousel: a tapped card centres before its page opens', () => {
  const scene = gallery({ width: 390 });
  assert(scene.click(3).defaultPrevented);
  scene.advance(1000);
  assert.equal(scene.sticky.dataset.activeProject, '3');
  assert.deepEqual(scene.navigations, ['/projets/3']);
});

test('a toolbar sliding away mid-navigation does not cancel it', () => {
  const scene = gallery({ width: 390 });
  scene.click(3);
  scene.advance(200);
  scene.window.innerHeight = 1080;
  scene.window.emit('resize');
  scene.advance(1000);
  assert.deepEqual(scene.navigations, ['/projets/3']);
});

test('trackpad momentum after the click does not cancel the navigation', () => {
  const scene = gallery();
  scene.click(3);
  for (let step = 0; step < 5; step++) {
    scene.window.emit('wheel', { deltaY: 5 - step });
    scene.advance(32);
  }
  scene.advance(800);
  assert.deepEqual(scene.navigations, ['/projets/3']);
});

test('a card already in focus opens quickly', () => {
  const scene = gallery({ progress: .63 });
  scene.click(3);
  scene.advance(160);
  assert.deepEqual(scene.navigations, ['/projets/3']);
});

test('escape, resizing and history restoration cancel pending navigation', () => {
  for (const [name, event] of [['keydown', { key: 'Escape' }], ['resize', {}], ['pageshow', {}]]) {
    const scene = gallery();
    scene.click(3);
    scene.advance(200);
    if (name === 'resize') scene.window.innerWidth = 1100;
    scene.window.emit(name, event);
    scene.advance(1000);
    assert.deepEqual(scene.navigations, []);
    assert.equal(scene.root.classList.contains('project-navigating'), false);
  }
});

test('back to top teleports past the pinned scenes and only glides the last screen', () => {
  const scene = gallery({ progress: .9 });
  assert(scene.follow('#accueil').defaultPrevented);
  // One instant jump to a screen short of the top, then a single smooth glide.
  assert.equal(JSON.stringify(scene.scrolls.slice(-2)), JSON.stringify([{ top: 900 }, { top: 0, behavior: 'smooth' }]));
});
