"use client";

import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";

/**
 * A specular highlight that rides the button's rounded edge and steers toward
 * the pointer, fading in as the cursor approaches. Adapted from React Bits'
 * SpecularButton, which ships as a self-contained `<button>`; here it is only
 * the effect layer, because the buttons that use it are mostly `<a>` links and
 * could not be that element. `Button`/`ButtonLink` supply the element, this
 * supplies the shine.
 *
 * ## Things that will silently break it
 *
 * 1. The canvas is inset by `-PAD` so the glow can bleed past the button's box.
 *    An ancestor with `overflow: hidden` clips the bloom off and leaves a bare
 *    stroke. The rim also sits *under* the label, which is why `Button` gives
 *    the label `z-10`.
 *
 * 2. The shader measures the edge in device pixels against `uCenter`/`uHalfSize`
 *    taken from `getBoundingClientRect()`. Any CSS transform that scales the
 *    button (rather than translating it) desynchronises the SDF from the painted
 *    border, and the light drifts off the edge.
 */

/** How far outside the button the canvas extends, so the bloom is not cut off. */
const PAD = 20;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  // Base stroke hugging the edge for a sense of thickness. This is the resting
  // border — here it is the brand pink, so the button reads as outlined even
  // with the pointer far away and the specular contribution at zero.
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  // Symmetric specular: the edges facing toward/away from the light both
  // catch a streak. The angular window (size + fade) is measured with an
  // elliptical normal so it varies continuously along straight edges.
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

type SpecularRimProps = {
  /** Corner radius in px. Clamped to a pill against the button's short side. */
  radius?: number;
  /** The sweeping highlight. White reads as light *on* the border. */
  lineColor?: string;
  /** The resting edge stroke — the button's visible border colour. */
  baseColor?: string;
  intensity?: number;
  /** Angular size of the streak, in degrees. */
  shineSize?: number;
  /** How gradually the streak fades at its ends, in degrees. */
  shineFade?: number;
  thickness?: number;
  /** Idle sweep speed, used until the pointer has moved. */
  speed?: number;
  /** Distance in px within which the shine fades in as the cursor nears. */
  proximity?: number;
};

export function SpecularRim({
  radius = 999,
  lineColor = "#ffffff",
  baseColor = "#e83e8c",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  proximity = 250,
}: SpecularRimProps) {
  const hostRef = useRef<HTMLSpanElement | null>(null);

  // The animation reads these every frame but must not tear down the GL context
  // when they change, so they reach it through a ref rather than the effect's
  // deps. Synced in an effect, not during render: a render can be discarded, and
  // writing the ref there would leave it holding values from an abandoned pass.
  const propsRef = useRef({
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    proximity,
  });
  useEffect(() => {
    propsRef.current = {
      radius,
      lineColor,
      baseColor,
      intensity,
      shineSize,
      shineFade,
      thickness,
      speed,
      proximity,
    };
  }, [
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    proximity,
  ]);

  useEffect(() => {
    const host = hostRef.current;
    // The rim is absolutely positioned against the button, so its offsetParent
    // *is* the button — that is the box the shader traces.
    const btn = host?.offsetParent as HTMLElement | null;
    if (!host || !btn) return;

    // A perpetually sweeping light is precisely what this setting asks us to
    // stop doing. Fall back to the plain CSS border the button already carries.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.91, 0.24, 0.55] },
        uIntensity: { value: 1 },
        uShineSize: { value: 0.17 },
        uShineFade: { value: 0.7 },
        uThickness: { value: 1 },
        uBaseWidth: { value: dpr },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    host.appendChild(gl.canvas);

    const sizeRef = { w: 1, h: 1 };
    // Cached instead of re-read from getBoundingClientRect() inside the
    // pointermove handler below — with several rims on the page, reading
    // layout on every raw mouse-move event forces repeated synchronous layout
    // recalculation (thrashing) on the main thread.
    const rectRef = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    const resize = () => {
      // Fractional size + explicit centre keep the SDF pinned to the exact CSS
      // border, instead of drifting up to a pixel from offsetWidth rounding.
      const rect = btn.getBoundingClientRect();
      rectRef.left = rect.left;
      rectRef.top = rect.top;
      rectRef.right = rect.right;
      rectRef.bottom = rect.bottom;
      const { width: w, height: h } = rect;
      rectRef.width = w;
      rectRef.height = h;
      if (w === 0 || h === 0) return;
      sizeRef.w = w;
      sizeRef.h = h;
      renderer.setSize(w + PAD * 2, h + PAD * 2);
      program.uniforms.uCenter.value = [
        (PAD + w / 2) * dpr,
        (PAD + h / 2) * dpr,
      ];
      program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(btn);
    resize();
    // The cached rect tracks viewport position, so it also needs refreshing
    // when the page scrolls under the (fixed) pointer coordinates.
    window.addEventListener("scroll", resize, { passive: true });

    // Light angle steers toward the pointer (anywhere on the page) and falls
    // back to a slow sweep when the pointer hasn't moved yet. This listener is
    // on `window` — every rim on the page receives every pointer move — so it
    // stays as cheap as possible: no layout reads, and a fast-reject once the
    // pointer is well outside the proximity radius, before any trig runs.
    let pointerAngle: number | null = null;
    let proximityT = 0;
    const onPointerMove = (e: PointerEvent) => {
      const dx = Math.max(rectRef.left - e.clientX, 0, e.clientX - rectRef.right);
      const dy = Math.max(rectRef.top - e.clientY, 0, e.clientY - rectRef.bottom);

      if (dx > propsRef.current.proximity || dy > propsRef.current.proximity) {
        if (proximityT !== 0) proximityT = 0;
        return;
      }

      const dist = Math.hypot(dx, dy);
      const cx = rectRef.left + rectRef.width / 2;
      const cy = rectRef.top + rectRef.height / 2;
      // Over the button itself the light settles on the diagonal (framing the
      // corners) and gently sways with the cursor position within the button.
      if (dist === 0) {
        const nx = (e.clientX - cx) / (rectRef.width / 2);
        const ny = (cy - e.clientY) / (rectRef.height / 2);
        pointerAngle =
          Math.atan2(2 / rectRef.height, -2 / rectRef.width) + nx * 0.3 + ny * 0.15;
      } else {
        pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
      }
      const t = Math.max(0, 1 - dist / Math.max(propsRef.current.proximity, 1));
      proximityT = t * t * (3 - 2 * t);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let angle = 2.4;
    let idleAngle = 2.4;
    let bright = 0;
    let last = performance.now();
    let raf = 0;

    const lineC = new Color();
    const baseC = new Color();

    const update = (now: number) => {
      raf = requestAnimationFrame(update);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = propsRef.current;

      idleAngle += p.speed * dt;
      const target = pointerAngle ?? idleAngle;
      const diff =
        ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * 7));

      // The shine fades in with pointer proximity; at rest only the pink base
      // stroke remains, which is the button's border.
      bright += (proximityT - bright) * (1 - Math.exp(-dt * 8));

      lineC.set(p.lineColor);
      baseC.set(p.baseColor);
      program.uniforms.uAngle.value = angle;
      program.uniforms.uRadius.value =
        Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
      program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
      program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
      program.uniforms.uIntensity.value = p.intensity * bright;
      program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
      program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
      program.uniforms.uThickness.value = p.thickness * dpr;
      renderer.render({ scene: mesh });
    };

    // Six of these live on the page at once. Left running, that is six WebGL
    // contexts and six rAF loops burning frames for buttons nobody can see, so
    // each parks itself while scrolled out of view.
    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(update);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: `${PAD}px` },
    );
    io.observe(btn);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", resize);
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <span
      ref={hostRef}
      aria-hidden
      className="specular-rim pointer-events-none absolute z-0"
      style={{ inset: -PAD }}
    />
  );
}
