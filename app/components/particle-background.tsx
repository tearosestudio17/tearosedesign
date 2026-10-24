"use client";

import { useEffect, useRef, type RefObject } from "react";
import { clamp, getStoryTimelines, type ShapeTimeline } from "@/lib/particle-timeline";

export interface ParticleBackgroundOptions {
  /** Desktop count (capped at 1600); screens below 700px use about a third. */
  particleCount?: number;
  accentColor?: string;
  /** Wave animation speed multiplier. */
  waveSpeed?: number;
  /** Fraction of each scroll range at which its morph completes. */
  morphEnd?: number;
  text?: string;
  /** Defaults to the scroll section's computed font family. */
  fontFamily?: string;
  fontWeight?: number | string;
  /** Optional visual tuning for pages that use the particle field as the main artwork. */
  frameRate?: number;
  visualScale?: number;
  accentFrequency?: number;
  /** Horizontal center of the brewing formation, as a fraction of the viewport. */
  bloomX?: number;
}

interface ParticleBackgroundProps extends ParticleBackgroundOptions {
  trackRef: RefObject<HTMLElement | null>;
  shapeCount?: number;
  introAnimation?: boolean;
  onProgress?: (morph: number, reducedMotion: boolean, progress: number, timeline: ShapeTimeline) => void;
}

interface Point { x: number; y: number }
interface ShapeTarget extends Point { size: number; alpha: number; accent: number }

interface Particle {
  u: number;
  v: number;
  bx: number;
  by: number;
  phase: number;
  speed: number;
  amplitude: number;
  size: number;
  alpha: number;
  delay: number;
  depth: number;
  hot: boolean;
  index: number;
  sphereX: number;
  sphereY: number;
  sphereZ: number;
  textTarget: Point | null;
  repelX: number;
  repelY: number;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);
const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function ParticleBackground({
  trackRef,
  particleCount = 1600,
  accentColor = "var(--accent)",
  waveSpeed = 1,
  morphEnd = 0.6,
  text = "Tea Rose",
  fontFamily,
  fontWeight = 700,
  frameRate = 20,
  visualScale = 1,
  accentFrequency = 0.004,
  bloomX,
  shapeCount = 2,
  introAnimation = false,
  onProgress,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !track) return;

    const artElements = Array.from({ length: 5 }, (_, index) =>
      track.querySelector<HTMLElement>(`[data-particle-art="${index}"]`));
    const artBounds: (DOMRect | undefined)[] = [];

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let cupBrewCount = 0;
    let cupDotRows = 5;
    let cupDotColumns = 1;
    let frameId: number | null = null;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let smoothX = 0.5;
    let smoothY = 0.5;
    let pointerActive = false;
    let disposed = false;
    let inView = true;
    let lastFrameTime = -Infinity;
    let lastProgress = -1;
    let lastReducedMotion = reducedMotion;
    const stages = Number.isFinite(shapeCount) ? Math.round(clamp(shapeCount, 2, 5)) : 2;
    const progress = progressRef.current;
    const speed = Number.isFinite(waveSpeed) ? waveSpeed : 1;
    // Keep animation affordable on machines with fewer CPU cores or less memory.
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPower = (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)
      || (deviceMemory !== undefined && deviceMemory <= 4);
    const maxParticles = lowPower ? 600 : 1600;
    const targetFrameRate = Number.isFinite(frameRate) ? clamp(frameRate, 10, 60) : 20;
    const frameInterval = 1000 / (lowPower ? Math.min(30, targetFrameRate) : targetFrameRate);
    const visualMultiplier = Number.isFinite(visualScale) ? clamp(visualScale, 0.5, 3) : 1;
    const accentChance = Number.isFinite(accentFrequency) ? clamp(accentFrequency, 0, 0.25) : 0.004;
    // Bound both simulation cost and canvas memory, including on large monitors.
    const count = Number.isFinite(particleCount)
      ? clamp(Math.floor(particleCount), 0, maxParticles) : maxParticles;
    // Resolve CSS variables before handing the color to canvas.
    const canvasStyle = window.getComputedStyle(canvas);
    const accent = canvasStyle.color;
    const particleColor = canvasStyle.getPropertyValue("--particle").trim();

    function build() {
      const small = width < 700;
      const total = small ? Math.round(count / 3) : count;
      const columns = Math.max(2, Math.round(Math.sqrt(total * (small ? 56 / 44 : 104 / 70))));
      const rows = Math.max(2, Math.ceil(total / columns));
      particles = Array.from({ length: total }, (_, index): Particle => {
        const big = Math.random() < 0.035;
        const sphereY = 1 - 2 * ((index + 0.5) / total);
        const sphereRadius = Math.sqrt(1 - sphereY * sphereY);
        const sphereAngle = index * Math.PI * (3 - Math.sqrt(5));
        return {
          u: ((index % columns) / (columns - 1)) * 2 - 1,
          v: Math.floor(index / columns) / (rows - 1),
          bx: Math.random(), by: Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: random(0.15, 0.5), amplitude: random(4, 26),
          size: big ? random(2.2, 4.5) : random(0.5, 1.4),
          alpha: big ? random(0.12, 0.3) : random(0.25, 0.8),
          delay: Math.random() * 0.4, depth: Math.random(),
          hot: Math.random() < accentChance,
          index,
          sphereX: Math.cos(sphereAngle) * sphereRadius,
          sphereY,
          sphereZ: Math.sin(sphereAngle) * sphereRadius,
          textTarget: null, repelX: 0, repelY: 0,
        };
      });
      cupBrewCount = Math.floor(total * 0.72);
      const cupFillCount = Math.ceil(cupBrewCount * 0.3);
      cupDotRows = Math.max(5, Math.round(Math.sqrt(cupFillCount * 0.55)));
      cupDotColumns = Math.max(1, Math.ceil(cupFillCount / cupDotRows));
      if (stages === 5 && !introAnimation) buildTextTargets();
    }

    function buildTextTargets() {
      const buffer = document.createElement("canvas");
      const sampleScale = Math.min(1, Math.sqrt(1_000_000 / (width * height)));
      buffer.width = Math.max(1, Math.round(width * sampleScale));
      buffer.height = Math.max(1, Math.round(height * sampleScale));
      const ctx = buffer.getContext("2d", { willReadFrequently: true });
      if (!ctx || !canvas || !text.trim() || !particles.length) {
        for (const p of particles) p.textTarget = null;
        buffer.width = buffer.height = 0;
        return;
      }
      ctx.setTransform(sampleScale, 0, 0, sampleScale, 0, 0);
      const family = fontFamily ?? window.getComputedStyle(canvas).fontFamily;
      ctx.font = `${fontWeight} 100px ${family}`;
      const measuredWidth = ctx.measureText(text).width;
      const sideArt = introAnimation && width >= 1024;
      const fontSize = Math.min(width * (sideArt ? 0.36 : width < 700 ? 0.74 : 0.7) * 100 / Math.max(1, measuredWidth), height * 0.24);
      ctx.font = `${fontWeight} ${fontSize}px ${family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = particleColor;
      const metrics = ctx.measureText(text);
      const baseline = height / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      ctx.fillText(text, width * (sideArt ? 0.77 : 0.5), baseline);
      const { data } = ctx.getImageData(0, 0, buffer.width, buffer.height);
      const points: Point[] = [];
      // Sample a regular grid; retain at least 20% of the pool as background stars.
      const step = Math.max(1, Math.round((width < 700 ? 2 : 3) * sampleScale));
      for (let y = 0; y < buffer.height; y += step) {
        for (let x = 0; x < buffer.width; x += step) {
          if (data[(y * buffer.width + x) * 4 + 3] > 160) points.push({ x: x / sampleScale, y: y / sampleScale });
        }
      }
      for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [points[i], points[j]] = [points[j], points[i]];
      }
      const targetCount = Math.min(points.length, Math.floor(particles.length * 0.8));
      // Shuffle particle identities as well as targets, preserving each particle's morph delay.
      const identities = particles.map((_, index) => index);
      for (let i = identities.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [identities[i], identities[j]] = [identities[j], identities[i]];
      }
      for (const p of particles) p.textTarget = null;
      for (let i = 0; i < targetCount; i++) particles[identities[i]].textTarget = points[i];
      // Release the temporary raster's backing store after extracting the targets.
      buffer.width = buffer.height = 0;
      requestFrame();
    }

    function project(x: number, y: number, z: number, radius: number): ShapeTarget {
      const perspective = 3.8 / (3.8 + z);
      const near = clamp((1.5 - z) / 3);
      return {
        x: width * (introAnimation && width >= 1024 ? 0.77 : 0.5) + x * radius * perspective,
        y: height / 2 + y * radius * perspective,
        size: 0.55 + near * 1.35,
        alpha: 0.2 + near * 0.65,
        accent: 0,
      };
    }

    function newShapeTarget(shape: number, p: Particle, time: number, star: ShapeTarget): ShapeTarget {
      const radius = Math.min(width * (introAnimation && width >= 1024 ? 0.17 : 0.3), height * (shape === 3 ? 0.24 : 0.29));
      if (shape === 2) {
        const ringCount = Math.floor(particles.length * 0.24);
        if (p.index >= ringCount) return star;
        // Keep a few brand-colored orbiters when the mobile pool's random accents are sparse.
        const hot = p.hot || p.index % Math.max(1, Math.floor(ringCount / 3)) === 0;
        const ring = hot ? 2 : p.index % 3;
        const angle = (Math.floor(p.index / 3) / Math.max(1, Math.ceil(ringCount / 3))) * Math.PI * 2
          + time * (hot ? 0.38 : 0.09) + ring * 0.4;
        const ringRadius = 0.62 + ring * 0.28;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        const target = project(x, z * 0.48 + x * 0.12, z * 0.86, radius);
        target.accent = Number(hot);
        return target;
      }
      if (shape === 3) {
        const rotation = time * 0.12 + (smoothX - 0.5) * 0.4;
        const tilt = -0.18 + (smoothY - 0.5) * 0.35;
        const x = p.sphereX * Math.cos(rotation) + p.sphereZ * Math.sin(rotation);
        const z = -p.sphereX * Math.sin(rotation) + p.sphereZ * Math.cos(rotation);
        return project(x, p.sphereY * Math.cos(tilt) - z * Math.sin(tilt),
          p.sphereY * Math.sin(tilt) + z * Math.cos(tilt), radius);
      }
      if (!p.textTarget) return star;
      return {
        x: p.textTarget.x + p.repelX, y: p.textTarget.y + p.repelY,
        size: width < 700 ? 1.2 : 1.45, alpha: 0.9, accent: Number(p.hot),
      };
    }

    // The studio story reuses this canvas and particle pool for every step.
    function processTarget(shape: number, p: Particle, time: number, star: ShapeTarget): ShapeTarget {
      if (!introAnimation) return newShapeTarget(shape, p, time, star);
      const total = Math.floor(particles.length * 0.7);
      const compact = width < 1024;
      // Each formation lives in the empty right column, just like the About cup.
      const bounds = artBounds[shape];
      const centerX = bounds ? bounds.left + bounds.width / 2 : width * 0.76;
      const centerY = bounds ? bounds.top + bounds.height / 2 : height * 0.53;
      const artRadius = bounds ? Math.min(bounds.width * 0.46, bounds.height * 0.46)
        : Math.min(width * 0.2, height * 0.28);
      if (p.index >= total) {
        // Keep a continuous pixel landscape beneath each main formation.
        const drift = Math.sin(p.bx * 7 + time * 0.3 + shape) * 28;
        return {
          ...star,
          x: p.bx * width + (smoothX - 0.5) * -18 * p.depth,
          y: p.by * height + drift,
          size: compact ? 1 : 1.3,
          alpha: 0.18 + p.depth * 0.24,
        };
      }
      const t = p.index / Math.max(1, total - 1);
      let x: number;
      let y: number;
      let alpha = 0.65;
      if (shape === 1) {
        // Listen: a wide sound field, with voices flowing into a shared rhythm.
        const strand = p.index % 7;
        const along = t * 2 - 1;
        x = along;
        y = Math.sin(along * 5 - time * 0.85 + strand * 0.2)
          * (0.18 + 0.36 * Math.cos(along)) + (strand - 3) * 0.09;
        alpha = 0.45 + 0.35 * Math.sin(t * Math.PI);
      } else if (shape === 2) {
        // Research resolves into one precise dotted square and its measured grid.
        if (t < 0.22) {
          const edge = t / 0.22 * 4;
          const along = (edge % 1) * 2 - 1;
          const side = Math.floor(edge);
          x = side === 0 ? along : side === 1 ? 1 : side === 2 ? -along : -1;
          y = side === 0 ? -1 : side === 1 ? along : side === 2 ? 1 : -along;
          alpha = 0.85;
        } else {
          const columns = Math.ceil(Math.sqrt(total * 0.78));
          const local = Math.max(0, p.index - Math.ceil((total - 1) * 0.22));
          x = (local % columns) / Math.max(1, columns - 1) * 1.8 - 0.9;
          y = Math.floor(local / columns) / Math.max(1, columns - 1) * 1.8 - 0.9;
          const scan = Math.sin(time * 0.65) * 0.9;
          alpha = 0.3 + 0.55 * Math.max(0, 1 - Math.abs(x - scan) * 4);
        }
      } else if (shape === 3) {
        // A logo construction study: geometry, proportion, and a drawn curve.
        // Every mark is part of the existing particle pool, including the guides.
        if (t < 0.5) {
          const position = t / 0.5 * 4;
          const circle = Math.floor(position);
          const angle = (position % 1) * Math.PI * 2;
          const direction = circle * Math.PI / 2;
          const breathe = Math.sin(time * 0.65) * 0.025;
          x = Math.cos(direction) * 0.3 + Math.cos(angle) * (0.55 + breathe);
          y = Math.sin(direction) * 0.3 + Math.sin(angle) * (0.55 + breathe);
          alpha = 0.65 + 0.25 * Math.sin(angle - time * 0.7);
        } else if (t < 0.68) {
          const edge = (t - 0.5) / 0.18 * 4;
          const along = (edge % 1) * 2 - 1;
          const side = Math.floor(edge);
          x = side === 0 ? along : side === 1 ? 1 : side === 2 ? -along : -1;
          y = side === 0 ? -1 : side === 1 ? along : side === 2 ? 1 : -along;
          alpha = 0.35;
        } else if (t < 0.86) {
          const u = (t - 0.68) / 0.18;
          const v = 1 - u;
          // Cubic Bezier: the same curve a designer would shape with a pen tool.
          x = -0.95 * v * v * v - 0.9 * v * v * u + 0.9 * v * u * u + 0.95 * u * u * u;
          y = 0.7 * v * v * v - 3 * v * v * u + 3 * v * u * u - 0.7 * u * u * u;
          alpha = 0.85;
        } else {
          const grid = (t - 0.86) / 0.14 * 10;
          const line = Math.min(9, Math.floor(grid));
          const along = (grid % 1) * 2 - 1;
          const cross = (line % 5) * 0.5 - 1;
          x = line < 5 ? along : cross;
          y = line < 5 ? cross : along;
          alpha = 0.16;
        }
      } else {
        // Launch: expanding broadcast rings spread beyond the viewport.
        const ring = p.index % 6;
        const travel = (ring / 6 + time * 0.055) % 1;
        const angle = t * Math.PI * 2;
        x = Math.cos(angle) * travel;
        y = Math.sin(angle) * travel;
        alpha = Math.sin(travel * Math.PI) * 0.85;
      }
      return {
        x: centerX + x * artRadius + (smoothX - 0.5) * -16,
        y: centerY + y * artRadius + (smoothY - 0.5) * -12,
        size: compact ? 1.2 : 1.8,
        alpha,
        accent: shape === 3
          ? Number((t >= 0.68 && t < 0.86) || (t < 0.5 && Math.sin(t * Math.PI * 16 - time * 0.7) > 0.85))
          : Number(p.hot || p.index % 7 === 0),
      };
    }

    function aboutTarget(p: Particle, time: number, star: ShapeTarget): ShapeTarget {
      // A simple dotted teacup: open rim, flat base, attached handle, saucer, and steam.
      const brewCount = cupBrewCount;
      if (p.index >= brewCount) return { ...star, alpha: star.alpha * 0.55 };
      const t = p.index / Math.max(1, brewCount - 1);
      const compact = width < 1024;
      const bounds = artBounds[0];
      const scale = bounds ? Math.min(bounds.width * 0.36, bounds.height * 0.34)
        : Math.min(width * (compact ? 0.1 : 0.17), height * 0.28);
      const centerX = bloomX === undefined ? (compact ? 0.84 : 0.77)
        : width < 760 ? 0.5 : clamp(bloomX, 0.1, 0.9);
      let x: number;
      let y: number;
      let accent = 0;
      let size = compact ? 1.2 : 1.55;
      if (t < 0.3) {
        // A lightly jittered grid keeps the bowl dotted without visible streaks.
        const depth = (Math.floor(p.index / cupDotColumns) + 0.5 + (p.by - 0.5) * 0.6) / cupDotRows;
        const across = ((p.index % cupDotColumns) + 0.5 + (p.bx - 0.5) * 0.6) / cupDotColumns;
        const halfWidth = 0.78 - 0.22 * depth - 0.1 * depth * depth;
        x = (across * 2 - 1) * halfWidth;
        y = -0.22 + depth * 0.97;
        accent = Number(depth < 0.12 && p.index % 8 === 0);
        size = compact ? 1.1 : 1.4;
      } else if (t < 0.4) {
        const angle = p.index * 2.399963229728653;
        const radius = Math.sqrt((t - 0.3) / 0.1);
        x = Math.cos(angle) * radius * 0.78;
        y = -0.22 + Math.sin(angle) * radius * 0.11
          + Math.sin(time * 1.4 + x * 7) * 0.006;
        accent = Number(p.index % 3 !== 0);
      } else if (t < 0.5) {
        const angle = ((t - 0.4) / 0.1) * Math.PI * 2;
        x = Math.cos(angle) * 0.82;
        y = -0.22 + Math.sin(angle) * 0.14;
        accent = Number(Math.sin(angle) < 0 && p.index % 5 === 0);
      } else if (t < 0.75) {
        const edge = (t - 0.5) / 0.25;
        if (edge < 0.38 || edge >= 0.62) {
          const depth = edge < 0.38 ? edge / 0.38 : 1 - (edge - 0.62) / 0.38;
          x = (edge < 0.38 ? -1 : 1) * (0.82 - 0.22 * depth - 0.1 * depth * depth);
          y = -0.22 + depth * 0.97;
        } else {
          const across = (edge - 0.38) / 0.24;
          x = -0.5 + across;
          y = 0.75 + Math.sin(across * Math.PI) * 0.035;
        }
        size = compact ? 1.4 : 1.75;
      } else if (t < 0.85) {
        const u = (t - 0.75) / 0.1;
        const inverse = 1 - u;
        // One rounded loop joins the upper rim to the side of the cup.
        x = inverse ** 3 * 0.82 + 3 * inverse ** 2 * u * 1.28
          + 3 * inverse * u ** 2 * 1.5 + u ** 3 * 0.61;
        y = inverse ** 3 * -0.2 + 3 * inverse ** 2 * u * -0.38
          + 3 * inverse * u ** 2 * 0.55 + u ** 3 * 0.53;
        size = compact ? 1.4 : 1.75;
      } else if (t < 0.92) {
        const angle = ((t - 0.85) / 0.07) * Math.PI * 2;
        x = Math.cos(angle);
        y = 0.96 + Math.sin(angle) * 0.055;
      } else {
        const strand = p.index % 2;
        const rise = (t - 0.92) / 0.08;
        x = (strand ? 0.17 : -0.17)
          + Math.sin(rise * 7 - time * 0.7 + strand * 1.7) * (0.05 + rise * 0.1);
        y = -0.48 - rise * 1.1;
        accent = Number(strand === 1);
      }
      return {
        x: (bounds ? bounds.left + bounds.width / 2 : width * centerX) + x * scale + (smoothX - 0.5) * -12,
        y: (bounds ? bounds.top + bounds.height * 0.58 : height * (compact ? 0.24 : 0.57)) + y * scale + (smoothY - 0.5) * -8,
        size,
        alpha: 0.95,
        accent,
      };
    }

    function storyTarget(stage: number, p: Particle, time: number, star: ShapeTarget) {
      if (stage === 0) return star;
      if (stage === 1) return aboutTarget(p, time, star);
      return processTarget(stage - 1, p, time, star);
    }

    function readScroll() {
      if (!track) return;
      const distance = track.offsetHeight - window.innerHeight;
      progress.target = clamp(-track.getBoundingClientRect().top / Math.max(1, distance));
      requestFrame();
    }

    function resize() {
      if (!canvas || !context) return;
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      if (width === nextWidth && height === nextHeight) return;
      width = nextWidth;
      height = nextHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.25, Math.sqrt(2_000_000 / (width * height)));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      readScroll();
    }

    function pointerMove(event: PointerEvent) {
      if (reducedMotion) return;
      mouseX = event.clientX / width;
      mouseY = event.clientY / height;
      pointerActive = true;
    }

    function pointerLeave() {
      pointerActive = false;
    }

    function requestFrame() {
      if (!disposed && !document.hidden && inView && frameId === null) {
        frameId = window.requestAnimationFrame(frame);
      }
    }

    function syncVisibility() {
      if (document.hidden || !inView) {
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        frameId = null;
      } else {
        lastFrameTime = -Infinity;
        readScroll();
      }
    }

    function frame(timestamp: number) {
      frameId = null;
      if (!context || disposed || document.hidden || !inView) return;
      if (!reducedMotion && timestamp - lastFrameTime < frameInterval - 1) {
        requestFrame();
        return;
      }
      const elapsed = Number.isFinite(lastFrameTime) ? timestamp - lastFrameTime : frameInterval;
      lastFrameTime = timestamp;
      const smoothing = 1 - Math.pow(1 - 0.085, elapsed / (1000 / 60));
      progress.current = reducedMotion ? progress.target
        : progress.current + (progress.target - progress.current) * smoothing;
      if (Math.abs(progress.target - progress.current) < 0.00001) progress.current = progress.target;
      smoothX += (mouseX - smoothX) * 0.05;
      smoothY += (mouseY - smoothY) * 0.05;
      const { shape: timeline, section } = getStoryTimelines(progress.current, stages, morphEnd, introAnimation);
      const morph = timeline.firstMorph;
      if (progress.current !== lastProgress || reducedMotion !== lastReducedMotion) {
        onProgress?.(section.firstMorph, reducedMotion, progress.current, section);
        lastProgress = progress.current;
        lastReducedMotion = reducedMotion;
      }

      // Measure the incoming and outgoing artwork slots once, before drawing dots.
      if (introAnimation) {
        for (const index of [section.from - 1, section.to - 1]) {
          if (index >= 0) artBounds[index] = artElements[index]?.getBoundingClientRect();
        }
      }

      const time = reducedMotion ? 0 : timestamp / 1000;
      const waveTime = time * speed;
      const focal = Math.min(width * 0.3, 560) * (width < 700 ? 1.6 : 1);
      context.clearRect(0, 0, width, height);
      for (const p of particles) {
        const chaosX = p.bx * width + Math.sin(time * p.speed + p.phase) * p.amplitude
          + (smoothX - 0.5) * -40 * p.depth;
        const chaosY = p.by * height + Math.cos(time * p.speed * 0.8 + p.phase) * p.amplitude
          + (smoothY - 0.5) * -40 * p.depth;
        let drawX: number;
        let drawY: number;
        let size: number;
        let alpha: number;
        let accentMix: number;
        if (introAnimation) {
          // One pool, one timeline: starfield → cup → Listen → Research → Create → Launch.
          // A dot always starts where the previous formation placed it.
          const star: ShapeTarget = { x: chaosX, y: chaosY, size: p.size, alpha: p.alpha, accent: 0 };
          const amount = reducedMotion ? Number(section.morph >= 0.5)
            : ease(clamp((section.morph - p.delay) / 0.6));
          // During a hold, calculate only the visible formation.
          const from = storyTarget(amount === 1 ? section.to : section.from, p, time, star);
          const to = amount === 0 || amount === 1 ? from : storyTarget(section.to, p, time, star);
          drawX = from.x + (to.x - from.x) * amount;
          drawY = from.y + (to.y - from.y) * amount;
          size = from.size + (to.size - from.size) * amount;
          alpha = from.alpha + (to.alpha - from.alpha) * amount;
          accentMix = from.accent + (to.accent - from.accent) * amount;
        } else {
          const depth = 1.15 + (1 - p.v) * 9.6;
          const x = p.u * 8.2;
          const wave = 0.3 * Math.sin(x * 0.55 + waveTime * 0.55 + depth * 0.35)
            + 0.2 * Math.cos(depth * 0.7 - waveTime * 0.45 + x * 0.18)
            + 0.08 * Math.sin(x * 1.7 + depth * 1.3 + waveTime * 0.9);
          const scale = focal / depth;
          const grid: ShapeTarget = {
            x: width / 2 + x * scale + (smoothX - 0.5) * -30,
            y: height * 0.34 + (1.55 - wave) * scale + (smoothY - 0.5) * -12,
            size: clamp((scale / focal) * 1.5, 0.35, 2.1) * (width < 700 ? 0.8 : 1),
            alpha: clamp(0.18 + (1 - depth / 10.8) * 0.8, 0.12, 0.9),
            accent: Number(p.hot),
          };
          const blend = reducedMotion ? Number(morph >= 0.5) : ease(clamp((morph - p.delay) / 0.6));
          drawX = chaosX + (grid.x - chaosX) * blend;
          drawY = chaosY + (grid.y - chaosY) * blend;
          size = p.size + (grid.size - p.size) * blend;
          alpha = p.alpha + (grid.alpha - p.alpha) * blend;
          if (!reducedMotion) alpha *= 1 - 0.25 * Math.sin(time * p.speed * 3 + p.phase) * (1 - blend);
          accentMix = Number(p.hot && blend > 0.5);
          if (timeline.position > 1) {
            if (p.textTarget) {
              const dx = p.textTarget.x - mouseX * width;
              const dy = p.textTarget.y - mouseY * height;
              const distance = Math.hypot(dx, dy);
              const repelRadius = width < 700 ? 65 : 110;
              const force = !reducedMotion && pointerActive && timeline.to === 4
                ? clamp(1 - distance / repelRadius) * 65 : 0;
              p.repelX += ((distance > 0 ? dx / distance * force : force) - p.repelX) * 0.12;
              p.repelY += ((distance > 0 ? dy / distance * force : 0) - p.repelY) * 0.12;
            }
            const star: ShapeTarget = { x: chaosX, y: chaosY, size: Math.min(p.size, 1.2), alpha: p.alpha * 0.16, accent: 0 };
            const from = timeline.from === 1 ? grid : newShapeTarget(timeline.from, p, time, star);
            const to = newShapeTarget(timeline.to, p, time, star);
            const amount = reducedMotion ? Number(timeline.morph >= 0.5)
              : ease(clamp((timeline.morph - p.delay) / 0.6));
            drawX = from.x + (to.x - from.x) * amount;
            drawY = from.y + (to.y - from.y) * amount;
            size = from.size + (to.size - from.size) * amount;
            alpha = from.alpha + (to.alpha - from.alpha) * amount;
            accentMix = from.accent + (to.accent - from.accent) * amount;
          }
        }
        if (drawX < -10 || drawX > width + 10 || drawY < -10 || drawY > height + 10) continue;
        context.globalAlpha = clamp(alpha * visualMultiplier * (accentMix > 0.5 ? 1.1 : 1));
        context.fillStyle = accentMix > 0.5 ? accent : particleColor;
        size *= Math.sqrt(visualMultiplier);
        if (size > 2) {
          context.beginPath();
          context.arc(drawX, drawY, size, 0, Math.PI * 2);
          context.fill();
        } else context.fillRect(drawX - size / 2, drawY - size / 2, size, size);
      }
      context.globalAlpha = 1;
      // Reduced motion draws only on scroll, resize, or preference changes.
      if (!reducedMotion) requestFrame();
    }

    function motionChange() {
      reducedMotion = motionQuery.matches;
      mouseX = mouseY = smoothX = smoothY = 0.5;
      pointerActive = false;
      for (const p of particles) p.repelX = p.repelY = 0;
      requestFrame();
    }

    resize();
    progress.current = progress.target;
    track.addEventListener("scroll", requestFrame, true);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("pointermove", pointerMove, { passive: true });
    document.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("blur", pointerLeave);
    motionQuery.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new ResizeObserver(readScroll);
    observer.observe(track);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncVisibility();
    });
    intersectionObserver.observe(track);
    if (stages === 5 && !introAnimation) {
      void document.fonts.ready.then(() => {
        if (!disposed) buildTextTargets();
      });
    }

    return () => {
      disposed = true;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      track.removeEventListener("scroll", requestFrame, true);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("blur", pointerLeave);
      motionQuery.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
      intersectionObserver.disconnect();
      canvas.width = canvas.height = 0;
    };
  }, [particleCount, accentColor, waveSpeed, morphEnd, text, fontFamily, fontWeight, frameRate, visualScale, accentFrequency, bloomX, shapeCount, introAnimation, trackRef, onProgress]);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-0 block h-dvh w-full"
      style={{ color: accentColor }} />
  );
}
