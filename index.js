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
  document.querySelectorAll('.card').forEach(card => {
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
(function(){
  const canvas = document.getElementById('bgfx');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, CX, CY;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // particle count scales with viewport area
  const baseCount = Math.floor((window.innerWidth * window.innerHeight) / 2500);
  const PCOUNT = Math.max(200, Math.min(900, baseCount));
  const PMAX = 2.2; // px @ 1x DPR
  const particles = [];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width  = Math.floor(window.innerWidth  * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    CX = W/2; CY = H/2;
    if (!particles.length) init();
  }

  function init(){
    particles.length = 0;
    for (let i = 0; i < PCOUNT; i++){
      const angle  = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(W, H) * 0.02; // spawn near center
      const x = CX + Math.cos(angle) * radius;
      const y = CY + Math.sin(angle) * radius;
      const size  = (Math.random() * PMAX + 0.6) * dpr;
      const speed = (Math.random() * 0.35 + 0.08) * dpr;
      particles.push({
        x, y, size, angle, speed,
        alpha: Math.random() * 0.8 + 0.2,
        rot: Math.random() * Math.PI,
        rotV: (Math.random() * 0.01 - 0.005)
      });
    }
  }

  function drawFrame(){
    ctx.clearRect(0, 0, W, H);
    const maxR = Math.max(W, H) * 0.6;

    for (const p of particles){
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.rot += p.rotV;

      const dx = p.x - CX, dy = p.y - CY;
      const dist = Math.hypot(dx, dy);
      let a = p.alpha * (1 - dist / maxR);
      if (a < 0) a = 0;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = a;
      ctx.fillStyle = Math.random() < 0.5
        ? 'rgba(164, 196, 255, 0.95)'
        : 'rgba(99, 155, 255, 0.95)';
      const s = p.size;
      ctx.fillRect(-s/2, -s/2, s, s);
      ctx.restore();

      if (dist > maxR){
        const ang = Math.random() * Math.PI * 2;
        const r   = Math.random() * Math.min(W, H) * 0.04;
        p.x = CX + Math.cos(ang) * r;
        p.y = CY + Math.sin(ang) * r;
        p.angle = ang;
        p.size  = (Math.random() * PMAX + 0.6) * dpr;
        p.speed = (Math.random() * 0.35 + 0.08) * dpr;
        p.alpha = Math.random() * 0.8 + 0.2;
      }
    }
  }

  function loop(){
    drawFrame();
    if (!reduce) requestAnimationFrame(loop);
  }

  window.addEventListener('resize', ()=>{
    particles.length = 0;
    resize();
    if (reduce) drawFrame();
  });

  resize();
  if (reduce) {
    drawFrame();   // static frame for reduced motion
  } else {
    requestAnimationFrame(loop);
  }
})();

