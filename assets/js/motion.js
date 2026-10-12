/* Light-weight motion: scroll reveal, header shadow, card tilt, magnetic buttons. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Header border once the page scrolls
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Course sidebar: open on desktop, collapsed by default on small screens
  const desktop = window.matchMedia("(min-width: 58.01rem)");
  const syncNav = () => document.querySelectorAll("[data-course-nav]").forEach((d) => { d.open = desktop.matches; });
  syncNav();
  desktop.addEventListener("change", syncNav);

  // Catalogue filter
  const bar = document.querySelector("[data-filter-bar]");
  if (bar) {
    const cards = document.querySelectorAll("[data-filter-list] > [data-group]");
    const empty = document.querySelector("[data-filter-empty]");
    bar.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter]");
      if (!chip) return;
      const value = chip.dataset.filter;
      bar.querySelectorAll("[data-filter]").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      let shown = 0;
      cards.forEach((card) => {
        const match = value === "all" || card.dataset.group === value;
        card.classList.toggle("is-filtered-out", !match);
        if (match) { shown += 1; card.classList.add("is-visible"); }
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  // Reveal on scroll (+ draws line illustrations inside)
  const items = document.querySelectorAll("[data-reveal]");
  if (reduce.matches || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  // Stop SVG (SMIL) loops for reduced-motion users
  if (reduce.matches) {
    document.querySelectorAll("svg").forEach((svg) => {
      if (typeof svg.pauseAnimations === "function" && svg.querySelector("animate, animateMotion")) {
        svg.setCurrentTime(3.5);
        svg.pauseAnimations();
      }
    });
    return;
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer) return;

  // Subtle 3D tilt for tiles
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });

  // Magnetic buttons
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });

  root.classList.add("has-pointer");
})();
