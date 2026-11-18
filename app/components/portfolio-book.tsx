"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, MoveHorizontal } from "lucide-react";
import { projects, type Project } from "@/lib/work-content";
import { StudioLink } from "./studio-navigation";

type Spread = { kind: "contents" | "opening" | "story" | "outcome"; project: number; start?: number };
const spreads: Spread[] = [{ kind: "contents", project: -1 }];
projects.forEach((project, index) => {
  spreads.push({ kind: "opening", project: index });
  for (let start = 1; start < project.sections.length; start += 2) spreads.push({ kind: "story", project: index, start });
  spreads.push({ kind: "outcome", project: index });
});
const pages = spreads.flatMap((spread, index) => [{ spread, side: "left" as const, number: index * 2 + 1 }, { spread, side: "right" as const, number: index * 2 + 2 }]);
const pad = (n: number) => String(n).padStart(2, "0");
const projectPage = (project: number) => spreads.findIndex((spread) => spread.kind === "opening" && spread.project === project) * 2;
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
        <div className="flex items-center gap-3"><BookOpen size={17} /><span>Tea Rose <i className="mx-2 text-[#f272a1] not-italic">—</i> The work book</span></div>
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
          <div aria-hidden className="pointer-events-none absolute -top-[6px] right-[30px] z-10 h-[64px] w-[24px] bg-[linear-gradient(90deg,#a60f45,#f43d7c_40%,#c51f5a)] shadow-[2px_3px_4px_#0003] [clip-path:polygon(0_0,100%_0,100%_100%,50%_87%,0_100%)]">
            <span className="mt-[23px] block font-mono text-[7px] whitespace-nowrap [transform:rotate(90deg)]">tea rose</span>
          </div>

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
            <button type="button" className="absolute bottom-0 left-0 z-9 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-br-[4px] bg-[linear-gradient(225deg,transparent_45%,#dfd1bc_46%,#fff5df_53%,#8c705835)] text-[#7d5c65] transition-colors hover:bg-[#edd7cf] hover:text-[#9e1246]" aria-label="Turn to previous page" onClick={() => turn(current - step)}>
              <ArrowLeft size={12} className="mr-[16px] mt-[15px]" />
            </button>
          )}
          {!flip && current < last && (
            <button type="button" className="absolute right-0 bottom-0 z-9 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-tl-[10px] bg-[linear-gradient(135deg,transparent_45%,#dfd1bc_46%,#fff5df_53%,#8c705835)] text-[#7d5c65] transition-colors hover:bg-[#edd7cf] hover:text-[#9e1246]" aria-label="Turn to next page" onClick={() => turn(current + step)}>
              <ArrowRight size={12} className="ml-[16px] mt-[15px]" />
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
          <span className="text-[#e2b7c6]">{project ? `${pad(currentProject + 1)} / ${project.name}` : "The collection / Contents"}</span>
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
  const section = spread.kind === "story" ? project.sections[(spread.start ?? 1) + (left ? 0 : 1)] : null;
  const artPage = spread.kind === "opening" && !left;
  const resultPage = spread.kind === "outcome" && !left;

  const base = `relative flex h-full w-full flex-col overflow-hidden px-[25px] pt-[22px] pb-[20px] sm:px-[33px] sm:pt-[25px] sm:pb-[22px]`;
  const bg = artPage ? { background: project.color, color: project.ink } : resultPage ? { background: "#3c1829", color: "#fae9db" } : spread.kind === "contents" && left ? { background: "#f4d6d3", color: "#712540" } : { background: CREAM, color: INK };
  const sideGradient = left ? "bg-[linear-gradient(90deg,#33201922,#fff0_7%,#ffffff12_90%,#33201918)] sm:bg-[linear-gradient(90deg,#ffffff18_70%,#9a81691a_93%,#33201930)] rounded-[3px]" : "bg-[linear-gradient(90deg,#33201922,#fff0_7%,#ffffff12_90%,#33201918)] sm:bg-[linear-gradient(90deg,#4b2f2430,#bfa68e0a_7%,#fff0_25%)] rounded-[3px]";

  return (
    <div className={`${base} ${sideGradient}`} style={{ ...bg, ...(project ? projectVars(project) : {}) }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-5 bg-[url('/paper-grain.png')] opacity-[0.13] mix-blend-multiply" />
      <div className={`flex shrink-0 items-center justify-between gap-[15px] pb-[11px] font-mono text-[6px] tracking-[0.055em] uppercase sm:text-[8px] ${resultPage ? "border-b border-[#fae9db44]" : artPage ? "border-b border-current" : "border-b border-[#301b2633]"}`}>
        <span>{project ? `${pad(spread.project + 1)} / ${project.name}` : "Tea Rose Design Studio"}</span>
        <span className="text-[6px] whitespace-nowrap sm:text-[7px]">{spread.kind === "contents" ? "The collection" : spread.kind === "opening" ? "A brand story" : spread.kind === "story" ? "The thinking" : "The details"}</span>
      </div>

      <div className={`relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto py-5 [scrollbar-color:#a99485_transparent] [scrollbar-width:thin] [touch-action:pan-y] ${artPage ? "overflow-hidden pt-[26px]" : ""}`}>
        {spread.kind === "contents" && (left ? <TitleContent onJump={onJump} /> : <ContentsContent onJump={onJump} />)}
        {spread.kind === "opening" && (left ? <OpeningContent project={project} /> : <VisualContent project={project} />)}
        {spread.kind === "story" && (section ? <StoryContent project={project} section={section} index={(spread.start ?? 1) + (left ? 1 : 2)} /> : <Interlude project={project} />)}
        {spread.kind === "outcome" && (left ? <ScopeContent project={project} /> : <ResultContent project={project} index={spread.project} onJump={onJump} />)}
      </div>

      <div className={`flex shrink-0 items-center justify-between gap-[15px] pt-3 text-[6px] sm:text-[7px] ${resultPage ? "border-t border-[#fae9db44]" : artPage ? "border-t border-current" : "border-t border-[#301b2633]"}`}>
        <span>{left ? "Tea Rose / Studio journal" : "Ideas, freshly brewed."}</span>
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
        <span aria-hidden className="absolute top-[14%] right-[4%] text-[clamp(45px,7vw,90px)] text-[#d32c68] [transform:rotate(-12deg)]">✳</span>
      </div>
      <p className="max-w-[20ch] text-[12px] leading-[1.7] sm:text-[11px]">Seven-plus brands.<br />Different worlds.<br />One thoughtful studio.</p>
      <button type="button" className="mt-auto inline-flex cursor-pointer items-center justify-between gap-7 self-start border-b border-[#71254055] py-[15px_0_6px] text-[10px]" onClick={() => onJump(2)}>Begin the story <ArrowRight size={17} /></button>
      <span className="absolute right-[2%] bottom-[10%] flex h-[65px] w-[65px] rotate-[-16deg] flex-col items-center justify-center rounded-full border border-[#ac506b] font-mono text-[7px] uppercase outline outline-offset-4 outline-[#ac506b] sm:bottom-[4%] sm:h-[76px] sm:w-[76px]">Freshly<br /><em className="font-serif text-[20px] font-normal tracking-normal normal-case italic">brewed.</em></span>
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
            <span className="relative size-[34px] shrink-0 overflow-hidden rounded-[4px] border border-white/60 bg-white shadow-[1px_2px_4px_rgba(0,0,0,.15)] sm:size-[40px]">
              {item.images?.[0] ? (
                <Image src={item.images[0].src} alt="" fill sizes="40px" className="object-cover" />
              ) : item.logo ? (
                <div className="flex h-full w-full items-center justify-center p-1" style={{ background: item.color }}><Image src={item.logo} alt="" width={40} height={40} className="h-auto w-full object-contain" /></div>
              ) : (
                <div className="h-full w-full" style={{ background: item.color }} />
              )}
            </span>
            <span>
              <strong className="block text-[18px] leading-[1.15] font-medium tracking-[-0.045em] sm:text-[clamp(12px,1.4vw,20px)]">{item.name}</strong>
              <small className="mt-[3px] block font-mono text-[6px] leading-[1.5] text-[#8c7374] uppercase">{item.tags.join(" + ")}</small>
            </span>
            <span className="ml-auto font-mono text-[8px]">{pad(projectPage(i) + 1)}</span>
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
      <p className="hidden pt-[15px] font-serif text-[15px] text-[#906a70] italic sm:block sm:text-[14px]">A little strategy. A little instinct.<br />And a story on every page.</p>
    </div>
  );
}

function OpeningContent({ project }: { project: Project }) {
  const intro = project.sections[0];
  return (
    <div className="relative flex h-full flex-col">
      <span className={`${mono} max-w-[35ch] text-[8px] text-[#9c4464]`}>Chapter <span className="block pt-2">{pad(projects.indexOf(project) + 1)} — {project.category}</span></span>
      <h2 className="relative mt-auto mb-[18px] pt-[18px] text-[clamp(37px,10vw,56px)] leading-[0.98] font-semibold tracking-[-0.075em] break-words sm:text-[clamp(28px,4.4vw,66px)]">
        {project.name}<span className="ml-2 font-serif text-[0.5em] font-normal text-[#b32458] italic">✳</span>
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
  const [hero, ...thumbs] = project.images ?? [];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-[10px] text-[6px] tracking-[0.08em] uppercase">
        <span>01 — The visual world</span>
        <span>Tea Rose Studio ↗</span>
      </div>

      <div className="relative mt-[28px] flex min-h-0 flex-1 items-start justify-center pt-1 sm:mt-[34px]">
        {hero ? (
          <div className="relative mx-auto w-[82%] max-w-[420px] shrink-0 rounded-[2px] border border-black/5 bg-white p-2 shadow-[10px_18px_26px_rgba(0,0,0,.22)] [transform:rotate(-2deg)]">
            <Image src={hero.src} alt={`${project.name} — case study photography`} width={hero.width} height={hero.height} sizes="(max-width: 760px) 80vw, 36vw" className="h-auto w-full rounded-[1px] object-contain" priority={false} />
          </div>
        ) : project.logo ? (
          <div className="flex h-full w-full items-center justify-center rounded-md" style={{ background: project.color }}><Image src={project.logo} alt={`${project.name} identity`} width={320} height={200} className="h-auto w-3/5 object-contain" /></div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md p-8 text-center font-sans text-[clamp(30px,5vw,60px)] leading-[0.95] font-extrabold tracking-[-0.08em]" style={{ background: project.color }}>{project.name}</div>
        )}
      </div>

      {thumbs.length > 0 && (
        <div className="relative mt-4 hidden shrink-0 items-start justify-center gap-6 sm:flex">
          {thumbs.slice(0, 2).map((img, i) => (
            <div
              key={img.src}
              className={`relative w-[38%] max-w-[190px] rounded-[2px] border border-black/5 bg-white p-[6px] shadow-[4px_10px_16px_rgba(0,0,0,.18)] ${
                i === 0 ? "[transform:rotate(-4deg)]" : "[transform:rotate(3deg)]"
              }`}
            >
              <Image src={img.src} alt={`${project.name} — detail`} width={img.width} height={img.height} sizes="(max-width: 760px) 40vw, 16vw" className="h-auto w-full rounded-[1px] object-contain" />
            </div>
          ))}
        </div>
      )}

      <p className="mt-5 text-center font-serif text-[13px] text-[#a24e64] italic sm:text-[14px]">An identity with a point of view.</p>
    </div>
  );
}

function StoryContent({ project, section, index }: { project: Project; section: Project["sections"][number]; index: number }) {
  const motif = projects.indexOf(project) % 3;
  return (
    <div className="relative flex h-full flex-col">
      <Micro>The process / {pad(index)}</Micro>
      <span aria-hidden className="mt-5 text-[105px] leading-[0.9] tracking-[-0.07em] text-[var(--pc)] sm:mt-[16px] sm:text-[clamp(75px,10vw,145px)]" style={{ textShadow: "1px 0 var(--pi)", opacity: 0.7 }}>{pad(index)}</span>
      <h2 className="my-3 max-w-[18ch] text-[30px] leading-[1.08] font-[550] tracking-[-0.055em] sm:text-[clamp(23px,2.6vw,38px)]">{section.title}</h2>
      <div className="max-w-[43ch] space-y-3 text-[12px] leading-[1.85] text-[#785e63] sm:text-[11px]">
        {section.paragraphs.map((paragraph, i) => (
          <p key={i} className={i === 0 && section.paragraphs.length > 1 ? "font-serif text-[27px] leading-[1.15] text-[#301b26] italic sm:text-[clamp(21px,2.3vw,31px)]" : undefined}>{paragraph}</p>
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
      <span aria-hidden className="my-[22px] text-[95px] text-[var(--pi)]">✳</span>
      <h2 className="text-[clamp(30px,4vw,58px)] leading-[1] font-[550] tracking-[-0.06em]">Every detail.<br /><em className="font-serif font-normal italic">One story.</em></h2>
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
      <span aria-hidden className="mt-3 text-[75px] leading-[1.2] text-[var(--pc)] sm:text-[70px]">✳</span>
      <h2 className="mt-3 text-[38px] leading-[1] font-[550] tracking-[-0.06em] sm:text-[clamp(27px,3.3vw,48px)]">A story<br /><em className="font-serif text-[1.15em] leading-[0.95] font-normal italic">made whole.</em></h2>
      <p className="mt-[25px] max-w-[30ch] font-serif text-[25px] leading-[1.3] text-[#e4c5cb] sm:text-[clamp(17px,2vw,27px)]">{project.outcome}</p>
      {index < projects.length - 1 ? (
        <button type="button" className="mt-auto flex cursor-pointer items-center justify-between gap-5 pt-[22px] text-left text-[11px] text-[#f49bb6] sm:text-[10px]" onClick={() => onJump(projectPage(index + 1))}>
          Next chapter: {projects[index + 1].name}<ArrowRight size={17} />
        </button>
      ) : (
        <StudioLink href="/#contact" className="mt-auto flex items-center justify-between gap-5 pt-[22px] text-left text-[11px] text-[#f49bb6] sm:text-[10px]">
          Your brand could be next <ArrowUpRight size={17} />
        </StudioLink>
      )}
    </div>
  );
}
