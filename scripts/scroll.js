document.addEventListener('DOMContentLoaded', ()=>{
  const reveal = ()=> document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
  reveal();
  window.addEventListener('scroll', reveal);
});
