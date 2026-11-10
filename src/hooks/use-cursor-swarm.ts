import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * CursorSwarm integration (https://github.com/Kinglowther/cursor-swarm.js — MIT, by ZhengLinLei).
 *
 * The library is served as a plain script from /public so it never touches SSR or the bundler.
 * It turns the page into a blank canvas and lets a team of agent cursors build it as you scroll.
 *
 * Opt elements out with `data-cs-ignore` (anything React updates live: typewriter, counters,
 * fixed chrome, modals).
 */

type SwarmState = "idle" | "running" | "paused" | "stopped" | "destroyed";
interface SwarmInstance {
  state: SwarmState;
  init(): SwarmInstance;
  destroy(): SwarmInstance;
  setPalette(palette: unknown): SwarmInstance;
}
type SwarmCtor = new (opts: Record<string, unknown>) => SwarmInstance;
type SwarmStatus = "loading" | "ready" | "failed";

const SCRIPT_SRC = "/cursor-swarm.min.js";
const LOAD_TIMEOUT_MS = 6000;

const DARK_PALETTE = {
  colors: ["#00ff41", "#2ee6ff", "#c6ff3b"],
  hud: {
    background: "rgba(10,10,10,.72)",
    color: "#f1efe9",
    mute: "#a3a29d",
    border: "rgba(255,255,255,.12)",
  },
};

const LIGHT_PALETTE = {
  colors: ["#0a8a35", "#0a6f8c", "#5a8a00"],
  hud: {
    background: "rgba(255,255,255,.85)",
    color: "#111",
    mute: "#666",
    border: "rgba(0,0,0,.12)",
  },
};

const paletteForTheme = () =>
  document.documentElement.classList.contains("dark") ? DARK_PALETTE : LIGHT_PALETTE;

function loadSwarmScript(): Promise<SwarmCtor> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { CursorSwarm?: SwarmCtor };
    if (w.CursorSwarm) return resolve(w.CursorSwarm);

    const el = document.createElement("script");
    el.src = SCRIPT_SRC;
    el.async = true;
    el.onload = () =>
      w.CursorSwarm ? resolve(w.CursorSwarm) : reject(new Error("CursorSwarm global missing"));
    el.onerror = () => reject(new Error(`Failed to load ${SCRIPT_SRC}`));
    document.head.appendChild(el);
  });
}

/**
 * @param bootDone true once the boot loader has finished its own timer.
 * @returns `settled` — false while the library script is still loading, so the caller can keep
 *          the boot loader up and avoid a flash of the fully-built page before the swarm starts.
 */
export function useCursorSwarm(bootDone: boolean): { settled: boolean } {
  const [status, setStatus] = useState<SwarmStatus>("loading");
  const ctorRef = useRef<SwarmCtor | null>(null);

  // 1) Fetch the script while the boot loader is still on screen.
  useEffect(() => {
    let alive = true;
    loadSwarmScript()
      .then((ctor) => {
        ctorRef.current = ctor;
        if (alive) setStatus("ready");
      })
      .catch((err) => {
        console.warn("[cursor-swarm] disabled:", err);
        if (alive) setStatus("failed");
      });
    const timeout = setTimeout(() => {
      if (alive) setStatus((s) => (s === "loading" ? "failed" : s));
    }, LOAD_TIMEOUT_MS);
    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, []);

  // 2) Start the swarm in a layout effect so it hides the page in the same frame the loader
  //    disappears — no flash of fully-built content.
  useLayoutEffect(() => {
    const Swarm = ctorRef.current;
    if (!bootDone || status !== "ready" || !Swarm) return;

    const html = document.documentElement;
    const swarm = new Swarm({
      agents: [
        { name: "ARCHITECT", role: ["layout", "media"] },
        { name: "WRITER", role: "type" },
        { name: "EDITOR", role: "type" },
      ],
      palette: paletteForTheme(),
      startPosition: "outside",
      hudPosition: "bottom-right", // bottom-left is occupied by the side nav
      trigger: 0.88,
      deconstruct: true,
      speed: 0.65,
      maxSpeed: 1.4,
      typeDuration: 2.2,
    }).init();

    // `stopped` = prefers-reduced-motion: the page stays a normal, fully visible page.
    if (swarm.state === "running") html.classList.add("swarm-on");

    // Keep agent colours in sync with the existing dark/light toggle (class on <html>).
    const themeObserver = new MutationObserver(() => swarm.setPalette(paletteForTheme()));
    themeObserver.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      themeObserver.disconnect();
      swarm.destroy();
      html.classList.remove("swarm-on");
    };
  }, [bootDone, status]);

  return { settled: status !== "loading" };
}

