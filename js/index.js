/* Centralized site JavaScript for index and shared UI
   Provides: WhatsApp helper, menu toggle, simple cart counter,
   product rendering + filters, contact form handlers, reveal-on-scroll,
   marquee helper and animated counters.
*/

const WA_NUMBER = '+237675624020';

function openWhatsApp(message){
  const text = encodeURIComponent(message);
  const number = WA_NUMBER.replace('+','');
  window.open(`https://wa.me/${number}?text=${text}`,'_blank');
}

function toggleMenu(){
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('menu-icon');
  if(!menu) return;
  menu.classList.toggle('hidden');
  if(icon) icon.classList.toggle('fa-times');
}
function closeMenu(){
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('menu-icon');
  if(!menu) return;
  menu.classList.add('hidden');
  if(icon) icon.classList.remove('fa-times');
}
function toggleCart(){
  alert('Votre panier est vide pour le moment.');
}

const PRODUCTS = [
  {id:'econ', name:'Matelas Économique', price:'75 000 FCFA', tag:'economique'},
  {id:'conf', name:'Matelas Confort', price:'120 000 FCFA', tag:'confort'},
  {id:'luxe', name:'Matelas Luxe', price:'220 000 FCFA', tag:'luxe'},
  {id:'ortho', name:'Matelas Orthopédique', price:'180 000 FCFA', tag:'orthopedique'},
];

function renderProducts(filter='all'){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  grid.innerHTML = '';
  const items = PRODUCTS.filter(p => filter==='all' || p.tag===filter);
  items.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card-anim bg-white rounded-3xl p-6 shadow-md';
    card.innerHTML = `\
      <div class="h-48 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center text-6xl">🛏️</div>\
      <h3 class="font-bold text-xl mb-2">${p.name}</h3>\
      <p class="text-gray-500 mb-4">${p.price}</p>\
      <div class="flex gap-3">\
        <button class="flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-xl font-bold" onclick="openWhatsApp('Bonjour Fotsing Sarl, je souhaite commander: ${p.name}')">Commander</button>\
        <button class="flex-1 bg-accent hover:bg-yellow-500 text-white py-3 rounded-xl font-bold" onclick="addToCart('${p.id}')">Ajouter</button>\
      </div>`;
    grid.appendChild(card);
  });
  if(items.length===0){ grid.innerHTML = '<p class="text-center text-gray-500">Aucun produit trouvé.</p>'; }
}

function filterProducts(filter){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active-filter'));
  const active = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
  if(active) active.classList.add('active-filter');
  renderProducts(filter);
}

function addToCart(id){
  const countEl = document.getElementById('cart-count');
  if(!countEl) return;
  const current = Number(countEl.textContent || 0) || 0;
  countEl.textContent = current + 1;
  countEl.classList.remove('hidden');
}

function sendContactForm(e){
  if(e && e.preventDefault) e.preventDefault();
  const fname = document.getElementById('fname') ? document.getElementById('fname').value.trim() : '';
  const lname = document.getElementById('lname') ? document.getElementById('lname').value.trim() : '';
  const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
  const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
  if(!fname || !lname || !phone || !message){ alert('Veuillez remplir les champs obligatoires'); return; }
  alert('Merci ' + fname + '! Votre message a été envoyé. Nous vous contacterons bientôt.');
  const form = document.getElementById('contact-form'); if(form) form.reset();
}

function sendFormViaWhatsApp(){
  const fname = document.getElementById('fname') ? document.getElementById('fname').value.trim() : '';
  const lname = document.getElementById('lname') ? document.getElementById('lname').value.trim() : '';
  const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
  const product = document.getElementById('product-interest') ? document.getElementById('product-interest').value : '';
  const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
  const text = `Bonjour Fotsing Sarl, \nJe m'appelle ${fname} ${lname}\nTéléphone: ${phone}\nProduit: ${product}\nMessage: ${message}`;
  openWhatsApp(text);
}

// Smooth anchors
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const href = a.getAttribute('href');
  if(href && href.length>1){
    const el = document.querySelector(href);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); closeMenu(); }
  }
});

// IntersectionObserver for reveals + stagger
function setupReveals(){
  const elems = document.querySelectorAll('.reveal, [data-stagger], #accueil, #produits, #avantages, #avis, #contact, .product-card');
  if(!('IntersectionObserver' in window)){
    elems.forEach(el=>el.classList.add('show'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        if(entry.target.dataset.stagger){
          entry.target.querySelectorAll('*').forEach((child,i)=>{ child.style.transitionDelay = (i*60)+'ms'; });
        }
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  elems.forEach(el=>{ el.classList.add('reveal'); io.observe(el); });
}

// Marquee duplication for smooth scroll
function setupMarquee(){
  document.querySelectorAll('.marquee-content').forEach(el=>{
    try{ const clone = el.innerHTML; el.innerHTML = clone + clone; el.classList.add('marquee-scroll'); }catch(e){}
  });
}

// Smooth counters using rAF
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
      if(progress<1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  });
}

// Navbar background on scroll
function setupNavbarScroll(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts && renderProducts();
  setupReveals();
  setupMarquee();
  animateCounters();
  setupNavbarScroll();
});
