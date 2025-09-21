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
