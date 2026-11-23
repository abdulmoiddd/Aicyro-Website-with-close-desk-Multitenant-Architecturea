// Obsidian redesign: the walk-in hero's WebGL scene, vanilla three + troika-three-text.
// Browser only (imported by WalkInCanvas, which next/dynamic loads with ssr: false).
//
// Choreography: ScrollTrigger progress (0..1 across the 500vh track) is damped toward a
// smoothed value, remapped so the camera settles on each beat, then read off a
// CatmullRomCurve3 helix: one full 360° orbit around the central axis while the radius
// closes in and the height descends ("walking in"). A rig group carries the camera so the
// damped pointer parallax layers on top. Four SDF headlines sit on the helix and always
// face the camera; each fades in before and out after its scroll window, so text never
// reads backwards, upside down or on top of another.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Text } from "troika-three-text";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const BEATS = [
  { title: "AICYRO", sub: "AI  ·  CYBERSECURITY  ·  SOFTWARE", start: 0, end: 0.22, u: 0, dist: 6.5 },
  { title: "INTELLIGENCE,\nENGINEERED", sub: "CUSTOM AI-DRIVEN SOFTWARE", start: 0.25, end: 0.48, u: 0.25, dist: 6 },
  { title: "SECURE AT\nEVERY ANGLE", sub: "ENTERPRISE-GRADE FROM DAY ONE", start: 0.52, end: 0.74, u: 0.5, dist: 6 },
  { title: "BUILT FOR\nWHAT'S NEXT", sub: "INTELLIGENCE  ·  SECURITY  ·  INNOVATION", start: 0.8, end: 1, u: 1, dist: 6.5 },
];

/** Which beat a progress value belongs to (gaps count toward the next beat). */
export function beatAt(p) {
  if (p < 0.235) return 0;
  if (p < 0.5) return 1;
  if (p < 0.76) return 2;
  return 3;
}

const FONT_DISPLAY = "/fonts/unbounded-600.woff";
const FONT_SUB = "/fonts/unbounded-400.woff";

// Progress -> path parameter. Smoothstep inside each segment, so the camera eases into
// every beat, rests on it, then walks on: 0° entry, 90°, 180°, then 270° -> 360°.
const KEY_P = [0, 0.1, 0.365, 0.63, 0.885, 1];
const KEY_U = [0, 0, 0.25, 0.5, 0.75, 1];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

function pathU(p) {
  for (let i = 1; i < KEY_P.length; i++) {
    if (p <= KEY_P[i]) return lerp(KEY_U[i - 1], KEY_U[i], smooth(KEY_P[i - 1], KEY_P[i], p));
  }
  return 1;
}

// The helix itself: radius closes from 15 to 6.5 (ease-out), height descends 2.4 -> -3.2
const R0 = 15;
const R1 = 6.5;
const Y0 = 2.4;
const Y1 = -3.2;
const radiusAt = (u) => lerp(R0, R1, 1 - (1 - u) * (1 - u));
const heightAt = (u) => lerp(Y0, Y1, u);
const angleAt = (u) => u * Math.PI * 2;

function helixPoint(u, target = new THREE.Vector3()) {
  const a = angleAt(u);
  const r = radiusAt(u);
  return target.set(Math.sin(a) * r, heightAt(u), Math.cos(a) * r);
}

// Theme colours from globals.css (light, dark, tenant hues). Values can be color-mix()
// expressions (tenant shades), so each is resolved by the browser through a probe element.
function readThemeColor(name, fallback) {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${name}, ${fallback})`;
  (document.querySelector(".www") || document.body).appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  const c = new THREE.Color(fallback);
  const m = resolved.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    if (/^color\(srgb/.test(resolved)) c.setRGB(+m[0], +m[1], +m[2], THREE.SRGBColorSpace);
    else c.setRGB(+m[0] / 255, +m[1] / 255, +m[2] / 255, THREE.SRGBColorSpace);
  }
  return c;
}

function readTheme() {
  const bg = readThemeColor("--background", "#0a0118");
  const fg = readThemeColor("--foreground", "#ffffff");
  const card = readThemeColor("--card-bg", "#120b18");
  const accent = readThemeColor("--primary", "#8a2be2");
  const hsl = {};
  bg.getHSL(hsl);
  return { bg, fg, card, accent, isLight: hsl.l > 0.5 };
}

function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Mount the scene into `host`. Returns a dispose function that frees every geometry,
 * material, texture, text mesh and the renderer.
 */
export function createWalkInScene(host, { track, onFrame, onReady, isTouch = false } = {}) {
  gsap.registerPlugin(ScrollTrigger);

  // ------------------------------------------------------------------ renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: !isTouch,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2));
  const theme = readTheme();
  const { bg, fg, card, accent, isLight } = theme;
  renderer.setClearColor(bg, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.className = "wh-gl";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = bg.clone();
  scene.fog = new THREE.FogExp2(bg.getHex(), isLight ? 0.026 : 0.034);

  // Studio reflections for the metals (text, rings, columns)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTex = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envTex;
  if ("environmentIntensity" in scene) scene.environmentIntensity = isLight ? 0.55 : 0.32;

  // Accent text and lines lean toward the ink colour (lighter on dark, deeper on light)
  const accentSoft = accent.clone().lerp(fg, isLight ? 0.3 : 0.45);
  const glowBlend = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  // Everything we create, for disposal
  const geometries = [];
  const materials = [];
  const textures = [envTex];
  const texts = [];
  const track_ = (list, item) => (list.push(item), item);

  // ------------------------------------------------------------------ camera rig
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  const rig = new THREE.Group();
  rig.add(camera);
  camera.rotation.y = Math.PI; // the rig faces +Z at its target; the camera looks down -Z
  scene.add(rig);

  // Key light rides with the camera so every headline is lit from the viewer's side
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, -2);
  rig.add(key);
  rig.add(key.target);
  key.target.position.set(0, 0, 8);

  scene.add(new THREE.AmbientLight(0xffffff, isLight ? 0.55 : 0.12));
  scene.add(new THREE.HemisphereLight(accentSoft, bg, isLight ? 0.4 : 0.18));

  // Accent rim lights at the core
  const rimA = new THREE.PointLight(accent, 60, 34, 1.6);
  rimA.position.set(0, 3.5, 0);
  const rimB = new THREE.PointLight(accentSoft, 30, 26, 1.8);
  rimB.position.set(0, -4.5, 0);
  scene.add(rimA, rimB);

  // ------------------------------------------------------------------ floor and grid
  const FLOOR_Y = -6.5;
  const floorGeo = track_(geometries, new THREE.PlaneGeometry(220, 220));
  const floorMat = track_(
    materials,
    new THREE.MeshStandardMaterial({
      color: card.clone().lerp(bg, 0.5),
      metalness: isLight ? 0.2 : 0.85,
      roughness: isLight ? 0.7 : 0.42,
    })
  );
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  scene.add(floor);

  const grid = new THREE.GridHelper(220, 110, accent, fg.clone().lerp(bg, isLight ? 0.8 : 0.85));
  grid.position.y = FLOOR_Y + 0.01;
  const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMats.forEach((m) => {
    m.transparent = true;
    m.opacity = isLight ? 0.45 : 0.32;
    m.depthWrite = false;
    materials.push(m);
  });
  geometries.push(grid.geometry);
  scene.add(grid);

  // ------------------------------------------------------------------ architecture
  // A colonnade of slim obsidian columns on a 24-unit ring, with three lintel rings
  const COLS = isTouch ? 28 : 40;
  const colGeo = track_(geometries, new THREE.BoxGeometry(0.24, 30, 0.24));
  const colMat = track_(
    materials,
    new THREE.MeshStandardMaterial({
      color: isLight ? card.clone().lerp(fg, 0.08) : card,
      metalness: isLight ? 0.25 : 0.75,
      roughness: isLight ? 0.55 : 0.32,
    })
  );
  const columns = new THREE.InstancedMesh(colGeo, colMat, COLS);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < COLS; i++) {
    const a = (i / COLS) * Math.PI * 2;
    m4.makeRotationY(-a);
    m4.setPosition(Math.sin(a) * 24, FLOOR_Y + 15, Math.cos(a) * 24);
    columns.setMatrixAt(i, m4);
  }
  scene.add(columns);

  const lintelGeo = track_(geometries, new THREE.TorusGeometry(24, 0.035, 6, 160));
  const lintelMat = track_(
    materials,
    new THREE.MeshBasicMaterial({ color: accentSoft, transparent: true, opacity: 0.55 })
  );
  [FLOOR_Y + 0.3, 6, 15].forEach((y) => {
    const ring = new THREE.Mesh(lintelGeo, lintelMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    scene.add(ring);
  });

  // The core: a thin light beam on the axis and three slow metal rings above eye level
  const beamGeo = track_(geometries, new THREE.CylinderGeometry(0.035, 0.035, 44, 8, 1, true));
  const beamMat = track_(
    materials,
    new THREE.MeshBasicMaterial({
      color: accentSoft,
      transparent: true,
      opacity: 0.75,
      blending: glowBlend,
      depthWrite: false,
    })
  );
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = -1.4 + 22;
  scene.add(beam);

  const ringMat = track_(
    materials,
    new THREE.MeshStandardMaterial({
      color: isLight ? fg.clone().lerp(bg, 0.55) : fg.clone().lerp(bg, 0.18),
      metalness: 1,
      roughness: 0.22,
      emissive: accent,
      emissiveIntensity: 0.08,
    })
  );
  const rings = [
    { r: 2.4, t: 0.03, y: 3.6, sx: 0.12, sz: 0.07 },
    { r: 3.3, t: 0.022, y: 5.2, sx: -0.08, sz: 0.11 },
    { r: 4.4, t: 0.018, y: 7.4, sx: 0.05, sz: -0.06 },
  ].map((d) => {
    const geo = track_(geometries, new THREE.TorusGeometry(d.r, d.t, 12, 160));
    const mesh = new THREE.Mesh(geo, ringMat);
    mesh.position.y = d.y;
    mesh.rotation.x = Math.PI / 2;
    mesh.userData = d;
    scene.add(mesh);
    return mesh;
  });

  // ------------------------------------------------------------------ dust (three layers)
  const dotTex = makeDotTexture();
  textures.push(dotTex);
  const LAYERS = [
    { count: isTouch ? 420 : 1400, size: 0.05, color: fg.getHex(), opacity: isLight ? 0.35 : 0.55, radius: 26, speed: 0.012 },
    { count: isTouch ? 220 : 700, size: 0.085, color: accentSoft.getHex(), opacity: 0.7, radius: 20, speed: -0.02 },
    { count: isTouch ? 70 : 220, size: 0.16, color: accent.getHex(), opacity: 0.65, radius: 16, speed: 0.032 },
  ];
  const dust = LAYERS.map((L, li) => {
    const pos = new Float32Array(L.count * 3);
    for (let i = 0; i < L.count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * L.radius + 0.6;
      pos[i * 3] = Math.sin(a) * r;
      pos[i * 3 + 1] = FLOOR_Y + 0.5 + Math.random() * 22;
      pos[i * 3 + 2] = Math.cos(a) * r;
    }
    const geo = track_(geometries, new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = track_(
      materials,
      new THREE.PointsMaterial({
        size: L.size,
        map: dotTex,
        color: L.color,
        transparent: true,
        opacity: L.opacity,
        depthWrite: false,
        blending: glowBlend,
        sizeAttenuation: true,
      })
    );
    const pts = new THREE.Points(geo, mat);
    pts.userData = { ...L, phase: li * 1.7 };
    scene.add(pts);
    return pts;
  });

  // ------------------------------------------------------------------ the four headlines
  const headMat = track_(
    materials,
    new THREE.MeshStandardMaterial({
      color: fg,
      metalness: isLight ? 0.1 : 0.45,
      roughness: 0.3,
      emissive: fg,
      emissiveIntensity: isLight ? 0.6 : 0.42,
      transparent: true,
      depthWrite: false,
    })
  );
  headMat.fog = false;
  const subMat = track_(
    materials,
    new THREE.MeshBasicMaterial({ color: accentSoft, transparent: true, depthWrite: false })
  );
  subMat.fog = false;

  let readyFired = false;
  const beats = BEATS.map((b) => {
    const group = new THREE.Group();
    const u = b.u;
    const a = angleAt(u);
    const textR = Math.max(0, radiusAt(u) - b.dist);
    group.userData = {
      ...b,
      base: new THREE.Vector3(Math.sin(a) * textR, heightAt(u) - 0.15, Math.cos(a) * textR),
      outward: new THREE.Vector3(Math.sin(a), 0, Math.cos(a)),
      width: 1,
      fit: 1,
    };

    const head = new Text();
    head.text = b.title;
    head.font = FONT_DISPLAY;
    head.fontSize = b.title.includes("\n") ? 0.62 : 1.18;
    head.letterSpacing = -0.02;
    head.lineHeight = 1.02;
    head.textAlign = "center";
    head.anchorX = "center";
    head.anchorY = "bottom";
    head.material = headMat;
    head.sdfGlyphSize = 128;
    head.position.y = 0.05;
    head.renderOrder = 2;

    const sub = new Text();
    sub.text = b.sub;
    sub.font = FONT_SUB;
    sub.fontSize = 0.14;
    sub.letterSpacing = 0.22;
    sub.textAlign = "center";
    sub.anchorX = "center";
    sub.anchorY = "top";
    sub.material = subMat;
    sub.position.y = -0.18;
    sub.renderOrder = 2;

    group.add(head, sub);
    scene.add(group);
    texts.push(head, sub);

    head.sync();
    sub.sync();
    return group;
  });

  // ------------------------------------------------------------------ sizing
  let width = 1;
  let height = 1;
  function fitText() {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    beats.forEach((g, i) => {
      const visibleW = 2 * g.userData.dist * Math.tan(vFov / 2) * camera.aspect;
      // Also cap by height on short, wide screens; the final beat leaves room for the actions
      const visibleH = 2 * g.userData.dist * Math.tan(vFov / 2);
      const share = i === beats.length - 1 ? 0.7 : 0.84;
      g.userData.fit = Math.min(1, (visibleW * share) / Math.max(0.001, g.userData.width), visibleH / 3.4);
    });
  }
  // Narrow screens: larger, tighter sublines so they stay legible; widths re-measured
  let narrow = null;
  function measure(g) {
    g.userData.width = g.children.reduce((w, t) => {
      const bb = t.textRenderInfo?.blockBounds;
      return bb ? Math.max(w, bb[2] - bb[0]) : w;
    }, 1);
  }
  function setNarrow(next) {
    if (next === narrow) return;
    narrow = next;
    beats.forEach((g) => {
      const sub = g.children[1];
      sub.fontSize = next ? 0.2 : 0.14;
      sub.letterSpacing = next ? 0.1 : 0.22;
      sub.position.y = next ? -0.22 : -0.18;
      sub.sync(() => {
        measure(g);
        fitText();
      });
    });
  }

  function resize() {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    setNarrow(camera.aspect < 0.8);
    // Taller, narrower screens get a wider lens so the path and headlines still fit
    camera.fov = camera.aspect < 0.7 ? 64 : camera.aspect < 1.1 ? 54 : 45;
    camera.updateProjectionMatrix();
    fitText();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // ------------------------------------------------------------------ inputs
  let target = 0;
  let progress = 0;
  const st = ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      target = self.progress;
    },
  });
  target = st.progress || 0;
  progress = target;

  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointer = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  let inView = true;
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
  });
  io.observe(track);
  const onVisibility = () => {
    if (!document.hidden) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  // ------------------------------------------------------------------ frame
  const camPath = new THREE.CatmullRomCurve3(
    Array.from({ length: 33 }, (_, i) => helixPoint(i / 32)),
    false,
    "centripetal"
  );
  const camPos = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const timer = new THREE.Timer();
  let raf = 0;
  let running = false;
  let elapsed = 0;

  function frame(timestamp) {
    raf = 0;
    if (!inView || document.hidden) {
      running = false;
      return;
    }
    timer.update(timestamp);
    const dt = Math.min(timer.getDelta(), 1 / 20);
    elapsed += dt;

    // Inertial damping, frame-rate independent
    const prev = progress;
    progress += (target - progress) * (1 - Math.pow(1 - 0.075, dt * 60));
    if (Math.abs(target - progress) < 0.00005) progress = target;
    const velocity = (progress - prev) / Math.max(dt, 1e-4);

    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.pow(1 - 0.05, dt * 60));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.pow(1 - 0.05, dt * 60));

    // Camera on the spline, looking at the axis at its own height
    const u = pathU(progress);
    camPath.getPoint(u, camPos);
    rig.position.copy(camPos);
    lookAt.set(0, heightAt(u) - 0.15, 0);
    rig.lookAt(lookAt);
    // Pointer parallax on the rig's camera (local offset and a slight turn)
    camera.position.set(-mouse.sx * 0.35, -mouse.sy * 0.2, 0);
    camera.rotation.set(mouse.sy * 0.025, Math.PI - mouse.sx * 0.035, 0);

    // Headlines: fade within their windows, drift in from depth, always face the camera
    beats.forEach((g, i) => {
      const d = g.userData;
      const fadeIn = i === 0 ? 1 : smooth(d.start - 0.02, d.start + 0.05, progress);
      const fadeOut = i === beats.length - 1 ? 1 : 1 - smooth(d.end - 0.06, d.end, progress);
      const o = fadeIn * fadeOut;
      g.visible = o > 0.003;
      if (!g.visible) return;
      const local = clamp01((progress - d.start) / Math.max(0.001, d.end - d.start));
      const drift = i === beats.length - 1 ? lerp(1.4, 0, smooth(0, 0.5, local)) : lerp(1.2, -0.8, local);
      g.position.copy(d.base).addScaledVector(d.outward, -drift);
      // Hold each headline on the camera's eye line; the final one sits higher so the
      // HTML line and actions beneath it have the lower third to themselves
      g.position.y = heightAt(u) + (i === beats.length - 1 ? 0.42 : -0.1);
      tmp.copy(rig.position);
      tmp.y = g.position.y;
      g.lookAt(tmp);
      g.scale.setScalar(d.fit * lerp(0.96, 1, o));
      g.children.forEach((t) => {
        t.fillOpacity = o;
      });
    });

    // Core rings turn slowly; dust drifts and streams with scroll velocity
    rings.forEach((r) => {
      r.rotation.x = Math.PI / 2 + Math.sin(elapsed * r.userData.sx * 4) * 0.35;
      r.rotation.z += r.userData.sz * dt;
    });
    dust.forEach((pts, i) => {
      const d = pts.userData;
      pts.rotation.y += d.speed * dt - velocity * (0.6 + i * 0.45) * dt;
      pts.position.y = Math.sin(elapsed * 0.25 + d.phase) * 0.35;
    });
    beamMat.opacity = 0.55 + Math.sin(elapsed * 1.3) * 0.12;

    // Ready once every headline has its glyph layout: measure, fit, tell the page
    if (!readyFired && texts.every((t) => t.textRenderInfo)) {
      readyFired = true;
      beats.forEach(measure);
      fitText();
      onReady?.();
    }

    renderer.render(scene, camera);
    onFrame?.(progress);

    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true;
    timer.reset?.();
    raf = requestAnimationFrame(frame);
  }
  start();

  // ------------------------------------------------------------------ dispose
  return function dispose() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    st.kill();
    timer.dispose?.();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    texts.forEach((t) => t.dispose());
    columns.dispose();
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    room.traverse?.((o) => {
      o.geometry?.dispose?.();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      mats.forEach((m) => m.dispose?.());
    });
    pmrem.dispose();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}

/** True when this browser can create a WebGL context. */
export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}
