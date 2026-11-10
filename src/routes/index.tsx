import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { createContext, useContext, useEffect as useEffectReact, useState as useStateReact, type ReactNode } from "react";
import { ExternalLink, Globe, Mail } from "lucide-react";
import { useCursorSwarm } from "../hooks/use-cursor-swarm";

// Static asset imports — Vite resolves these to hashed URLs
import darkLogoSrc from "../assets/BLACK LOGO HD.png";
import lightLogoSrc from "../assets/WHITE LOGO HD.png";
import ceoPhotoSrc from "../assets/PORTFOLIO IMAGE 3.png";

// ---------------------------------------------------------------------------
// Theme context — class-based (.dark on <html>)
// ---------------------------------------------------------------------------
type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useStateReact<Theme>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("theme") as Theme) ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      );
    }
    return "dark";
  });

  useEffectReact(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-10 h-10 rounded-md border border-border bg-background/50 hover:bg-background/80 transition-colors"
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? (
        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// LogoMark — swaps BLACK/WHITE logo instantly on theme toggle.
// Hooked into the same ThemeContext; no second state source.
// ---------------------------------------------------------------------------
function LogoMark({ className }: { className?: string }) {
  const { theme } = useTheme();
  return (
    <img
      src={theme === "dark" ? darkLogoSrc : lightLogoSrc}
      alt="Quantrix Labs"
      className={className ?? "h-9 w-auto object-contain"}
    />
  );
}

// ---------------------------------------------------------------------------
// Route metadata
// ---------------------------------------------------------------------------
const SITE_URL = "https://davidnjaugithehu.vercel.app"; // CONFIRM: update if domain changes

export const Route = createFileRoute("/")(
  {
    head: () => ({
      meta: [
        { title: "Quantrix Labs — Engineering Intelligence | by David Njau Githehu" },
        {
          name: "description",
          content:
            "Quantrix Labs — a software development studio founded by David Njau Githehu. Delivering web products, AI-integrated systems, and IT infrastructure from Nairobi, Kenya.",
        },
        {
          name: "keywords",
          content:
            "Quantrix Labs, Best Web Developer in Kenya, Best AI Developer in Kenya, Best IT Infrastructure Developer in Kenya,Best software developer in Kenya,Top developer in Nairobi,Top developer in Africa,Software company in Kenya,Software studio Nairobi, Best software company in Kenya,Ai specialist in Kenya,Ai, Artificial Intelligence, Machine Learning, AI Engineer, Neural Networks, Deep Learning, Data Science,  David Njau Githehu, software studio Nairobi, web development Kenya, AI systems Africa, IT infrastructure Nairobi, React developer Kenya, full-stack studio East Africa",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: "Quantrix Labs — Engineering Intelligence" },
        {
          property: "og:description",
          content:
            "Software studio delivering web products, AI-integrated systems, and IT infrastructure. Founded by David Njau Githehu, Nairobi, Kenya.",
        },
        { property: "og:url", content: SITE_URL },
        { property: "og:image", content: `${SITE_URL}/black logo hd.png` },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Quantrix Labs" },
      ],
      links: [{ rel: "canonical", href: SITE_URL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Quantrix Labs",
            url: SITE_URL,
            description:
              "Software development studio delivering web products, AI-integrated systems, and IT infrastructure.",
            foundingDate: "2023",
            founder: {
              "@type": "Person",
              name: "David Njau Githehu",
              jobTitle: "Founder & CEO",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nairobi",
              addressCountry: "KE",
            },
            areaServed: ["Nairobi", "Kenya", "East Africa", "Remote"],
            serviceType: ["Web Development", "AI Solutions", "IT Infrastructure", "DevOps"],
            sameAs: [
              "https://github.com/Kinglowther",
              "https://www.linkedin.com/in/david-njau-githehu-9048831b9/",
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "David Njau Githehu",
            alternateName: "David Njau",
            jobTitle: "Founder & CEO, Quantrix Labs",
            worksFor: { "@type": "Organization", name: "Quantrix Labs" },
            url: SITE_URL,
            sameAs: [
              "https://github.com/Kinglowther",
              "https://www.linkedin.com/in/david-njau-githehu-9048831b9/",
            ],
          }),
        },
      ],
    }),
    component: Index,
  }
);

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------
const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Services" },
  { id: "contact", label: "Contact" },
];

const ROLES = ["Web & Product Development", "AI-Integrated Systems", "Infrastructure & DevOps"];

interface PlatformDetail {
  title: string;
  badge: string;
  summary: string;
  highlights: string[];
}

interface WebsiteDetail {
  title: string;
  url: string;
  category: string;
  desc: string;
}

interface ProjectItem {
  name: string;
  stack: string;
  desc: string;
  snippet: string;
  platforms?: PlatformDetail[];
  websites?: WebsiteDetail[];
}

const PROJECTS: ProjectItem[] = [
  {
    name: "Automations & Operation Platforms",
    stack: "AI Workflows · FinTech · Custom Operations · Quant Tools",
    desc: "Bespoke operations platforms, algorithmic trading workflows, discipline-focused tracking apps, and high-efficiency enterprise tools engineered by Quantrix Labs.",
    snippet: `// Quantrix Automation & Operations Engine\nconst engine = new PlatformCluster({\n  subsystems: ["AbacusWorkspace", "MarketExecution", "AscendJournal"],\n  orchestrator: "Quantrix-Core",\n});\nawait engine.initializePipelines();`,
    platforms: [
      {
        title: "Abacus Workspace",
        badge: "Enterprise Operations",
        summary:
          "AI-powered multi-tenant operations ecosystem and enterprise workflow hub. Agent-driven pipelines built on Claude and Supabase Edge Functions replace manual ops pipelines across teams, automating real estate client routing, record dispatching, and transaction workflows.",
        highlights: [
          "Agent-driven Claude workflows",
          "Multi-tenant data isolation",
          "Autonomous pipeline dispatching",
        ],
      },
      {
        title: "Trading & Stock Market Automation Tools",
        badge: "FinTech & Quant Systems",
        summary:
          "Algorithmic execution engines, automated quantitative market scanners, and real-time stock/crypto alert frameworks. Designed with low-latency APIs to spot technical setups, manage risk parameters, and automate trade entries, exits, and notifications.",
        highlights: [
          "Real-time market scanning",
          "Automated execution & alert triggers",
          "Algorithmic risk controls",
        ],
      },
      {
        title: "Ascend Roadmap",
        badge: "Trading Self-Tracking & Journal",
        summary:
          "A proprietary trading self-tracking and discipline journal web application engineered to elevate trader psychology. Logs trades, tracks win rates and drawdowns, scores discipline adherence, and identifies edge patterns through comprehensive visual analytics.",
        highlights: [
          "Rule compliance & discipline scoring",
          "Interactive trade journaling",
          "Equity curve & drawdown analytics",
        ],
      },
      {
        title: "Bespoke Internal & Ops Platforms",
        badge: "Custom Tooling",
        summary:
          "Custom business operations engines, inventory management suites, automated client invoicing systems, and telemetry dashboards built to remove repetitive overhead and scale team operations.",
        highlights: [
          "Zero-friction workflow integrations",
          "Scheduled automated reporting",
          "Custom operational bots",
        ],
      },
    ],
  },
  {
    name: "Registry",
    stack: "React · Supabase · AI-Assisted Workflows",
    desc: "Church member management system with AI-assisted data entry and automated reporting. Delivered by Quantrix Labs — real-time records at scale.",
    snippet: `const { data } = await supabase\n  .from('members')\n  .select('*, groups(*)')\n  .eq('status', 'active');\nawait ai.enrichRecords(data);`,
  },
  {
    name: "Website Build, Revamp & Optimization",
    stack: "React · Netlify · SEO · Performance",
    desc: "Studio-wide web delivery across all three modes: ground-up builds, redesigns, and performance/SEO optimization across client sites.",
    snippet: `// Lighthouse: perf 98 · SEO 100\nconst report = await audit(url);\nawait deploy({ edge: true,\n  prerender: staticRoutes });`,
    websites: [
      {
        title: "Portfolio",
        url: "https://davidnjaugithehu.vercel.app/",
        category: "Digital Showcase & Studio",
        desc: "Flagship personal portfolio and interactive digital engineering laboratory featuring modern 3D depth, particle physics, and sleek dark mode aesthetics.",
      },
      {
        title: "BBQ Restaurant with Online Ordering",
        url: "https://fillyzbbq.vercel.app/",
        category: "Restaurant & E-Commerce",
        desc: "High-conversion BBQ restaurant web platform featuring dynamic digital menus, real-time online ordering flow, WhatsApp integration, and table reservations.",
      },
      {
        title: "Property Agency Site",
        url: "https://www.abacus-property.com/",
        category: "Real Estate & Commercial",
        desc: "Corporate property agency website for Abacus Property Consultants, showcasing commercial and residential listings with structured lead capture funnels.",
      },
      {
        title: "Clothing Store Portfolio",
        url: "https://finderskeeperske.vercel.app/",
        category: "Fashion & Retail Showcase",
        desc: "Curated thrift and fashion brand showcase with responsive product galleries, editorial lookbooks, and high-conversion aesthetic design.",
      },
      {
        title: "Outdoor Community",
        url: "https://dndunplugged.vercel.app/",
        category: "Adventure & Community Hub",
        desc: "Vibrant outdoor travel and hiking community platform connecting explorers, featuring upcoming expedition schedules, registration flows, and photo archives.",
      },
    ],
  },
  {
    name: "Abacus IT Systems",
    stack: "Node.js · React · Docker",
    desc: "Internal tooling and infrastructure engineered for Abacus Property Consultants — production-grade uptime, containerised services, and internal dashboards.",
    snippet: `app.get('/health', (_, res) =>\n  res.json({ ok: true,\n    uptime: process.uptime() }))`,
  },
];

const SKILLS = [
  {
    title: "Web & Product Development",
    items: ["React", "Three.js", "Tailwind", "Node.js", "FastAPI", "PostgreSQL", "SEO & Optimization"],
  },
  {
    title: "AI-Integrated Systems",
    items: ["Claude API", "LLM Integration", "Agent Orchestration", "Supabase Edge Functions", "ML Pipelines"],
  },
  {
    title: "Infrastructure & DevOps",
    items: ["Docker", "CI/CD", "Git", "Linux", "Nginx"],
  },
  {
    title: "Graphics, Design & Growth",
    items: [
      "Graphics & Brand Design",
      "Social Media Strategy & Content",
      "Google Ads Campaigns",
      "Google Analytics & Conversion Tracking",
    ],
  },
];

const STATS = [
  { value: 6, suffix: "+", label: "Years coding" },
  { value: 40, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "+", label: "Systems deployed" },
  { value: 99, suffix: "%", label: "Uptime delivered" },
];

// Shared static glassmorphism style for the section cards (the CursorSwarm draws them in live)
const GLASS_STYLE: React.CSSProperties = {
  background: "transparent",
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
  border: "1px solid color-mix(in oklab, var(--neon) 25%, var(--border))",
  boxShadow: [
    "0 0 0 1px color-mix(in oklab, var(--neon) 10%, transparent)",
    "0 0 60px color-mix(in oklab, var(--neon) 8%, transparent)",
  ].join(", "),
};

// ---------------------------------------------------------------------------
// Index page
// ---------------------------------------------------------------------------
function Index() {
  const [active, setActive] = useState("hero");
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const fragRef = useRef<HTMLDivElement>(null);
  // Agent cursors build the page as you scroll. `settled` stays false until the library has
  // loaded so the boot loader can cover the page and hide any flash.
  const { settled } = useCursorSwarm(!loading);

  // rAF-throttled scroll: writes directly to DOM (zero React re-renders on scroll).
  // Handles: progress bar, hero fade, frag parallax.
  useEffect(() => {
    let ticking = false;
    const apply = () => {
      ticking = false;
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? y / h : 0;

      if (progressRef.current) progressRef.current.style.width = `${p * 100}%`;

      if (heroRef.current) {
        heroRef.current.style.opacity = String(Math.max(0, 1 - y / 700));
      }

      if (fragRef.current) {
        fragRef.current.style.setProperty("--sy", String(y));
      }
    };

    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Boot loader
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // Typewriter — cycles through ROLES
  useEffect(() => {
    const role = ROLES[roleIdx];
    let i = 0;
    let deleting = false;
    const tick = () => {
      if (!deleting) {
        i++;
        setTyped(role.slice(0, i));
        if (i === role.length) { setTimeout(() => { deleting = true; loop(); }, 1400); return; }
      } else {
        i--;
        setTyped(role.slice(0, i));
        if (i === 0) { setRoleIdx((r) => (r + 1) % ROLES.length); return; }
      }
      loop();
    };
    const loop = () => setTimeout(tick, deleting ? 40 : 80);
    const id = setTimeout(tick, 200);
    return () => clearTimeout(id);
  }, [roleIdx]);

  // IntersectionObserver for active nav + .revealed animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
            e.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => obs.observe(el));
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Canvas: particle network + code-rain (unchanged)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const N = mobile ? 24 : 45;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
    }));

    const chars = "01{}</>=>;".split("");
    const cols = Math.floor(window.innerWidth / (mobile ? 36 : 26));
    const drops = Array.from({ length: cols }, () => Math.random() * -200);
    const colStep = mobile ? 36 : 26;

    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      const nextIsDark = document.documentElement.classList.contains("dark");
      if (nextIsDark !== isDark) {
        isDark = nextIsDark;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let frame = 0;
    const draw = () => {
      if (paused || reduce) { raf = requestAnimationFrame(draw); return; }
      frame++;
      ctx.fillStyle = isDark ? "rgba(10,10,10,0.25)" : "rgba(252,252,252,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const baseRgb = isDark ? "0,255,90" : "10,138,53";

      if (!mobile || frame % 2 === 0) {
        ctx.fillStyle = `rgba(${baseRgb},0.35)`;
        ctx.font = `${12 * dpr}px JetBrains Mono, monospace`;
        for (let i = 0; i < drops.length; i++) {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(ch, i * colStep * dpr, drops[i] * dpr);
          drops[i] = drops[i] > window.innerHeight && Math.random() > 0.975 ? 0 : drops[i] + 14;
        }
      }

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      const maxD = 140 * dpr;
      const maxD2 = maxD * maxD;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(${baseRgb},${(1 - d / maxD) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(${baseRgb},0.8)`;
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      themeObserver.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        {(loading || !settled) && <Loader />}

        {/* Scroll progress bar */}
        <div
          ref={progressRef}
          data-cs-ignore
          className="pointer-events-none fixed left-0 top-0 z-50 h-[2px]"
          style={{
            width: "0%",
            background: "linear-gradient(90deg, transparent, var(--neon))",
            boxShadow: "0 0 12px var(--neon)",
            transition: "width 0.12s linear",
          }}
        />

        {/* Background layers */}
        <canvas
          ref={canvasRef}
          data-cs-ignore
          className="pointer-events-none fixed inset-0 z-0 opacity-60"
        />
        <FloatingFragments innerRef={fragRef} />
        <div
          data-cs-ignore
          className="pointer-events-none fixed inset-x-0 top-0 z-10 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, var(--neon), transparent)",
            boxShadow: "0 0 12px var(--neon)",
            animation: "scanline 7s linear infinite",
          }}
        />

        {/* ── Sidebar nav — structure & behaviour unchanged ── */}
        <nav data-cs-ignore className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center justify-between border-r border-border/60 bg-background/40 py-8 backdrop-blur md:flex lg:w-28">
          <LogoMark className="h-8 w-auto max-w-[56px] object-contain px-1" />
          <ul className="flex flex-col gap-6">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollTo(s.id)}
                  className={`group flex flex-col items-center gap-1 font-mono text-xs transition ${active === s.id ? "neon-text" : "text-foreground/50 hover:text-foreground"
                    }`}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className="w-px transition-all"
                    style={{
                      background: active === s.id ? "var(--neon)" : "currentColor",
                      height: active === s.id ? "32px" : "12px",
                    }}
                  />
                  <span className="hidden lg:block [writing-mode:vertical-rl]">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="font-mono text-[10px] text-foreground/40">NRB</div>
          <ThemeToggle />
        </nav>

        {/* Mobile header */}
        <header data-cs-ignore className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/70 px-5 py-4 backdrop-blur md:hidden">
          <LogoMark className="h-7 w-auto object-contain" />
          <div className="flex items-center gap-2">
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="neon-text font-mono text-sm"
            >
              {menuOpen ? "[ close ]" : "[ menu ]"}
            </button>
            <ThemeToggle />
          </div>
        </header>
        {menuOpen && (
          <div data-cs-ignore className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur md:hidden">
            {SECTIONS.map((s, i) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="font-display text-3xl font-bold">
                <span className="neon-text font-mono text-sm">{String(i + 1).padStart(2, "0")}.</span>{" "}
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Main content ── */}
        <main className="scene-3d relative z-20 md:pl-20 lg:pl-28">

          {/* HERO — not a stack card */}
          <section id="hero" data-section className="flex min-h-screen items-center px-6 pt-24 md:px-16 md:pt-0">
            <div ref={heroRef} className="w-full max-w-5xl" style={{ willChange: "opacity" }}>
              <p className="neon-text mb-6 font-mono text-sm tracking-widest">
                {"// initializing quantrix_labs..."}
              </p>
              <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
                Quantrix
                <br />
                <span className="neon-text">Labs.</span>
              </h1>
              {/* Byline — visually subordinate */}
              <p className="mt-4 font-mono text-sm text-foreground/40 tracking-wide">
                by David Njau Githehu.
              </p>
              {/* Tagline */}
              <p className="mt-1 neon-text font-display text-xl font-medium tracking-tight md:text-2xl">
                Engineering Intelligence.
              </p>
              {/* Typewriter */}
              <div data-cs-ignore className="mt-8 font-mono text-xl md:text-2xl">
                <span className="text-foreground/50">{"const focus = "}</span>
                <span className="neon-text">&quot;{typed}&quot;</span>
                <span
                  className="ml-1 inline-block w-3"
                  style={{ background: "var(--neon)", animation: "blink 1s steps(1) infinite" }}
                >
                  &nbsp;
                </span>
              </div>
              <p className="mt-8 max-w-xl font-mono text-sm text-foreground/60 md:text-base">
                Quantrix Labs designs and ships end-to-end systems — from AI-integrated platforms to
                production web infrastructure, based in Nairobi, Kenya.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo("projects")}
                  className="neon-glow group flex items-center gap-2 border border-[var(--neon)] bg-[color-mix(in_oklab,var(--neon)_10%,transparent)] px-6 py-3 font-mono text-sm transition hover:bg-[color-mix(in_oklab,var(--neon)_20%,transparent)]"
                >
                  <span className="neon-text">&lt;</span>
                  view our work
                  <span className="neon-text">/&gt;</span>
                </button>
                <button
                  onClick={() => scrollTo("contact")}
                  className="group flex items-center gap-2 border border-border px-6 py-3 font-mono text-sm transition hover:border-[var(--neon)]"
                >
                  <span className="text-foreground/50">&lt;</span>
                  get in touch
                  <span className="text-foreground/50">/&gt;</span>
                </button>
              </div>
              <div className="mt-20 flex items-center gap-4 font-mono text-xs text-foreground/40">
                <span className="h-px w-12 bg-foreground/30" />
                scroll to explore
              </div>
            </div>
          </section>

          {/* ── SECTION CARDS ─────────────────────────────────────────────────
              Static glass-neon cards in normal flow. The CursorSwarm (see
              hooks/use-cursor-swarm.ts) draws each card and writes its content
              live as you scroll; scrolling back up un-builds it again.
          ─────────────────────────────────────────────────────────────────── */}

          {/* ABOUT */}
          <div className="mb-10 md:mb-16">
            <section
              id="about"
              data-section
              className="relative min-h-screen px-6 py-32 md:px-16 mx-2 md:mx-4 rounded-xl"
              style={GLASS_STYLE}
            >
              <SectionHeader num="02" title="About" />
              <div className="mt-12 grid gap-10 lg:grid-cols-2">

                {/* Company interface code block */}
                <div data-reveal className="rounded-md border border-border bg-[var(--code-bg)] p-6 font-mono text-sm leading-relaxed shadow-2xl">
                  <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                    <span className="h-3 w-3 rounded-full bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <span className="h-3 w-3 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-foreground/50">quantrix_labs.ts</span>
                  </div>
                  <pre className="whitespace-pre-wrap">
                    <span className="text-purple-400">interface</span> <span className="text-yellow-300">Company</span> {"{\n"}
                    {"  "}<span className="text-sky-300">name</span>: <span className="neon-text">&quot;Quantrix Labs&quot;</span>;{"\n"}
                    {"  "}<span className="text-sky-300">founded</span>: <span className="text-orange-300">2023</span>;{"\n"}
                    {"  "}<span className="text-sky-300">based</span>: <span className="neon-text">&quot;Nairobi, KE&quot;</span>;{"\n"}
                    {"  "}<span className="text-sky-300">focus</span>: <span className="neon-text">&quot;Web · AI · Infrastructure&quot;</span>;{"\n"}
                    {"  "}<span className="text-sky-300">services</span>: <span className="text-orange-300">string</span>[];{"\n"}
                    {"  "}<span className="text-sky-300">availableForProjects</span>: <span className="text-orange-300">true</span>;{"\n"}
                    {"}"}
                  </pre>
                </div>

                {/* Prose + stats + Meet the CEO */}
                <div data-reveal className="flex flex-col justify-center">
                  <p className="font-display text-2xl leading-snug md:text-3xl">
                    Quantrix Labs designs and ships{" "}
                    <span className="neon-text">end-to-end systems</span> — from AI-integrated
                    platforms to production web infrastructure.
                  </p>
                  <p className="mt-6 font-mono text-sm leading-relaxed text-foreground/70">
                    Founded in 2023, the studio partners with clients across East Africa and beyond —
                    engineering internal tooling, intelligent automation, and reliable web products
                    that actually run in production. We care about clean abstractions, measurable
                    outcomes, and shipping things that last.
                  </p>
                  <div className="mt-10 grid grid-cols-2 gap-6">
                    {STATS.map((s) => (
                      <Stat key={s.label} {...s} />
                    ))}
                  </div>

                  {/* Meet the CEO — nested card */}
                  <div
                    className="mt-10 rounded-md p-5"
                    style={{
                      background: "color-mix(in oklab, var(--background) 60%, transparent)",
                      border: "1px solid color-mix(in oklab, var(--neon-dim) 40%, var(--border))",
                    }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-4">
                      {"// meet_the_ceo"}
                    </div>
                    <div className="flex gap-5 items-start">
                      <img
                        src={ceoPhotoSrc}
                        alt="David Njau Githehu — Founder & CEO, Quantrix Labs"
                        className="h-20 w-20 rounded-full object-cover shrink-0"
                        style={{ outline: "2px solid var(--neon)", outlineOffset: "3px" }}
                      />
                      <div>
                        <div className="font-display text-xl font-bold">David Njau Githehu</div>
                        <div className="neon-text font-mono text-xs mt-0.5 mb-3">Founder &amp; CEO</div>
                        <p className="font-mono text-sm text-foreground/70 leading-relaxed">
                          Systems architect and full-stack engineer with 6+ years shipping production
                          software. Founded Quantrix Labs in 2023 to deliver AI-integrated systems
                          and reliable web infrastructure to clients across East Africa and beyond.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* PROJECTS */}
          <div className="mb-10 md:mb-16">
            <section
              id="projects"
              data-section
              className="relative min-h-screen px-6 py-32 md:px-16 mx-2 md:mx-4 rounded-xl"
              style={GLASS_STYLE}
            >
              <SectionHeader num="03" title="What We've Built" />
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {PROJECTS.map((p, i) => (
                  <ProjectCard key={p.name} idx={i} {...p} onOpen={() => setOpenProject(i)} />
                ))}
              </div>
            </section>
          </div>

          {/* SKILLS */}
          <div className="mb-10 md:mb-16">
            <section
              id="skills"
              data-section
              className="relative min-h-screen px-6 py-32 md:px-16 mx-2 md:mx-4 rounded-xl"
              style={GLASS_STYLE}
            >
              <SectionHeader num="04" title="What Quantrix Labs Offers" />
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {SKILLS.map((cat) => (
                  <div
                    key={cat.title}
                    data-reveal
                    className="group rounded-md border border-border bg-background/40 p-8 backdrop-blur transition hover:border-[var(--neon)]"
                  >
                    <div className="mb-6 flex items-center gap-3 font-mono text-sm text-foreground/50">
                      <span className="neon-text">{"//"}</span>
                      <span>{cat.title.toLowerCase().replace(/ /g, "_")}.module</span>
                    </div>
                    <h3 className="mb-6 font-display text-2xl font-bold">{cat.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="border border-border bg-background/60 px-3 py-1 font-mono text-xs text-foreground/80 transition group-hover:border-[var(--neon-dim)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* CONTACT */}
          <div>
            <section
              id="contact"
              data-section
              className="relative min-h-screen px-6 py-32 md:px-16 mx-2 md:mx-4 rounded-xl"
              style={{
                ...GLASS_STYLE,
              }}
            >
              <SectionHeader num="05" title="Contact" />
              <div data-reveal className="mt-12 max-w-3xl">
                <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                  Let&apos;s build something
                  <br />
                  <span className="neon-text">that actually ships.</span>
                </h2>
                <p className="mt-6 font-mono text-sm text-foreground/60">
                  {"return "}
                  <span className="neon-text">connect</span>(
                  <span className="neon-text">&quot;quantrix_labs&quot;</span>);
                </p>
              </div>
              <ContactForm />
              <div className="mt-12 grid gap-4 md:grid-cols-2">
                <ContactCard
                  label="Email"
                  value="Mail to us"
                  icon={<Mail className="h-5 w-5 text-[var(--neon)]" />}
                  href="mailto:pdnjau710@gmail.com"
                />
                <ContactCard label="GitHub" value="@Kinglowther" href="https://github.com/Kinglowther" />
                <ContactCard label="LinkedIn" value="David Njau Githehu" href="https://www.linkedin.com/in/david-njau-githehu-9048831b9/" />
                <ContactCard label="WHATSAPP" value="Whatsapp Me</>" href="https://wa.me/254743049871" />
              </div>
              <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 font-mono text-xs text-foreground/40">
                <div className="flex flex-col gap-2">
                  <span>{"// © " + new Date().getFullYear() + " quantrix labs. all systems operational."}</span>
                  <div className="footer-glow mt-1 font-mono text-xs md:text-sm font-medium tracking-wide">
                    Built and Designed in House - by David Njau Githehu
                  </div>
                </div>
                <span className="neon-text">[ NRB · KE ]</span>
              </footer>
            </section>
          </div>

        </main>

        {openProject !== null && (
          <ProjectModal
            project={PROJECTS[openProject]}
            idx={openProject}
            onClose={() => setOpenProject(null)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div data-reveal className="flex items-end gap-4">
      <span className="neon-text font-mono text-sm">{num}.</span>
      <h2 className="font-display text-4xl font-bold md:text-5xl">{title}</h2>
      <span className="mb-2 h-px flex-1 bg-border" />
    </div>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const dur = 1400;
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.floor(p * value));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref}>
      <div data-cs-ignore className="neon-text font-display text-4xl font-bold md:text-5xl">
        {n}{suffix}
      </div>
      <div className="mt-1 font-mono text-xs uppercase tracking-widest text-foreground/50">
        {label}
      </div>
    </div>
  );
}

function ProjectCard({
  name, stack, desc, snippet, idx, onOpen,
}: {
  name: string; stack: string; desc: string; snippet: string; idx: number; onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const onEnter = () => { if (ref.current) rectRef.current = ref.current.getBoundingClientRect(); };
  const onMove = (e: ReactMouseEvent) => {
    const el = ref.current; const r = rectRef.current;
    if (!el || !r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      el.style.setProperty("--ry", `${x * 18}deg`);
      el.style.setProperty("--rx", `${-y * 18}deg`);
      el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
    });
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg");
  };
  return (
    <div
      ref={ref}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}
      onClick={onOpen} data-reveal
      className="tilt-card group relative cursor-pointer overflow-hidden rounded-md border border-border bg-background/40 backdrop-blur hover:border-[var(--neon)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--neon) 22%, transparent), transparent 60%)" }}
      />
      <div className="border-b border-border bg-[var(--code-bg)] p-5">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-foreground/50">
          <span>{`project_${String(idx + 1).padStart(2, "0")}.ts`}</span>
          <span className="neon-text">●</span>
        </div>
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground/80">{snippet}</pre>
      </div>
      <div className="p-6">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-foreground/50">{stack}</div>
        <h3 className="font-display text-2xl font-bold">{name}</h3>
        <p className="mt-2 font-mono text-sm text-foreground/60">{desc}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-6 opacity-0 transition group-hover:opacity-100">
        <span className="neon-text font-mono text-sm">view project →</span>
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error"); return;
    }
    const subject = encodeURIComponent(`Quantrix Labs inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:pdnjau710@gmail.com?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  const inputCls = "w-full rounded-md border border-border bg-background/60 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-[var(--neon)]";

  return (
    <form data-reveal onSubmit={onSubmit} className="mt-12 max-w-3xl rounded-md border border-border bg-[var(--code-bg)] p-6 shadow-2xl">
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-3 font-mono text-sm text-foreground/50">get_a_free_quote.ts</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="your_name" aria-label="Your name" className={inputCls} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" aria-label="Your email" className={inputCls} />
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="// your message..." aria-label="Your message" rows={5} className={`${inputCls} mt-4 resize-y`} />
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="neon-glow group flex items-center gap-2 border border-[var(--neon)] bg-[color-mix(in_oklab,var(--neon)_10%,transparent)] px-6 py-3 font-mono text-sm transition hover:bg-[color-mix(in_oklab,var(--neon)_20%,transparent)]">
          <span className="neon-text">&lt;</span>send message<span className="neon-text">/&gt;</span>
        </button>
        {status === "error" && <span className="font-mono text-xs text-red-400">{"// error: fill all fields with a valid email"}</span>}
        {status === "sent" && <span className="neon-text font-mono text-xs">{"// opening your mail client — message ready to send"}</span>}
      </div>
    </form>
  );
}

function ContactCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon?: ReactNode;
}) {
  return (
    <a
      data-reveal
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between border border-border bg-background/40 p-6 backdrop-blur transition hover:border-[var(--neon)]"
    >
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-foreground/50">{label}</div>
        <div className="mt-1 flex items-center gap-2.5 font-display text-xl font-semibold group-hover:[color:var(--neon)]">
          {icon}
          <span>{value}</span>
        </div>
      </div>
      <span className="neon-text font-mono text-lg transition group-hover:translate-x-1">→</span>
    </a>
  );
}

function FloatingFragments({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) {
  const frags = ["{ }", "</>", "=>", "01", "fn()", "[ ]", "&&", "//", "::"];
  const items = Array.from({ length: 14 }, (_, i) => ({
    ch: frags[i % frags.length],
    left: (i * 73) % 100,
    delay: (i * 1.7) % 12,
    dur: 14 + ((i * 3) % 10),
    size: 14 + ((i * 7) % 18),
    factor: 0.1 + ((i % 5) * 0.06),
    drift: ((i % 4) - 1.5) * 20,
  }));
  return (
    <div
      ref={innerRef}
      data-cs-ignore
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ ["--sy" as never]: "0" }}
    >
      {items.map((f, i) => (
        <span key={i} className="neon-text absolute font-mono" style={{
          left: `${f.left}%`, bottom: "-10vh", fontSize: f.size, opacity: 0.25,
          animation: `float-frag ${f.dur}s linear ${f.delay}s infinite`,
          transform: `translate3d(calc(var(--sy) * ${f.drift * 0.001}px), calc(var(--sy) * ${f.factor}px), 0)`,
          willChange: "transform",
        }}>
          {f.ch}
        </span>
      ))}
    </div>
  );
}

function ProjectModal({
  project,
  idx,
  onClose,
}: {
  project: ProjectItem;
  idx: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      data-cs-ignore
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 p-3 md:p-6 backdrop-blur-md"
      onClick={onClose}
      style={{ animation: "fade-in 0.2s ease-out" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="neon-glow relative flex flex-col w-full max-w-3xl overflow-hidden rounded-xl border border-[var(--neon)] bg-background max-h-[90vh] shadow-2xl"
        style={{ animation: "scale-in 0.25s ease-out" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-[var(--code-bg)] px-5 py-3.5">
          <div className="flex items-center gap-2 font-mono text-xs text-foreground/60">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 font-semibold text-foreground/75">{`project_${String(idx + 1).padStart(2, "0")}.ts`}</span>
          </div>
          <button
            onClick={onClose}
            className="neon-text font-mono text-xs md:text-sm hover:opacity-75 transition-opacity px-2.5 py-1 rounded border border-border/50 hover:border-[var(--neon)]"
            aria-label="Close modal"
          >
            [ esc / ✕ close ]
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 custom-modal-scrollbar space-y-6">
          <div>
            <div className="inline-block rounded border border-border/80 bg-background/60 px-2.5 py-1 font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-foreground/60">
              {project.stack}
            </div>
            <h3 className="mt-2.5 font-display text-2xl md:text-3xl font-bold tracking-tight">
              {project.name}
            </h3>
            <p className="mt-3 font-mono text-sm leading-relaxed text-foreground/70">
              {project.desc}
            </p>
          </div>

          {/* Conditional 1: Platforms breakdown */}
          {project.platforms && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground/50 border-b border-border/60 pb-2">
                <span className="neon-text">{"//"}</span>
                <span className="uppercase tracking-wider font-semibold">Automations, Platforms &amp; Quant Tools</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.platforms.map((plat) => (
                  <div
                    key={plat.title}
                    className="flex flex-col justify-between rounded-lg border border-border bg-background/50 p-5 transition hover:border-[var(--neon)] hover:bg-background/80"
                  >
                    <div>
                      <div className="neon-text font-mono text-[10px] uppercase tracking-widest font-semibold">
                        [ {plat.badge} ]
                      </div>
                      <h4 className="mt-1.5 font-display text-lg font-bold text-foreground">
                        {plat.title}
                      </h4>
                      <p className="mt-2 font-mono text-xs leading-relaxed text-foreground/70">
                        {plat.summary}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
                      {plat.highlights.map((h) => (
                        <span
                          key={h}
                          className="rounded border border-border/60 bg-[var(--code-bg)] px-2 py-0.5 font-mono text-[10px] text-foreground/75"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional 2: Built websites with active links */}
          {project.websites && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 font-mono text-xs text-foreground/50">
                <div className="flex items-center gap-2">
                  <span className="neon-text">{"//"}</span>
                  <span className="uppercase tracking-wider font-semibold">Top Selection of Built Websites</span>
                </div>
                <span className="text-[11px] neon-text">5 Active Deployments</span>
              </div>
              <div className="space-y-3.5">
                {project.websites.map((site) => (
                  <div
                    key={site.title}
                    className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border border-border bg-background/50 p-4 md:p-5 transition hover:border-[var(--neon)] hover:bg-background/80"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="neon-text font-mono text-xs">●</span>
                        <h4 className="font-display text-base md:text-lg font-bold text-foreground group-hover:text-[var(--neon)] transition-colors">
                          {site.title}
                        </h4>
                        <span className="rounded border border-border/60 bg-[var(--code-bg)] px-2 py-0.5 font-mono text-[10px] text-foreground/60">
                          {site.category}
                        </span>
                      </div>
                      <p className="font-mono text-xs leading-relaxed text-foreground/70 pl-4">
                        {site.desc}
                      </p>
                    </div>
                    <div className="shrink-0 pl-4 md:pl-0">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-[var(--neon)] bg-[color-mix(in_oklab,var(--neon)_12%,transparent)] px-4 py-2 font-mono text-xs font-semibold text-foreground transition hover:bg-[color-mix(in_oklab,var(--neon)_25%,transparent)] hover:scale-[1.03]"
                      >
                        <Globe className="h-3.5 w-3.5 text-[var(--neon)]" />
                        <span>Visit Site</span>
                        <ExternalLink className="h-3.5 w-3.5 text-[var(--neon)]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution snippet */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-foreground/50">
              <span className="neon-text">{"//"}</span>
              <span>execution_sample</span>
            </div>
            <pre className="overflow-x-auto rounded-md border border-border bg-[var(--code-bg)] p-4 font-mono text-xs leading-relaxed text-foreground/90">
              {project.snippet}
            </pre>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 font-mono text-xs pt-1">
            <div className="rounded-md border border-border p-3.5 bg-background/40">
              <div className="text-foreground/40 text-[10px] uppercase tracking-wider">status</div>
              <div className="neon-text mt-1 font-semibold">deployed · operational in production</div>
            </div>
            <div className="rounded-md border border-border p-3.5 bg-background/40">
              <div className="text-foreground/40 text-[10px] uppercase tracking-wider">delivered by</div>
              <div className="neon-text mt-1 font-semibold">Quantrix Labs — David Njau Githehu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  const text = `const studio = {\n  name: "Quantrix Labs",\n  ready: true,\n};`;
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.min(text.length, v + 2)), 25);
    return () => clearInterval(id);
  }, [text.length]);
  return (
    <div
      data-cs-ignore
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <pre className="neon-text font-mono text-sm md:text-base">
        {text.slice(0, n)}
        <span style={{ animation: "blink 1s steps(1) infinite" }}>▌</span>
      </pre>
    </div>
  );
}
