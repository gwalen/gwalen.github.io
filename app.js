(() => {
  /* ---------- Static equalizer skyline (built once per size, never animates) ---------- */
  const eq = document.getElementById("eq");
  const SQ = 16; // square + gap
  // deterministic pseudo-random so the skyline looks the same on every visit
  const rand = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
  function buildEq() {
    const hero = eq.closest(".hero");
    eq.innerHTML = "";
    const cols = Math.floor(hero.clientWidth / SQ);
    const mid = cols / 2;
    const sunHalf = Math.min(hero.clientWidth * 0.2, hero.clientHeight * 0.17, 180) / SQ;
    for (let c = 0; c < cols; c++) {
      const d = Math.abs(c - mid);
      let h = 3 + Math.floor(rand(c) * 4);
      if (d < sunHalf) h += Math.round((1 - d / sunHalf) * (hero.clientWidth < 600 ? 1 : 5));
      const col = document.createElement("div");
      col.className = "eq__col";
      col.innerHTML = "<i></i>".repeat(h);
      eq.appendChild(col);
    }
  }
  buildEq();
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(buildEq, 200); });

  /* ---------- Clock ---------- */
  const clock = document.getElementById("tbClock");
  const tick = () => {
    const d = new Date();
    let h = d.getHours();
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    clock.textContent = `${h}:${String(d.getMinutes()).padStart(2, "0")} ${ap}`;
  };
  tick(); setInterval(tick, 10_000);

  /* ---------- Reveal + active taskbar button ---------- */
  const items = document.querySelectorAll(".reveal");
  const tasks = [...document.querySelectorAll(".tb-task")];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id === "courses" ? "education" : e.target.id;
        tasks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main .section").forEach((s) => spy.observe(s));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
