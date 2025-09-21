// Theme persistence
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored) root.dataset.theme = stored;
if (stored === 'dark') root.classList.add('dark');

function setTheme(mode){
  if (mode === 'dark') {
    root.dataset.theme = 'dark';
    root.classList.add('dark');
  } else {
    root.dataset.theme = 'light';
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', mode);
}

themeToggle?.addEventListener('click', ()=>{
  const next = (root.dataset.theme === 'dark') ? 'light' : 'dark';
  setTheme(next);
});

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', ()=>{
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('show');
});

// Reveal on scroll
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// Project tag filtering
const chips = document.querySelectorAll('.chip');
chips.forEach(ch => ch.addEventListener('click', ()=>{
  chips.forEach(c => c.classList.remove('is-active'));
  ch.classList.add('is-active');
  const key = ch.dataset.filter;
  document.querySelectorAll('#projects .card').forEach(card => {
    const tags = (card.dataset.tags || '').split(/\s+/);
    const show = key === 'all' || tags.includes(key);
    card.style.display = show ? '' : 'none';
  });
}));

// Copy email helper
const copyBtn = document.getElementById('copyEmail');
copyBtn?.addEventListener('click', async ()=>{
  try {
    await navigator.clipboard.writeText('22ayesha.arif@gmail.com');
    const old = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent = old, 1200);
  } catch {}
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Dark Blue Particle-Burst Background =====
(function () {
  const canvas = document.getElementById('bgfx');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, CX = 0, CY = 0;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fitCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    // Size the drawing buffer for crispness on HiDPI
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    // Keep CSS size in CSS; for safety we mirror here too
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    W = canvas.width; H = canvas.height;
    CX = W / 2; CY = H / 2;
  }

  // Particles
  const particles = [];
  const PMAX = 2.2; // base size at 1x DPR

  function targetCount() {
    const area = window.innerWidth * window.innerHeight;
    return Math.max(200, Math.min(900, Math.floor(area / 2500)));
  }

  function initParticles() {
    particles.length = 0;
    const count = targetCount();
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * Math.min(W, H) * 0.02; // spawn near center
      const x = CX + Math.cos(ang) * r;
      const y = CY + Math.sin(ang) * r;
      const speed = (Math.random() * 0.35 + 0.08) * dpr;
      particles.push({
        x, y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        size: (Math.random() * PMAX + 0.6) * dpr,
        alpha: Math.random() * 0.8 + 0.2,
        rot: Math.random() * Math.PI,
        rotV: (Math.random() * 0.01 - 0.005)
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    const maxR = Math.max(W, H) * 0.6;

    for (const p of particles) {
      // move
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;

      // fade by distance from center
      const dx = p.x - CX, dy = p.y - CY;
      const dist = Math.hypot(dx, dy);
      let a = p.alpha * (1 - dist / maxR);
      if (a < 0) a = 0;

      // draw
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = a;
      ctx.fillStyle = Math.random() < 0.5
        ? 'rgba(164,196,255,0.95)'
        : 'rgba(99,155,255,0.95)';
      const s = p.size;
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.restore();

      // recycle outside ring
      if (dist > maxR) {
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * Math.min(W, H) * 0.04;
        p.x = CX + Math.cos(ang) * r;
        p.y = CY + Math.sin(ang) * r;
        const speed = (Math.random() * 0.35 + 0.08) * dpr;
        p.vx = Math.cos(ang) * speed;
        p.vy = Math.sin(ang) * speed;
        p.size = (Math.random() * PMAX + 0.6) * dpr;
        p.alpha = Math.random() * 0.8 + 0.2;
        p.rot = Math.random() * Math.PI;
        p.rotV = (Math.random() * 0.01 - 0.005);
      }
    }
  }

  function loop() {
    drawFrame();
    if (!prefersReduced) requestAnimationFrame(loop);
  }

  function refresh() {
    fitCanvas();
    initParticles();
    if (prefersReduced) drawFrame();
  }

  window.addEventListener('resize', refresh, { passive: true });

  refresh();
  if (!prefersReduced) requestAnimationFrame(loop);
})();

