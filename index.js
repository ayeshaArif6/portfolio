// Copy email helpers
function copy(text, btn){
  navigator.clipboard?.writeText(text).then(()=>{
    const old = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(()=> btn.textContent = old, 1200);
  }).catch(()=>{ /* ignore */ });
}

document.getElementById('copyEmail')?.addEventListener('click', (e)=>{
  copy('22ayesha.arif@gmail.com', e.currentTarget);
});
document.getElementById('copyEmail2')?.addEventListener('click', (e)=>{
  copy('22ayesha.arif@gmail.com', e.currentTarget);
});

// Reveal on scroll (reduced motion safe)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el=> el.classList.add('is-visible'));
}
