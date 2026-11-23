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

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate | null>(null);
const curtainTiming = {
  duration: 650,
  easing: "cubic-bezier(.76,0,.24,1)",
  fill: "forwards" as const,
};

export function StudioTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const animation = useRef<Animation | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPath = useRef(pathname);
  const pendingHash = useRef("");

  const uncover = useCallback(() => {
    const el = curtain.current;
    if (fallback.current) clearTimeout(fallback.current);
    if (!el) return;
    animation.current?.cancel();
    animation.current = el.animate(
      [{ transform: "perspective(1800px) rotateY(0deg)" }, { transform: "perspective(1800px) rotateY(-100deg)" }],
      { ...curtainTiming, duration: 700 },
    );
    animation.current.finished
      .then(() => {
        el.hidden = true;
        busy.current = false;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (!busy.current) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    const frame = requestAnimationFrame(() => {
      const target = pendingHash.current
        ? document.getElementById(
            decodeURIComponent(pendingHash.current.slice(1)),
          )
        : null;
      target?.scrollIntoView({ behavior: "instant" });
      pendingHash.current = "";
      uncover();
      const main = target ?? document.querySelector<HTMLElement>("main");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, uncover]);

  useEffect(
    () => () => {
      animation.current?.cancel();
      if (fallback.current) clearTimeout(fallback.current);
    },
    [],
  );

  const navigate = useCallback<Navigate>(
    (href) => {
      const url = new URL(href, window.location.href);
      const samePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !curtain.current
      ) {
        router.push(href);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      pendingHash.current = url.hash;
      const el = curtain.current;
      animation.current?.cancel();
      el.dataset.turn = "work";
      el.hidden = false;
      animation.current = el.animate(
        [{ transform: "perspective(1800px) rotateY(100deg)" }, { transform: "perspective(1800px) rotateY(0deg)" }],
        { ...curtainTiming },
      );
      fallback.current = setTimeout(uncover, 4500);
      animation.current.finished
        .then(() => {
          if (!samePage) {
            router.push(href, { scroll: false });
            return;
          }
          window.history.pushState(
            null,
            "",
            `${url.pathname}${url.search}${url.hash}`,
          );
          const target = url.hash
            ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
            : null;
          if (target)
            target.scrollIntoView({ behavior: "instant", block: "start" });
          else window.scrollTo({ top: 0, behavior: "instant" });
          const focusTarget =
            target ?? document.querySelector<HTMLElement>("main");
          focusTarget?.setAttribute("tabindex", "-1");
          focusTarget?.focus({ preventScroll: true });
          pendingHash.current = "";
          uncover();
        })
        .catch(() => {
          busy.current = false;
          el.hidden = true;
        });
    },
    [router, uncover],
  );

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        className="group motion-kill st-curtain-hidden fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_50%_100%,#67213f_0%,#21101c_52%,#120910_100%)] p-[clamp(24px,4vw,56px)] text-[#fff3f7] data-[turn=work]:bg-[#f1e8e4] data-[turn=work]:text-[#120910] data-[turn=work]:[backface-visibility:hidden] data-[turn=work]:[transform-origin:left_center] data-[turn=work]:shadow-[25px_0_80px_#0005] data-[turn=work]:after:pointer-events-none data-[turn=work]:after:absolute data-[turn=work]:after:inset-[0_auto_0_0] data-[turn=work]:after:w-[30px] data-[turn=work]:after:bg-[linear-gradient(90deg,#12091026,transparent)] data-[turn=work]:after:content-['']"
        ref={curtain}
        hidden
        aria-hidden="true"
      >
        <div className="flex justify-center group-data-[turn=work]:hidden animate-[st-curtain-mark-in_.6s_cubic-bezier(.16,1,.3,1)_both]">
          <Image
            src={teaLogo}
            alt=""
            sizes="140px"
            className="h-auto w-[clamp(72px,10vw,130px)] object-contain"
          />
        </div>
        <div className="hidden group-data-[turn=work]:flex group-data-[turn=work]:flex-1 group-data-[turn=work]:flex-col group-data-[turn=work]:justify-center">
          <span className="font-mono text-[10px]/[1.5] tracking-[.12em] uppercase">
            Tea Rose / The collection
          </span>
          <p className="font-sans my-[35px] text-[clamp(54px,9vw,145px)]/[.95] font-semibold tracking-[-.07em]">
            Turning
            <br />
            <em className="font-display text-[1.1em]/none tracking-[-.04em] text-[#a20f4c] not-italic">
              a new leaf.
            </em>
          </p>
          <span className="font-mono text-[10px]/[1.5] tracking-[.12em] uppercase">
            Good ideas deserve a good story. ↗
          </span>
        </div>
        <span>Tea Rose Design Studio</span>
      </div>
    </TransitionContext.Provider>
  );
}

export function StudioLink({
  href,
  onClick,
  transitionOnSamePage = false,
  ...props
}: ComponentProps<typeof Link> & { transitionOnSamePage?: boolean }) {
  const navigate = useContext(TransitionContext);
  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          !navigate ||
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0 ||
          props.target === "_blank" ||
          props.download
        )
          return;
        const value = typeof href === "string" ? href : null;
        if (!value) return;
        const url = new URL(value, window.location.href);
        if (url.origin !== window.location.origin) return;
        const samePage =
          url.pathname === window.location.pathname &&
          url.search === window.location.search;
        if (samePage && (!transitionOnSamePage || !url.hash)) return;
        event.preventDefault();
        navigate(value);
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
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <>
      <ReadingProgress />
      <header
        className={`fixed inset-x-0 top-0 bottom-auto z-[60] flex min-h-[94px] items-center justify-between gap-6 border-b border-b-transparent pt-[max(10px,env(safe-area-inset-top))] pr-[max(clamp(24px,4vw,64px),env(safe-area-inset-right))] pb-[10px] pl-[max(clamp(24px,4vw,64px),env(safe-area-inset-left))] text-[var(--foreground)] transition-[background,border-color] duration-[400ms] max-[760px]:min-h-[80px] max-[760px]:gap-[15px] max-[760px]:py-[5px] ${scrolled ? "bg-[#120910e8] border-b-[#fff3f71a] backdrop-blur-[20px]" : ""}`}
      >
        <StudioLink
          href="/"
          aria-label="Tea Rose Design Studio home"
          className="flex h-[68px] w-[90px] items-center max-[760px]:h-[60px] max-[760px]:w-[75px]"
        >
          <Image
            src={teaLogo}
            alt="Tea Rose Design Studio"
            sizes="90px"
            preload
            className="h-full w-full object-contain"
          />
        </StudioLink>
        <nav
          aria-label="Main navigation"
          className="flex gap-[clamp(22px,3vw,45px)] text-sm max-[1000px]:gap-5 max-[760px]:hidden"
        >
          {links.map((link) => (
            <StudioLink
              key={link.label}
              href={link.href}
              aria-current={pathname === link.href || (link.href === "/work" && pathname.startsWith("/work/")) ? "page" : undefined}
              className="relative py-[10px] after:absolute after:bottom-[3px] after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-[350ms] after:content-[''] hover:after:origin-left hover:after:scale-x-100 aria-[current=page]:after:origin-left aria-[current=page]:after:scale-x-100"
            >
              {link.label}
            </StudioLink>
          ))}
        </nav>
        <div className="flex items-center gap-4 max-[760px]:gap-2">
          <Magnetic>
            <a
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-[22px] rounded-full border border-transparent px-[23px] py-[14px] text-sm leading-[1.4] transition-[background-color,color] duration-[250ms] bg-[var(--accent)] text-[#240b17] hover:bg-[#ffc4dc] hover:text-[#240b17] max-[760px]:gap-3 max-[760px]:px-[16px] max-[760px]:py-[11px] max-[760px]:text-sm"
              href="https://cal.com/project-24-iyyo9f/spill-the-tea"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let’s talk
            </a>
          </Magnetic>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="hidden min-h-[44px] cursor-pointer p-[10px] text-base max-[760px]:inline-flex"
              aria-label="Open navigation"
            >
              Menu
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-[100] bg-[#120910b3] backdrop-blur-[12px]" />
              <Dialog.Popup className="motion-kill fixed inset-0 z-[101] flex flex-col justify-center overflow-y-auto bg-[var(--accent)] px-[7vw] pt-[max(10vw,calc(env(safe-area-inset-top)+64px))] pb-[max(10vw,calc(env(safe-area-inset-bottom)+32px))] text-[#2c1422] animate-[st-ink-menu_.65s_cubic-bezier(.76,0,.24,1)_both]">
                <Dialog.Title className="sr-only">
                  Studio navigation
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Close navigation"
                  className="absolute top-[max(25px,env(safe-area-inset-top))] right-[25px] min-h-[44px] cursor-pointer p-3 text-base"
                >
                  Close
                </Dialog.Close>
                <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">Pull up a chair.</span>
                <nav aria-label="Mobile navigation" className="mt-[35px] flex flex-col">
                  {links.map((link, i) => (
                    <StudioLink
                      href={link.href}
                      key={link.label}
                      onClick={() => setOpen(false)}
                      className="font-display flex min-h-[44px] items-baseline gap-5 border-t border-t-[#2c142244] py-[18px] text-[clamp(30px,6vw,60px)] tracking-[-.05em] [@media(max-height:520px)_and_(orientation:landscape)]:py-2 [@media(max-height:520px)_and_(orientation:landscape)]:text-[clamp(24px,5vw,36px)]"
                    >
                      <small className="font-mono text-sm tracking-normal">0{i + 1}</small>
                      {link.label}

                    </StudioLink>
                  ))}
                </nav>
                <p className="mt-[35px] text-sm">India & beyond. Ideas, freshly brewed.</p>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
