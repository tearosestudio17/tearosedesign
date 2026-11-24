"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Magnetic, ReadingProgress } from "./studio-motion";
import teaLogo from "@/public/logoTea.webp";

const Ctx = createContext<((href: string) => void) | null>(null);
const EASE = "cubic-bezier(.65,0,.35,1)";
const move = (el: Element, from: string, to: string, ms: number) =>
  el.animate(
    [{ transform: `translateY(${from})` }, { transform: `translateY(${to})` }],
    { duration: ms, easing: EASE, fill: "forwards" },
  ).finished;

function settle(hash: string) {
  const id = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
  if (id) id.scrollIntoView({ behavior: "instant" });
  else window.scrollTo({ top: 0, behavior: "instant" });
  const f = id || document.querySelector<HTMLElement>("main");
  f?.setAttribute("tabindex", "-1");
  f?.focus({ preventScroll: true });
}

export function StudioTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const job = useRef<{ wait: Promise<unknown>; hash: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prev = useRef(pathname);

  // Wait until the curtain has been closed long enough to read, then open it.
  const finish = useCallback(async () => {
    const el = panel.current,
      j = job.current;
    if (!el || !j) return;
    job.current = null;
    await j.wait;
    settle(j.hash);
    await move(el, "0", "-100%", 500);
    el.getAnimations().forEach((a) => a.cancel());
    el.hidden = true;
  }, []);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    finish();
  }, [pathname, finish]);

  const go = useCallback(
    (href: string) => {
      const el = panel.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return router.push(href);
      if (!el.hidden) return;
      const u = new URL(href, location.href);
      const same =
        u.pathname === location.pathname && u.search === location.search;
      el.hidden = false;
      // close in 0.45s + hold ~0.5s so the words are readable
      const closed = Promise.all([
        move(el, "100%", "0", 450),
        new Promise((r) => setTimeout(r, 1000)),
      ]);
      el.firstElementChild?.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 450, delay: 300, easing: EASE, fill: "backwards" },
      );
      job.current = {
        hash: u.hash,
        wait: same
          ? closed.then(() =>
              history.pushState(null, "", u.pathname + u.search + u.hash),
            )
          : closed,
      };
      clearTimeout(timer.current);
      timer.current = setTimeout(finish, 3000); // safety net
      if (same) finish();
      else router.push(href, { scroll: false });
    },
    [router, finish],
  );

  return (
    <Ctx.Provider value={go}>
      {children}
      <div
        ref={panel}
        hidden
        aria-hidden="true"
        className="motion-kill fixed inset-x-0 -inset-y-20 z-[200] flex items-center justify-center rounded-[50%/80px] bg-[var(--accent)] text-[#240b17] will-change-transform"
      >
        <div className="px-6 text-center">
          <span className="block font-mono text-[11px] tracking-[.14em] uppercase">
            Tea Rose Design Studio
          </span>
          <p className="font-display mt-4 text-[clamp(48px,12vw,130px)]/[.95] tracking-[-.05em]">
            Spill the Tea.
          </p>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export function StudioLink({
  href,
  onClick,
  transitionOnSamePage = false,
  ...props
}: ComponentProps<typeof Link> & { transitionOnSamePage?: boolean }) {
  const go = useContext(Ctx);
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (
          !go ||
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0 ||
          props.target === "_blank" ||
          props.download ||
          typeof href !== "string"
        )
          return;
        const u = new URL(href, location.href);
        const same =
          u.pathname === location.pathname && u.search === location.search;
        if (
          u.origin !== location.origin ||
          (same && !(transitionOnSamePage && u.hash))
        )
          return;
        e.preventDefault();
        go(href);
      }}
    />
  );
}

const links = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "The Studio" },
  { href: "/services", label: "What We Do" },
  { href: "/work", label: "Selected Work" },
  { href: "/#launch-24", label: "Launch 24" },
];

export function StudioNavigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <>
      <ReadingProgress />
      <header
        className={`fixed inset-x-0 top-0 z-[60] flex min-h-[80px] items-center justify-between gap-4 border-b border-transparent px-[clamp(24px,4vw,64px)] pt-[env(safe-area-inset-top)] text-[var(--foreground)] transition-colors duration-300 min-[761px]:min-h-[94px] ${
          scrolled
            ? "border-[#fff3f71a] bg-[#120910f5] min-[761px]:backdrop-blur-md"
            : ""
        }`}
      >
        <StudioLink
          href="/"
          aria-label="Tea Rose Design Studio home"
          className="h-[60px] w-[75px] min-[761px]:h-[68px] min-[761px]:w-[90px]"
        >
          <Image
            src={teaLogo}
            alt="Tea Rose Design Studio"
            sizes="90px"
            preload
            unoptimized
            className="h-full w-full object-contain"
          />
        </StudioLink>

        <nav
          aria-label="Main navigation"
          className="flex gap-[clamp(20px,3vw,45px)] text-sm max-[760px]:hidden"
        >
          {links.map((l) => (
            <StudioLink
              key={l.label}
              href={l.href}
              aria-current={
                pathname === l.href ||
                (l.href === "/work" && pathname.startsWith("/work/"))
                  ? "page"
                  : undefined
              }
              className="relative py-2 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 aria-[current=page]:after:origin-left aria-[current=page]:after:scale-x-100"
            >
              {l.label}
            </StudioLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 min-[761px]:gap-4">
          <Magnetic>
            <a
              href="https://cal.com/project-24-iyyo9f/spill-the-tea"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--accent)] px-4 text-sm text-[#240b17] transition-colors hover:bg-[#ffc4dc] min-[761px]:px-6"
            >
              Let’s talk
            </a>
          </Magnetic>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label="Open navigation"
              className="hidden min-h-[44px] p-2 max-[760px]:inline-flex"
            >
              Menu
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Popup className="motion-kill fixed inset-0 z-[101] flex flex-col justify-center overflow-y-auto bg-[var(--accent)] px-[7vw] py-24 text-[#2c1422] transition-[opacity,transform] duration-300 data-[ending-style]:translate-y-3 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-3 data-[starting-style]:opacity-0">
                <Dialog.Title className="sr-only">
                  Studio navigation
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Close navigation"
                  className="absolute top-[max(25px,env(safe-area-inset-top))] right-6 min-h-[44px] p-3"
                >
                  Close
                </Dialog.Close>
                <span className="font-mono text-sm tracking-[.14em] uppercase">
                  Pull up a chair.
                </span>
                <nav
                  aria-label="Mobile navigation"
                  className="mt-9 flex flex-col"
                >
                  {links.map((l, i) => (
                    <StudioLink
                      key={l.label}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-display flex min-h-[44px] items-baseline gap-5 border-t border-[#2c142244] py-4 text-[clamp(30px,8vw,56px)] tracking-[-.05em]"
                    >
                      <small className="font-mono text-sm tracking-normal">
                        0{i + 1}
                      </small>
                      {l.label}
                    </StudioLink>
                  ))}
                </nav>
                <p className="mt-9 text-sm">
                  India & beyond. Ideas, freshly brewed.
                </p>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
