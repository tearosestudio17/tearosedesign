"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import { projects, type Project } from "@/lib/work-content";
import { StudioLink } from "./studio-navigation";

type Spread = { kind: "contents" | "opening" | "gallery" | "story" | "outcome" | "thanks"; project: number; start?: number };
const spreads: Spread[] = [{ kind: "contents", project: -1 }];
projects.forEach((project, index) => {
  spreads.push({ kind: "opening", project: index });
  // The opening page's hero image uses the first photo; any remaining photos
  // (up to 4, stacked 2-per-page) share a single extra spread so the book
  // doesn't balloon, while still staying uncropped.
  const extraImages = Math.max(0, (project.images?.length ?? 0) - 1);
  if (extraImages > 0) spreads.push({ kind: "gallery", project: index, start: 1 });
  for (let start = 1; start < project.sections.length; start += 4) spreads.push({ kind: "story", project: index, start });
  spreads.push({ kind: "outcome", project: index });
});
spreads.push({ kind: "thanks", project: -1 });
const pages = spreads.flatMap((spread, index) => [{ spread, side: "left" as const, number: index * 2 + 1 }, { spread, side: "right" as const, number: index * 2 + 2 }]);
const pad = (n: number) => String(n).padStart(2, "0");
const projectPage = (project: number) => spreads.findIndex((spread) => spread.kind === "opening" && spread.project === project) * 2;
const thanksPage = spreads.findIndex((spread) => spread.kind === "thanks") * 2;
type Flip = { from: number; to: number; direction: number };

const CREAM = "#f4ecde";
const INK = "#301b26";
const mono = "font-mono uppercase";

export function PortfolioBook({ initialProject, embedded = false }: { initialProject?: string; embedded?: boolean }) {
  const initial = initialProject ? projectPage(projects.findIndex((project) => project.slug === initialProject)) : 0;
  const [cursor, setCursor] = useState(Math.max(0, initial));
  const [mobile, setMobile] = useState(false);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [hint, setHint] = useState(true);
  const rotation = useMotionValue(0);
  const shadow = useTransform(rotation, [-180, -90, 0, 90, 180], [0, 0.34, 0, 0.34, 0]);
  const sheen = useTransform(rotation, [-180, -90, 0, 90, 180], [0, 0.45, 0, 0.45, 0]);
  const flipRef = useRef<Flip | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const playback = useRef<ReturnType<typeof animate> | null>(null);
  const gesture = useRef<{ x: number; y: number; width: number; direction: number; dragging: boolean; pointerId: number } | null>(null);
  const current = mobile ? cursor : cursor - (cursor % 2);
  const step = mobile ? 1 : 2;
  const last = pages.length - step;
  const currentProject = pages[current].spread.project;
  const project = currentProject >= 0 ? projects[currentProject] : null;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => () => playback.current?.stop(), []);

  function begin(to: number) {
    if (flipRef.current || to === current || to < 0 || to > last) return null;
    setHint(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCursor(to); bookRef.current?.focus({ preventScroll: true }); return null; }
    const next = { from: current, to, direction: to > current ? 1 : -1 };
    rotation.set(0);
    flipRef.current = next;
    setFlip(next);
    return next;
  }

  function settle(commit: boolean) {
    const active = flipRef.current;
    if (!active) return;
    const target = commit ? -180 * active.direction : 0;
    playback.current = animate(rotation, target, {
      duration: commit ? 0.9 * Math.max(0.35, Math.abs(target - rotation.get()) / 180) : 0.4,
      ease: [0.32, 0.02, 0.18, 1],
      onComplete: () => {
        if (commit) setCursor(active.to);
        flipRef.current = null;
        setFlip(null);
        bookRef.current?.focus({ preventScroll: true });
      },
    });
  }

  function turn(to: number) { if (begin(to)) settle(true); }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (flipRef.current || event.button !== 0 || (event.target as HTMLElement).closest("a,button")) return;
    const box = event.currentTarget.getBoundingClientRect();
    const direction = mobile ? 0 : event.clientX > box.left + box.width / 2 ? 1 : -1;
    if (current + step * direction < 0 || current + step * direction > last) return;
    gesture.current = { x: event.clientX, y: event.clientY, width: mobile ? box.width : box.width / 2, direction, dragging: false, pointerId: event.pointerId };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const active = gesture.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const distance = active.x - event.clientX;
    if (!active.dragging) {
      if (Math.abs(event.clientY - active.y) > 14 && Math.abs(distance) < 14) { gesture.current = null; return; }
      if (mobile && Math.abs(distance) > 9) active.direction = distance > 0 ? 1 : -1;
      if (distance * active.direction < 9) return;
      if (!begin(current + step * active.direction)) { gesture.current = null; return; }
      active.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const progress = Math.max(0, Math.min(1, (distance * active.direction) / active.width));
    rotation.set(-active.direction * progress * 180);
  }

  function pointerUp(cancel = false) {
    if (gesture.current?.dragging) settle(!cancel && Math.abs(rotation.get()) > 32);
    gesture.current = null;
  }

  function renderPage(pageIndex: number, clone = false) {
    return <Paper key={`${pageIndex}-${clone}`} page={pages[pageIndex]} onJump={turn} />;
  }

  const staticLeft = flip && flip.direction < 0 ? flip.to : current;
  const staticRight = flip && flip.direction > 0 ? flip.to + 1 : current + 1;
  const mobileBase = flip ? flip.to : current;

  return (
    <section
      aria-label="Tea Rose interactive portfolio book"
      className={`relative overflow-clip bg-[radial-gradient(ellipse_at_50%_38%,#57303b_0%,#2b1723_42%,#180e16_85%)] px-[4vw] pb-[24px] text-[#f9ede4] ${embedded ? "pt-[45px] sm:pt-[60px]" : "pt-[107px] sm:pt-[114px]"}`}
      style={{ minHeight: "100svh" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/paper-grain.png')] opacity-[0.065]" />
      <div className="relative mx-auto flex max-w-[1680px] items-center justify-between gap-[25px] font-mono text-[10px] leading-[1.5] tracking-[0.06em] text-[#d1b9c0] uppercase">
        <div className="flex items-center gap-3"><span>Tea Rose <i className="mx-2 text-[#f272a1] not-italic">—</i> The work book</span></div>
        <span className="hidden text-[9px] sm:inline">Volume 01 / {projects.length} brand stories</span>
      </div>

      <div className="relative mx-auto my-[22px] flex max-w-[1560px] items-center justify-between gap-5 sm:my-[26px]">
        <div>
          <span className="block font-mono text-[7px] tracking-[0.14em] text-[#d6a6b7] uppercase sm:text-[9px]">Open minds. Turning pages.</span>
          {embedded ? (
            <h2 className="mt-[7px] max-w-[22ch] text-[clamp(24px,6vw,35px)] leading-[1.2] font-medium tracking-[-0.05em] sm:max-w-none sm:text-[clamp(25px,2.7vw,43px)]">
              Our work, <em className="font-serif text-[1.16em] text-[#f49cb8] italic">bound together.</em>
            </h2>
          ) : (
            <h1 className="mt-[7px] max-w-[22ch] text-[clamp(24px,6vw,35px)] leading-[1.2] font-medium tracking-[-0.05em] sm:max-w-none sm:text-[clamp(25px,2.7vw,43px)]">
              Our work, <em className="font-serif text-[1.16em] text-[#f49cb8] italic">bound together.</em>
            </h1>
          )}
        </div>
        <span className="relative hidden max-w-[11ch] pr-[45px] text-right font-serif text-[21px] text-[#eec7c4] italic [transform:rotate(-6deg)] sm:block">
          A little ink.<br />A lot of imagination. <span className="absolute top-[7px] right-[5px] text-[35px]">↙</span>
        </span>
      </div>

      <nav aria-label="Chapter index" className="relative mx-auto mb-[22px] max-w-[1480px] sm:mb-[26px]">
        <div className="flex gap-[6px] overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scrollbar-color:#a9637d_transparent] sm:flex-wrap sm:overflow-visible">
          <button
            type="button"
            onClick={() => turn(0)}
            disabled={!!flip}
            aria-current={currentProject < 0 ? "true" : undefined}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#f9ede42b] bg-white/[0.03] px-[14px] py-[9px] text-[11px] whitespace-nowrap text-[#d1b9c0] transition-colors hover:border-[#f49cb8]/60 hover:text-white disabled:cursor-default aria-[current]:border-[#f49cb8] aria-[current]:bg-[#f49cb8]/15 aria-[current]:text-white"
          >
            <span className="font-mono text-[9px] text-[#f58aaf]">00</span>Contents
          </button>
          {projects.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => turn(projectPage(i))}
              disabled={!!flip}
              aria-current={currentProject === i ? "true" : undefined}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#f9ede42b] bg-white/[0.03] px-[14px] py-[9px] text-[11px] whitespace-nowrap text-[#d1b9c0] transition-colors hover:border-[#f49cb8]/60 hover:text-white disabled:cursor-default aria-[current]:border-[var(--pc)] aria-[current]:bg-[var(--pc)]/15 aria-[current]:text-white"
              style={projectVars(item)}
            >
              <span className="font-mono text-[9px] text-[#f58aaf]">{pad(i + 1)}</span>
              <span aria-hidden className="size-[6px] rounded-full" style={{ background: item.color }} />
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="relative mx-auto w-[min(94vw,580px)] [perspective:2400px] sm:w-[min(1560px,94vw,calc((100svh-280px)*1.82))] sm:min-w-[min(92vw,820px)]">
        <div aria-hidden className="absolute -inset-x-[8%] top-[17%] -bottom-[6%] rounded-full bg-[#080308] opacity-75 blur-[35px] [transform:rotate(-2deg)]" />
        <motion.div
          ref={bookRef}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          tabIndex={0}
          aria-label="Portfolio book. Use left and right arrow keys to turn pages."
          className={`relative isolate rounded-tl-[4px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[4px] [touch-action:pan-y] [perspective:2400px] select-none focus-visible:outline-1 focus-visible:outline-[#df9aaa] focus-visible:outline-offset-[18px] ${
            mobile ? "h-[min(760px,max(580px,calc(100svh-260px)))] [perspective:1800px]" : "aspect-[1.82]"
          }`}
          onKeyDown={(event) => {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || (event.target as HTMLElement).closest("input,select,textarea")) return;
            if (event.key === "ArrowRight") { event.preventDefault(); turn(current + step); }
            if (event.key === "ArrowLeft") { event.preventDefault(); turn(current - step); }
            if (event.key === "Home") { event.preventDefault(); turn(0); }
          }}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={() => pointerUp()}
          onPointerCancel={() => pointerUp(true)}
        >
          <div aria-hidden className="absolute -inset-x-[8px] -top-[6px] -bottom-[14px] -z-20 rounded-tl-[6px] rounded-tr-[9px] rounded-br-[10px] rounded-bl-[5px] border-2 border-[#b94c6a] bg-[#8f2546] shadow-[0_3px_2px_#0d0208,0_20px_30px_#0004]" />
          <div aria-hidden className={`absolute top-[6px] -bottom-[9px] -z-10 w-1/2 bg-[repeating-linear-gradient(0deg,#b7aa97_0_1px,#e1d5bf_1px_3px)] shadow-[0_1px_1px_#0008] ${mobile ? "left-0 w-full rounded-[3px]" : "-left-[4px] rounded-[2px_0_45%_2px/2px_0_8px_2px] [transform:skewY(1deg)]"}`} />
          {!mobile && <div aria-hidden className="absolute top-[6px] -right-[4px] -bottom-[9px] -z-10 w-1/2 rounded-[0_2px_2px_45%/0_2px_2px_8px] bg-[repeating-linear-gradient(0deg,#b7aa97_0_1px,#e1d5bf_1px_3px)] shadow-[0_1px_1px_#0008] [transform:skewY(-1deg)]" />}

          <div className="flex h-full" inert={!!flip}>
            {mobile ? (
              <div className="relative h-full w-full">{renderPage(mobileBase)}</div>
            ) : (
              <>
                <div className="relative h-full w-1/2 rounded-l-[3px]">{renderPage(staticLeft)}</div>
                <div className="relative h-full w-1/2 rounded-r-[4px]">{renderPage(staticRight)}</div>
              </>
            )}
          </div>

          {!mobile && (
            <div aria-hidden className="pointer-events-none absolute inset-y-0 z-8 w-[44px] bg-[linear-gradient(90deg,transparent,#3b241b20_40%,#2a140f6b_49%,#fff1c52e_52%,#3b241b14_65%,transparent)]" style={{ left: "calc(50% - 22px)" }} />
          )}
          {flip && (
            <>
              <motion.div aria-hidden className="absolute top-0 z-9 h-full w-1/2 bg-[linear-gradient(90deg,#291108bb,#29110844)] blur-[9px]" style={{ opacity: shadow, left: mobile ? 0 : flip.direction > 0 ? 0 : "50%" }} />
              <motion.div
                aria-hidden
                inert
                className={`absolute top-0 z-12 h-full w-full [transform-style:preserve-3d] will-change-transform sm:w-1/2 ${
                  flip.direction > 0 ? (mobile ? "left-0" : "left-1/2 [transform-origin:left_center]") : "left-0 [transform-origin:right_center]"
                }`}
                style={{ rotateY: rotation }}
              >
                <div className="absolute inset-0 overflow-hidden bg-[#f4ecde] [backface-visibility:hidden] [transform-style:preserve-3d]" style={{ transform: "translateZ(0.6px)" }}>
                  {renderPage(mobile ? flip.from : flip.direction > 0 ? flip.from + 1 : flip.from, true)}
                  <motion.div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,#22110acc,#fff4cc55_30%,#fff9_52%,#22110a88)]" style={{ opacity: sheen }} />
                </div>
                <div className="absolute inset-0 overflow-hidden bg-[#f4ecde] [backface-visibility:hidden] [transform-style:preserve-3d]" style={{ transform: "rotateY(180deg) translateZ(0.6px)" }}>
                  {renderPage(mobile ? flip.to : flip.direction > 0 ? flip.to : flip.to + 1, true)}
                  <motion.div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,#22110acc,#fff4cc55_30%,#fff9_52%,#22110a88)]" style={{ opacity: sheen }} />
                </div>
              </motion.div>
            </>
          )}

          {!flip && current > 0 && (
            <button
              type="button"
              className="absolute bottom-0 left-0 z-9 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-br-[4px] bg-[linear-gradient(225deg,transparent_45%,#dfd1bc_46%,#fff5df_53%,#8c705835)] text-[#7d5c65] shadow-none transition-colors hover:bg-[#edd7cf] hover:text-[#9e1246] max-[760px]:h-[64px] max-[760px]:w-[64px] max-[760px]:rounded-br-[8px] max-[760px]:bg-[#edd7cf] max-[760px]:text-[#9e1246] max-[760px]:shadow-[1px_2px_6px_#0002] max-[760px]:active:bg-[#e3bdc4]"
              aria-label="Turn to previous page"
              onClick={() => turn(current - step)}
            >
              <ArrowLeft size={12} className="mr-[16px] mt-[15px] max-[760px]:size-[18px] max-[760px]:mr-[20px] max-[760px]:mt-[20px]" />
            </button>
          )}
          {!flip && current < last && (
            <button
              type="button"
              className="absolute right-0 bottom-0 z-9 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-tl-[10px] bg-[linear-gradient(135deg,transparent_45%,#dfd1bc_46%,#fff5df_53%,#8c705835)] text-[#7d5c65] shadow-none transition-colors hover:bg-[#edd7cf] hover:text-[#9e1246] max-[760px]:h-[64px] max-[760px]:w-[64px] max-[760px]:rounded-tl-[14px] max-[760px]:bg-[#edd7cf] max-[760px]:text-[#9e1246] max-[760px]:shadow-[-1px_2px_6px_#0002] max-[760px]:active:bg-[#e3bdc4]"
              aria-label="Turn to next page"
              onClick={() => turn(current + step)}
            >
              <ArrowRight size={12} className="ml-[16px] mt-[15px] max-[760px]:size-[18px] max-[760px]:ml-[20px] max-[760px]:mt-[20px]" />
            </button>
          )}
        </motion.div>

        <div className="relative mt-[22px] flex items-center justify-between gap-5 sm:mt-[25px]">
          <span className="font-serif text-[16px] text-[#e6c1c2] italic [transform:rotate(-3deg)] sm:text-[19px]">{hint ? "Go on, turn the corner ↗" : "Every page, a fresh perspective."}</span>
          <span className="flex items-center gap-[5px] font-mono text-[6px] text-[#c2a5b0] sm:gap-2 sm:text-[8px]"><MoveHorizontal size={15} /> Drag a page · Use arrow keys</span>
        </div>
      </div>

      <div className="relative mx-auto mt-5 flex max-w-[1480px] flex-wrap items-center justify-between gap-[15px] border-t border-[#f9ede429] py-[15px] sm:gap-5 sm:py-[17px]">
        <div className="flex basis-full items-center justify-between gap-[10px] font-mono text-[7px] tracking-[0.04em] uppercase sm:basis-auto sm:justify-center sm:gap-[30px] sm:text-[8px]" aria-live="polite" aria-atomic="true">
          <span className="text-[#e2b7c6]">{project ? `${pad(currentProject + 1)} / ${project.name}` : pages[current].spread.kind === "thanks" ? "Thank you" : "The collection / Contents"}</span>
          <span>Page {pad(current + 1)}{!mobile && ` — ${pad(current + 2)}`} <i className="ml-1 text-[#b99ba7] not-italic">/ {pages.length}</i></span>
        </div>
        <div className="ml-auto flex gap-2 sm:ml-0">
          <button disabled={current === 0 || !!flip} onClick={() => turn(current - step)} aria-label="Previous page" className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full border border-[#e5b8c647] transition-colors enabled:hover:bg-[#f3d6d7] enabled:hover:text-[#301b26] disabled:cursor-default disabled:opacity-30 sm:h-[38px] sm:w-[38px]"><ArrowLeft size={18} /></button>
          <button disabled={current >= last || !!flip} onClick={() => turn(current + step)} aria-label="Next page" className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full border border-[#e5b8c647] transition-colors enabled:hover:bg-[#f3d6d7] enabled:hover:text-[#301b26] disabled:cursor-default disabled:opacity-30 sm:h-[38px] sm:w-[38px]"><ArrowRight size={18} /></button>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1480px] flex-col items-start gap-[13px] pt-3 text-[7px] text-[#b795a4] sm:flex-row sm:items-center sm:justify-between sm:text-[8px]">
        <span>Strategy. Design. Stories worth turning for.</span>
        <StudioLink href="/#contact" className="inline-flex items-center gap-3 text-[#e5b8c6]">Let’s write your next chapter <ArrowUpRight size={14} /></StudioLink>
      </div>
    </section>
  );
}

function projectVars(project: Project): CSSProperties {
  return { "--pc": project.color, "--pi": project.ink } as CSSProperties;
}

function Paper({ page, onJump }: { page: (typeof pages)[number]; onJump: (page: number) => void }) {
  const { spread, side, number } = page;
  const project = projects[spread.project];
  const left = side === "left";
  const pairStart = (spread.start ?? 1) + (left ? 0 : 2);
  const items =
    spread.kind === "story"
      ? project.sections.slice(pairStart, pairStart + 2).map((section, i) => ({ ...section, number: pairStart + i + 1 }))
      : [];
  // Balance extra photos evenly across both pages instead of stacking them
  // all on one side and leaving the other blank.
  const extras = spread.kind === "gallery" ? (project?.images?.slice(1) ?? []) : [];
  const leftCount = Math.ceil(extras.length / 2);
  const galleryImages = spread.kind === "gallery" ? (left ? extras.slice(0, leftCount) : extras.slice(leftCount)) : [];
  const galleryStart = 1 + (left ? 0 : leftCount);
  const heroImage = spread.kind === "opening" && !left ? project?.images?.[0] : undefined;
  const artPage = (spread.kind === "opening" && !left) || spread.kind === "gallery";
  const resultPage = (spread.kind === "outcome" || spread.kind === "thanks") && !left;

  const base = `relative flex h-full w-full flex-col overflow-hidden px-[25px] pt-[22px] pb-[20px] sm:px-[33px] sm:pt-[25px] sm:pb-[22px]`;
  const bg = artPage ? { background: project.color, color: project.ink } : resultPage ? { background: "#3c1829", color: "#fae9db" } : spread.kind === "contents" && left ? { background: "#f4d6d3", color: "#712540" } : { background: CREAM, color: INK };
  const sideGradient = left ? "bg-[linear-gradient(90deg,#33201922,#fff0_7%,#ffffff12_90%,#33201918)] sm:bg-[linear-gradient(90deg,#ffffff18_70%,#9a81691a_93%,#33201930)] rounded-[3px]" : "bg-[linear-gradient(90deg,#33201922,#fff0_7%,#ffffff12_90%,#33201918)] sm:bg-[linear-gradient(90deg,#4b2f2430,#bfa68e0a_7%,#fff0_25%)] rounded-[3px]";

  if (heroImage) {
    return (
      <div className="relative flex h-full w-full flex-col overflow-hidden" style={projectVars(project)}>
        <Image
          src={heroImage.src}
          alt={`${project.name} — case study photography`}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#120910b3_0%,#12091026_22%,#12091026_72%,#120910bf_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-5 bg-[url('/paper-grain.png')] opacity-[0.08] mix-blend-overlay" />
        <div className="relative z-10 flex shrink-0 items-center justify-between gap-[15px] px-[25px] pt-[22px] pb-[11px] font-mono text-[6px] tracking-[0.055em] text-[#f9ede4] uppercase sm:px-[33px] sm:pt-[25px] sm:text-[8px]">
          <span>{pad(spread.project + 1)} / {project.name}</span>
          <span className="text-[6px] whitespace-nowrap sm:text-[7px]">A brand story</span>
        </div>
        <div className="relative z-10 mt-auto flex shrink-0 items-center justify-between gap-[15px] px-[25px] pt-3 pb-[20px] text-[6px] text-[#f9ede4] sm:px-[33px] sm:pb-[22px] sm:text-[7px]">
          <span className="font-serif text-[13px] text-[#f4c3cf] italic sm:text-[14px]">An identity with a point of view.</span>
          <span className="text-[9px] sm:text-[10px]">{pad(number)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${base} ${sideGradient}`} style={{ ...bg, ...(project ? projectVars(project) : {}) }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-5 bg-[url('/paper-grain.png')] opacity-[0.13] mix-blend-multiply" />
      <div className={`flex shrink-0 items-center justify-between gap-[15px] pb-[11px] font-mono text-[6px] tracking-[0.055em] uppercase sm:text-[8px] ${resultPage ? "border-b border-[#fae9db44]" : artPage ? "border-b border-current" : "border-b border-[#301b2633]"}`}>
        <span>{project ? `${pad(spread.project + 1)} / ${project.name}` : "Tea Rose Design Studio"}</span>
        <span className="text-[6px] whitespace-nowrap sm:text-[7px]">{spread.kind === "contents" ? "The collection" : spread.kind === "opening" ? "A brand story" : spread.kind === "gallery" ? "The visual world" : spread.kind === "story" ? "The thinking" : spread.kind === "thanks" ? "The closing note" : "The details"}</span>
      </div>

      <div className={`relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto py-5 [scrollbar-color:#a99485_transparent] [scrollbar-width:thin] [touch-action:pan-y] ${artPage ? "overflow-hidden pt-[26px]" : ""}`}>
        {spread.kind === "contents" && (left ? <TitleContent onJump={onJump} /> : <ContentsContent onJump={onJump} />)}
        {spread.kind === "opening" && (left ? <OpeningContent project={project} /> : <VisualContent project={project} />)}
        {spread.kind === "gallery" && <GalleryContent project={project} images={galleryImages} start={galleryStart} />}
        {spread.kind === "story" && (items.length > 0 ? <StoryContent project={project} items={items} /> : <Interlude project={project} />)}
        {spread.kind === "outcome" && (left ? <ScopeContent project={project} /> : <ResultContent project={project} index={spread.project} onJump={onJump} />)}
        {spread.kind === "thanks" && (left ? <ThanksContent /> : <ClosingContent onJump={onJump} />)}
      </div>

      <div className={`flex shrink-0 items-center justify-between gap-[15px] pt-3 text-[6px] max-[760px]:pr-[42px] max-[760px]:pl-[42px] sm:text-[7px] ${resultPage ? "border-t border-[#fae9db44]" : artPage ? "border-t border-current" : "border-t border-[#301b2633]"}`}>
        <span>{left ? "Tea Rose / Studio journal" : spread.kind === "thanks" ? "With gratitude." : "Ideas, freshly brewed."}</span>
        <span className="text-[9px] sm:text-[10px]">{pad(number)}</span>
      </div>
    </div>
  );
}

function Micro({ children }: { children: ReactNode }) {
  return <span className={`${mono} text-[8px] leading-[1.7] tracking-[0.08em]`}>{children}</span>;
}

function TitleContent({ onJump }: { onJump: (page: number) => void }) {
  return (
    <div className="relative flex h-full flex-col">
      <Micro>The independent<br />studio collection / Vol. 01</Micro>
      <div className="relative mt-auto pt-[14px]">
        <span className="font-serif text-[clamp(22px,2.7vw,39px)] italic">Made of</span>
        <h2 className="my-[7px] mb-[20px] text-[clamp(54px,6.2vw,91px)] leading-[0.84] font-[650] tracking-[-0.085em]">
          good<br /><em className="font-serif text-[1.24em] leading-[0.8] font-normal tracking-[-0.06em] italic">ideas.</em>
        </h2>
      </div>
      <p className="max-w-[20ch] text-[12px] leading-[1.7] sm:text-[11px]">Seven-plus brands.<br />Different worlds.<br />One thoughtful studio.</p>
      <button type="button" className="mt-auto inline-flex cursor-pointer items-center justify-between gap-7 self-start border-b border-[#71254055] py-[15px_0_6px] text-[10px]" onClick={() => onJump(2)}>Begin the story <ArrowRight size={17} /></button>
    </div>
  );
}

function ContentsContent({ onJump }: { onJump: (page: number) => void }) {
  return (
    <div className="flex h-full flex-col">
      <Micro>Inside this edition</Micro>
      <h2 className="my-[13px] mb-[18px] text-[34px] leading-[1] font-[550] tracking-[-0.06em] sm:text-[clamp(23px,2.8vw,42px)]">A collection<br /><em className="font-serif text-[1.2em] font-normal italic">of possibilities.</em></h2>
      <div className="flex min-h-0 flex-1 flex-col">
        {projects.map((item, i) => (
          <button key={item.slug} className="flex flex-1 cursor-pointer items-center gap-3 border-t border-[#301b2625] py-[10px] text-left transition-[padding,color] duration-200 hover:pl-[5px] hover:text-[#ac2054]" onClick={() => onJump(projectPage(i))}>
            <span className="font-mono text-[8px] text-[#b05872]">{pad(i + 1)}</span>
            <span>
              <strong className="block text-[18px] leading-[1.15] font-medium tracking-[-0.045em] sm:text-[clamp(12px,1.4vw,20px)]">{item.name}</strong>
              <small className="mt-[3px] block font-mono text-[6px] leading-[1.5] text-[#8c7374] uppercase">{item.tags.join(" + ")}</small>
            </span>
            <span className="ml-auto font-mono text-[8px]">{pad(projectPage(i) + 1)}</span>
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
    </div>
  );
}

function OpeningContent({ project }: { project: Project }) {
  const intro = project.sections[0];
  return (
    <div className="relative flex h-full flex-col">
      <span className={`${mono} max-w-[35ch] text-[8px] text-[#9c4464]`}>Chapter <span className="block pt-2">{pad(projects.indexOf(project) + 1)} — {project.category}</span></span>
      <h2 className="relative mt-auto mb-[18px] pt-[18px] text-[clamp(37px,10vw,56px)] leading-[0.98] font-semibold tracking-[-0.075em] break-words sm:text-[clamp(28px,4.4vw,66px)]">
        {project.name}
      </h2>
      <p className="max-w-[22ch] font-serif text-[29px] leading-[1.06] tracking-[-0.02em] italic sm:text-[clamp(22px,2.5vw,36px)]">{project.headline}</p>
      <div className="mt-5 max-w-[43ch] space-y-2 text-[12px] leading-[1.85] text-[#785e63] sm:mt-[22px] sm:text-[11px]">
        {intro.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      </div>
      <div className="mt-[18px] flex flex-wrap gap-[7px]">
        {project.tags.map((tag) => <span key={tag} className="rounded-full border border-[#301b2630] px-[11px] py-[5px] font-mono text-[7px] uppercase">{tag}</span>)}
      </div>
      <span className="mt-auto self-end pt-[14px] font-serif text-[15px] text-[#a24e64] italic [transform:rotate(-5deg)]">The story starts here. ↗</span>
    </div>
  );
}

function VisualContent({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-[10px] text-[6px] tracking-[0.08em] uppercase">
        <span>01 — The visual world</span>
        <span>Tea Rose Studio ↗</span>
      </div>

      <div className="relative mt-[28px] flex min-h-0 flex-1 items-center justify-center pt-1 sm:mt-[34px]">
        {project.logo ? (
          <div className="flex h-full w-full items-center justify-center rounded-md" style={{ background: project.color }}><Image src={project.logo} alt={`${project.name} identity`} width={320} height={200} className="h-auto w-3/5 object-contain" /></div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md p-8 text-center font-sans text-[clamp(30px,5vw,60px)] leading-[0.95] font-extrabold tracking-[-0.08em]" style={{ background: project.color }}>{project.name}</div>
        )}
      </div>

      <p className="mt-5 text-center font-serif text-[13px] text-[#a24e64] italic sm:text-[14px]">An identity with a point of view.</p>
    </div>
  );
}

function GalleryContent({ project, images, start }: { project: Project; images: { src: string; width: number; height: number }[]; start: number }) {
  if (images.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <span aria-hidden className="text-[80px] leading-[0.9] tracking-[-0.07em] opacity-60 sm:text-[clamp(60px,5.2vw,92px)]">{pad(start + 1)}</span>
        <p className="mt-[18px] max-w-[22ch] font-serif text-[21px] leading-[1.2] italic sm:text-[24px]">{project.headline}</p>
      </div>
    );
  }
  const stacked = images.length > 1;
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4">
      {images.map((image) => (
        <div
          key={image.src}
          className="flex min-h-0 shrink rounded-[2px] border border-black/5 bg-white p-2 shadow-[10px_18px_26px_rgba(0,0,0,.22)]"
        >
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={`${project.name} — case study photography`}
            sizes="(max-width: 760px) 80vw, 36vw"
            className={`block h-auto w-auto max-w-[76vw] rounded-[1px] object-contain sm:max-w-[360px] ${
              stacked ? "max-h-[min(32svh,260px)]" : "max-h-[min(60svh,440px)]"
            }`}
          />
        </div>
      ))}
      <p className="mt-1 text-center font-mono text-[7px] tracking-[0.1em] uppercase opacity-70">
        {pad(start + 1)}
        {images.length > 1 ? `–${pad(start + images.length)}` : ""} / {project.name}
      </p>
    </div>
  );
}

function StoryContent({ project, items }: { project: Project; items: (Project["sections"][number] & { number: number })[] }) {
  const motif = projects.indexOf(project) % 3;
  const compact = items.length > 1;
  return (
    <div className="relative flex h-full flex-col">
      <Micro>The process{items.length === 1 ? ` / ${pad(items[0].number)}` : ""}</Micro>
      <div className={`flex min-h-0 flex-1 flex-col ${compact ? "justify-between" : "sm:justify-center"}`}>
        {items.map((item, i) => (
          <div
            key={item.number}
            className={compact ? `flex flex-1 flex-col justify-center ${i > 0 ? "mt-[14px] border-t border-[#301b2622] pt-[18px] sm:mt-[22px] sm:pt-[26px]" : ""}` : undefined}
          >
            {compact ? (
              <span className="font-mono text-[9px] tracking-[0.1em] text-[#a95870] sm:text-[10px]">{pad(item.number)}</span>
            ) : (
              <span aria-hidden className="mt-5 text-[105px] leading-[0.9] tracking-[-0.07em] text-[var(--pc)] sm:mt-0 sm:text-[clamp(60px,5.2vw,92px)]" style={{ textShadow: "1px 0 var(--pi)", opacity: 0.7 }}>
                {pad(item.number)}
              </span>
            )}
            <h2 className={compact ? "my-2 max-w-[20ch] text-[22px] leading-[1.1] font-[550] tracking-[-0.05em] sm:text-[clamp(20px,2.1vw,29px)]" : "my-3 max-w-[18ch] text-[30px] leading-[1.08] font-[550] tracking-[-0.055em] sm:mt-[14px] sm:mb-[20px] sm:text-[clamp(26px,3vw,44px)]"}>{item.title}</h2>
            <div className={compact ? "max-w-[43ch] space-y-2 text-[12px] leading-[1.7] text-[#785e63] sm:text-[13px] sm:leading-[1.8]" : "max-w-[43ch] space-y-4 text-[12px] leading-[1.85] text-[#785e63] sm:space-y-5 sm:text-[16px] sm:leading-[1.9]"}>
              {item.paragraphs.map((paragraph, pi) => (
                <p key={pi} className={!compact && pi === 0 && item.paragraphs.length > 1 ? "font-serif text-[27px] leading-[1.15] text-[#301b26] italic sm:text-[clamp(21px,2.3vw,31px)]" : undefined}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-auto flex min-h-[60px] items-center gap-2 overflow-hidden pt-[22px] sm:min-h-[80px]">
        <span className={`h-[32px] w-[32px] border border-[#301b2626] bg-[var(--pc)] shadow-[1px_3px_2px_#301b2610] sm:h-[42px] sm:w-[42px] ${motif === 1 ? "rounded-none rotate-[-10deg]" : motif === 2 ? "h-[42px] w-[26px] rounded-t-[25px]" : "rounded-full"}`} />
        <span className={`h-[32px] w-[32px] border border-[#301b2626] bg-[var(--pi)] shadow-[1px_3px_2px_#301b2610] sm:h-[42px] sm:w-[42px] ${motif === 1 ? "rounded-none rotate-[6deg]" : motif === 2 ? "h-[42px] w-[26px] rounded-t-[25px]" : "rounded-full"}`} />
        <span className={`h-[32px] w-[32px] border border-[#301b2626] bg-[#f4ecde] shadow-[1px_3px_2px_#301b2610] sm:h-[42px] sm:w-[42px] ${motif === 2 ? "h-[42px] w-[26px] rounded-t-[25px]" : "rounded-full"}`} />
        <i className="ml-auto max-w-[13ch] text-right font-serif text-[17px] text-[var(--pi)] italic">{project.name}</i>
      </div>
    </div>
  );
}

function Interlude({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col items-start justify-center">
      <Micro>The Tea Rose approach</Micro>
      <h2 className="mt-[22px] text-[clamp(30px,4vw,58px)] leading-[1] font-[550] tracking-[-0.06em]">Every detail.<br /><em className="font-serif font-normal italic">One story.</em></h2>
      <p className="mt-[25px] max-w-[23ch] font-serif text-[23px] leading-[1.2] italic">{project.headline}</p>
    </div>
  );
}

function ScopeContent({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col">
      <Micro>The complete picture</Micro>
      <h2 className="mt-[18px] text-[38px] leading-[1] font-[550] tracking-[-0.06em] sm:text-[clamp(27px,3.3vw,48px)]">What went<br /><em className="font-serif text-[1.15em] leading-[0.95] font-normal italic">into the work.</em></h2>
      <ul className="mt-[18px] flex flex-1 list-none flex-col sm:mt-[25px]">
        {project.scope.map((item, i) => (
          <li key={item} className="flex flex-1 items-baseline gap-[15px] border-t border-[#301b2628] py-[10px] text-[11px] leading-[1.5] sm:text-[10px]"><span className="font-mono text-[7px] text-[#a95870]">{pad(i + 1)}</span>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ResultContent({ project, index, onJump }: { project: Project; index: number; onJump: (page: number) => void }) {
  return (
    <div className="flex h-full flex-col">
      <Micro>The outcome</Micro>
      <h2 className="mt-5 text-[38px] leading-[1] font-[550] tracking-[-0.06em] sm:text-[clamp(27px,3.3vw,48px)]">A story<br /><em className="font-serif text-[1.15em] leading-[0.95] font-normal italic">made whole.</em></h2>
      <p className="mt-[25px] max-w-[30ch] font-serif text-[25px] leading-[1.3] text-[#e4c5cb] sm:text-[clamp(17px,2vw,27px)]">{project.outcome}</p>
      <button
        type="button"
        className="mt-auto flex cursor-pointer items-center justify-between gap-5 pt-[22px] text-left text-[11px] text-[#f49bb6] sm:text-[10px]"
        onClick={() => onJump(index < projects.length - 1 ? projectPage(index + 1) : thanksPage)}
      >
        {index < projects.length - 1 ? `Next chapter: ${projects[index + 1].name}` : "Next: a closing note"}<ArrowRight size={17} />
      </button>
    </div>
  );
}

function ThanksContent() {
  return (
    <div className="relative flex h-full flex-col">
      <Micro>The last page</Micro>
      <div className="relative mt-auto pt-[14px]">
        <h2 className="my-[7px] mb-[20px] text-[clamp(48px,6vw,84px)] leading-[0.88] font-[650] tracking-[-0.08em]">
          Thank<br /><em className="font-serif text-[1.1em] leading-[0.85] font-normal tracking-[-0.055em] italic">you.</em>
        </h2>
      </div>
      <p className="max-w-[32ch] text-[12px] leading-[1.85] sm:text-[11px]">For turning every page. Eleven-plus stories, one studio, and hopefully a few ideas worth borrowing.</p>
      <span className="mt-auto self-end pt-[14px] font-serif text-[15px] text-[#a24e64] italic [transform:rotate(-5deg)]">See you on the next page. ↗</span>
    </div>
  );
}

function ClosingContent({ onJump }: { onJump: (page: number) => void }) {
  return (
    <div className="flex h-full flex-col">
      <Micro>Thank you</Micro>
      <h2 className="mt-5 text-[38px] leading-[1] font-[550] tracking-[-0.06em] sm:text-[clamp(27px,3.3vw,48px)]">Your story,<br /><em className="font-serif text-[1.15em] leading-[0.95] font-normal italic">next.</em></h2>
      <p className="mt-[25px] max-w-[30ch] font-serif text-[22px] leading-[1.3] text-[#e4c5cb] sm:text-[clamp(16px,1.9vw,25px)]">Strategy, design and stories worth turning for — whenever you&apos;re ready to begin.</p>
      <StudioLink href="/#contact" className="mt-auto flex items-center justify-between gap-5 pt-[22px] text-left text-[11px] text-[#f49bb6] sm:text-[10px]">
        Your brand could be next <ArrowUpRight size={17} />
      </StudioLink>
      <button type="button" className="mt-4 flex cursor-pointer items-center justify-between gap-5 text-left text-[11px] text-[#f49bb6]/70 sm:text-[10px]" onClick={() => onJump(0)}>
        Back to the beginning <ArrowLeft size={17} />
      </button>
    </div>
  );
}
