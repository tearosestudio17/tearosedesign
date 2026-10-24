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
import { ArrowUpRight, Menu, X } from "lucide-react";
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
      [{ transform: "translateY(0%)" }, { transform: "translateY(-101%)" }],
      curtainTiming,
    );
    animation.current.finished
      .then(() => {
        el.hidden = true;
        busy.current = false;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = curtain.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    try {
      if (sessionStorage.getItem("tea-rose:intro")) return;
    } catch {
      /* The intro also works when session storage is unavailable. */
    }
    el.hidden = false;
    animation.current = el.animate(
      [{ transform: "translateY(0%)" }, { transform: "translateY(-101%)" }],
      { ...curtainTiming, delay: 400, duration: 900 },
    );
    animation.current.finished
      .then(() => {
        el.hidden = true;
        try {
          sessionStorage.setItem("tea-rose:intro", "seen");
        } catch {
          /* Storage is optional. */
        }
      })
      .catch(() => {});
    return () => {
      animation.current?.cancel();
      el.hidden = true;
    };
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
      el.hidden = false;
      animation.current = el.animate(
        [{ transform: "translateY(101%)" }, { transform: "translateY(0%)" }],
        curtainTiming,
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
      <div className="st-curtain" ref={curtain} hidden aria-hidden="true">
        <div className="st-curtain-mark">
          <Image src={teaLogo} alt="" sizes="140px" />
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
  { href: "/studio", label: "The studio" },
  { href: "/services", label: "Our services" },
  { href: "/#brand-worlds", label: "Brand worlds" },
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
      <header className={`st-nav ${scrolled ? "is-scrolled" : ""}`}>
        <StudioLink
          href="/"
          aria-label="Tea Rose Design Studio home"
          className="st-nav-brand"
        >
          <Image
            src={teaLogo}
            alt="Tea Rose Design Studio"
            sizes="90px"
            preload
          />
        </StudioLink>
        <nav aria-label="Main navigation" className="st-desktop-nav">
          {links.map((link) => (
            <StudioLink
              key={link.label}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </StudioLink>
          ))}
        </nav>
        <div className="st-nav-actions">
          <Magnetic>
            <StudioLink className="st-button st-button-pink" href="/#contact">
              Let’s talk <ArrowUpRight size={16} />
            </StudioLink>
          </Magnetic>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="st-menu-toggle"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="st-menu-backdrop" />
              <Dialog.Popup className="st-menu-panel">
                <Dialog.Title className="sr-only">
                  Studio navigation
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Close navigation"
                  className="st-menu-close"
                >
                  <X size={26} />
                </Dialog.Close>
                <span className="st-label">Pull up a chair.</span>
                <nav aria-label="Mobile navigation">
                  {links.map((link, i) => (
                    <StudioLink
                      href={link.href}
                      key={link.label}
                      onClick={() => setOpen(false)}
                    >
                      <small>0{i + 1}</small>
                      {link.label}
                      <ArrowUpRight />
                    </StudioLink>
                  ))}
                </nav>
                <p>India & beyond. Ideas, freshly brewed.</p>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
