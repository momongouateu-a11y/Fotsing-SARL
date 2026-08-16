// Shared UI enhancements: reveal on scroll, hero parallax, marquee, counters, navbar scroll
(function(){
  'use strict';

  // IntersectionObserver reveals (same logic used in index)
  function setupReveals(){
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elems = document.querySelectorAll('.reveal, [data-stagger], .page-hero, section, .product-card, .feature-card, .review-card, .contact-card');
    if(prefersReduced){ elems.forEach(el=>el.classList.add('show')); return; }
    if(!('IntersectionObserver' in window)){ elems.forEach(el=>el.classList.add('show')); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const el = entry.target;
          el.classList.add('show');
          const staggerVal = parseInt(el.dataset.stagger, 10) || 0;
          if(staggerVal){
            const children = Array.from(el.children || []);
            children.forEach((child,i)=>{
              child.style.transition = child.style.transition || `opacity .6s cubic-bezier(.2,.9,.2,1), transform .6s cubic-bezier(.2,.9,.2,1)`;
              child.style.transitionDelay = (i * staggerVal) + 'ms';
              child.classList.add('show');
            });
          }
          io.unobserve(el);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});

    elems.forEach(el=>{ if(!el.classList.contains('reveal')) el.classList.add('reveal'); io.observe(el); });
  }

  // Hero parallax for decorative shapes
  function setupHeroParallax(){
    const hero = document.querySelector('.page-hero');
    if(!hero) return;
    if(hero.dataset.parallax === 'none') return;
    const shapes = hero.querySelectorAll('.floating-shape');
    if(!shapes.length) return;
    const onMove = (e)=>{
      const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || (window.innerWidth/2);
      const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || (window.innerHeight/2);
      const dx = (x - (window.innerWidth/2)) / window.innerWidth;
      const dy = (y - (window.innerHeight/2)) / window.innerHeight;
      shapes.forEach((s, i)=>{
        const depth = (i + 1) * 6;
        const tx = dx * depth;
        const ty = dy * depth * 0.6;
        s.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:true});
  }

  // Marquee duplication helper
  function setupMarquee(){
    document.querySelectorAll('.marquee-content').forEach(el=>{
      try{ const clone = el.innerHTML; el.innerHTML = clone + clone; el.classList.add('marquee-scroll'); }catch(e){}
    });
  }

  // Simple counters
  function animateCounters(){
    const easeOut = t=>1-Math.pow(1-t,3);
    document.querySelectorAll('.counter').forEach(el=>{
      const target = +el.dataset.target || +el.textContent || 0;
      const duration = 1200;
      let start = null;
      function step(ts){
        if(!start) start = ts;
        const progress = Math.min((ts-start)/duration,1);
        el.textContent = Math.floor(easeOut(progress)*target);
        if(progress<1) requestAnimationFrame(step); else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }

  // Navbar scroll effect
  function setupNavbarScroll(){
    const nav = document.getElementById('navbar') || document.querySelector('nav');
    if(!nav) return;
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    });
  }

  // Expose init function
  function initEnhancements(){
    try{ setupReveals(); }catch(e){}
    try{ setupMarquee(); }catch(e){}
    try{ animateCounters(); }catch(e){}
    try{ setupNavbarScroll(); }catch(e){}
    try{ setupHeroParallax(); }catch(e){}
  }

  // Auto-init on DOMContentLoaded
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initEnhancements); else initEnhancements();

  // Export to window for manual calls
  window.UIEnhancements = { setupReveals, setupHeroParallax, setupMarquee, animateCounters, setupNavbarScroll };
})();
