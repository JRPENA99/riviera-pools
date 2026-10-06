(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Navigation: transparent over hero, solid after scrolling, hides on scroll down
  const nav = document.querySelector(".nav");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle("solid", y > 40);
      nav.classList.toggle("hide", y > 500 && y > lastY + 4 && !document.body.classList.contains("menu-open"));
      if (y < lastY - 4) nav.classList.remove("hide");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".mobile-menu a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") document.body.classList.remove("menu-open");
    });
  }

  // Reveal on scroll
  const targets = document.querySelectorAll(".rv, .rv-img, .line-mask, .step, .hero");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));
  }

  // Services: hovered row swaps the sticky image
  const svc = document.querySelector(".services");
  if (svc) {
    const rows = [...svc.querySelectorAll("li")];
    const imgs = [...svc.querySelectorAll(".frame img")];
    const set = (i) => {
      rows.forEach((r, j) => r.classList.toggle("active", i === j));
      imgs.forEach((im, j) => im.classList.toggle("on", i === j));
    };
    rows.forEach((r, i) => {
      r.addEventListener("mouseenter", () => set(i));
      r.addEventListener("focusin", () => set(i));
    });
    set(0);
  }

  // Testimonials
  document.querySelectorAll("[data-quotes]").forEach((wrap) => {
    const slides = [...wrap.querySelectorAll(".qslide")];
    const dots = [...wrap.querySelectorAll(".quotes-nav button")];
    let i = 0, t;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("on", j === i));
      dots.forEach((d, j) => d.classList.toggle("on", j === i));
    };
    const auto = () => { if (!reduce) { clearInterval(t); t = setInterval(() => go(i + 1), 8000); } };
    dots.forEach((d, j) => d.addEventListener("click", () => { go(j); auto(); }));
    go(0); auto();
  });

  // Projects filter
  const filters = document.querySelector(".filters");
  if (filters) {
    const cards = document.querySelectorAll(".pgrid .card");
    const apply = (f) => {
      filters.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
      cards.forEach((c) => c.classList.toggle("off", f !== "all" && c.dataset.cat !== f));
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) apply(b.dataset.f);
    });
    const q = new URLSearchParams(location.search).get("filter");
    apply(q === "commercial" || q === "residential" ? q : "all");
  }

  // Contact form (prototype: no backend — confirms on screen)
  const form = document.querySelector("form.rf");
  if (form) {
    const type = new URLSearchParams(location.search).get("type");
    if (type) {
      const el = form.querySelector(`input[name="sector"][value="${type}"]`);
      if (el) el.checked = true;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.style.display = "none";
      document.querySelector(".thanks").classList.add("on");
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  root.classList.add("ready");
})();
