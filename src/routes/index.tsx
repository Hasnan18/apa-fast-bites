import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Instagram, Clock, Flame, ChevronUp } from "lucide-react";
import heroSpread from "@/assets/hero-spread.jpg";
import { categories } from "@/data/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A.P.A Fast Food — Menu" },
      {
        name: "description",
        content:
          "Scan, browse, crave. The complete A.P.A Fast Food menu — vada pavs, burgers, crispy chicken, mojitos, shakes & sweet buns.",
      },
      { name: "theme-color", content: "#C41230" },
      { property: "og:title", content: "A.P.A Fast Food — Menu" },
      { property: "og:description", content: "Taste the Fire · Experience the Flavor" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [active, setActive] = useState(categories[0].id);
  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep active tab visible in tab strip
  useEffect(() => {
    const btn = tabsRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab="${active}"]`
    );
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories
      .map((c) => ({
        ...c,
        sections: c.sections
          .map((s) => ({
            ...s,
            items: s.items.filter((i) => i.name.toLowerCase().includes(q)),
          }))
          .filter((s) => s.items.length > 0),
      }))
      .filter((c) => c.sections.length > 0);
  }, [query]);

  const scrollToCategory = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen pb-32">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSpread}
            alt="A.P.A Fast Food spread"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/55 to-background" />
        </div>

        <div className="relative px-6 pt-12 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-ember/40 bg-charcoal/30 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream backdrop-blur-md"
          >
            <Flame className="h-3 w-3 text-ember" />
            Scan · Browse · Order
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display mt-6 text-[58px] leading-[0.85] text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          >
            A<span className="text-ember">.</span>P<span className="text-ember">.</span>A
            <br />
            <span className="text-gradient-fire bg-[linear-gradient(135deg,oklch(0.78_0.18_60),oklch(0.62_0.20_30))]">
              FAST FOOD
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-serif-i mt-3 text-sm text-ember"
          >
            Taste the Fire · Experience the Flavor
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream/95 px-4 py-2 text-xs font-semibold text-charcoal shadow-glow"
          >
            <Clock className="h-3.5 w-3.5 text-primary" />
            Freshly made — allow ~10 mins
          </motion.div>
        </div>

        {/* Bottom curve fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-background" />
      </header>

      {/* STICKY: search + tabs */}
      <div className="sticky top-0 z-40 -mt-4 bg-background/85 pb-2 pt-3 backdrop-blur-xl">
        <div className="px-4">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-soft">
            <Search className="h-4 w-4 shrink-0 text-primary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search menu"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[10px] font-bold uppercase tracking-wider text-primary"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div
          ref={tabsRef}
          className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                data-tab={c.id}
                onClick={() => scrollToCategory(c.id)}
                className={`relative shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "border-transparent text-cream shadow-glow"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="tabPill"
                    className="gradient-fire absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <span className="text-sm">{c.icon}</span>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTIONS */}
      <div className="px-4 pt-6">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((cat, ci) => (
            <section
              key={cat.id}
              id={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
              }}
              className="mb-12 scroll-mt-28"
            >
              <CategoryHeader index={ci} cat={cat} />
              <div className="space-y-5">
                {cat.sections.map((s) => (
                  <SectionCard key={s.title} section={s} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-10 px-6">
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
          <div className="font-display text-2xl text-primary">A . P . A</div>
          <div className="font-serif-i mt-1 text-[11px] text-ember">
            "Good food is the foundation of genuine happiness."
          </div>
          <a
            href="https://instagram.com/apa_fastfood"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full gradient-fire px-4 py-2 text-xs font-bold text-cream shadow-glow"
          >
            <Instagram className="h-3.5 w-3.5" />
            @apa_fastfood
          </a>
          <div className="mt-6 border-t border-border pt-4 text-[11px] text-muted-foreground">
            Designed by{" "}
            <span className="font-bold text-foreground">Hasnan Sharief</span>
            <a
              href="https://instagram.com/ihasxnaan"
              target="_blank"
              rel="noreferrer"
              className="ml-1 inline-flex items-center gap-1 text-primary"
            >
              <Instagram className="h-3 w-3" />
              ihasxnaan
            </a>
          </div>
        </div>
      </footer>

      {/* Floating credit — always visible */}
      <a
        href="https://instagram.com/ihasxnaan"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/55 px-3 py-1.5 text-[10px] font-medium text-muted-foreground shadow-soft backdrop-blur-md transition-colors hover:text-primary"
        style={{ paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom))" }}
      >
        <span>
          Designed by <span className="font-bold text-foreground">Hasnan Sharief</span>
        </span>
        <span className="h-3 w-px bg-border" />
        <Instagram className="h-3 w-3 text-primary" />
        <span className="text-primary">ihasxnaan</span>
      </a>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-14 right-4 z-50 grid h-11 w-11 place-items-center rounded-full gradient-fire text-cream shadow-glow"
            aria-label="Back to top"
          >

            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}

function CategoryHeader({ index, cat }: { index: number; cat: (typeof categories)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-5"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-muted-foreground/40">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-display text-3xl text-primary">
          {cat.label}
        </h2>
        <span className="text-xl">{cat.icon}</span>
      </div>
      <p className="font-serif-i mt-0.5 pl-12 text-xs text-ember">{cat.tagline}</p>
      <div className="mt-3 h-px w-full bg-gradient-to-r from-ember/60 via-primary/30 to-transparent" />
    </motion.div>
  );
}

function SectionCard({ section }: { section: (typeof categories)[number]["sections"][number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      <div className="flex items-center justify-between gap-2 border-b border-dashed border-border bg-gradient-to-r from-secondary to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{section.icon}</span>
          <h3 className="font-display text-lg text-charcoal">{section.title}</h3>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {section.items.length} items
        </span>
      </div>

      <ul className="divide-y divide-border/60">
        {section.items.map((it) => (
          <li
            key={it.name}
            className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors active:bg-secondary"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-primary">♦</span>
              <span className="text-[14px] font-semibold text-foreground">{it.name}</span>
            </div>
            <span className="text-base">{it.emoji}</span>
          </li>
        ))}
      </ul>

      {section.note && (
        <div className="font-serif-i border-t border-border/60 bg-secondary/40 px-4 py-2 text-[11px] text-primary">
          ✦ {section.note}
        </div>
      )}
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
      <div className="text-4xl">🔍</div>
      <p className="mt-3 font-display text-xl text-primary">Nothing matches that</p>
      <p className="font-serif-i mt-1 text-xs text-muted-foreground">
        Try another flavor, spice, or craving.
      </p>
    </div>
  );
}
