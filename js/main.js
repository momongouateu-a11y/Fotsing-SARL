// Main interactive behaviors: WhatsApp, menu, products, forms, smooth anchors
(function(){
  'use strict';

  const WA_NUMBER = '+237675624020';

  function openWhatsApp(message){
    const text = encodeURIComponent(message || 'Bonjour');
    const number = WA_NUMBER.replace('+','');
    window.open(`https://wa.me/${number}?text=${text}`,'_blank');
  }

  function toggleMenu(){
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    const btn = document.getElementById('menu-btn');
    if(!menu) return;
    const isHidden = menu.classList.toggle('hidden');
    if(icon) icon.classList.toggle('fa-times');
    if(btn) btn.setAttribute('aria-expanded', (!isHidden).toString());

    if(!isHidden) {
      requestAnimationFrame(() => {
        const firstLink = menu.querySelector('a');
        if(firstLink) firstLink.focus();
      });
    }
  }

  function closeMenu(){
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    const btn = document.getElementById('menu-btn');
    if(!menu) return;
    menu.classList.add('hidden');
    if(icon) icon.classList.remove('fa-times');
    if(btn) btn.setAttribute('aria-expanded', 'false');
    if(btn) btn.focus();
  }

  function initMobileMenuKeyboard(){
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('menu-btn');
    if(!menu || !btn) return;

    const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    document.addEventListener('keydown', (event) => {
      if (menu.classList.contains('hidden')) return;
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(menu.querySelectorAll(focusableSelectors));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    btn.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
        closeMenu();
      }
    });
  }

  function toggleCart(){
    alert('Votre panier est vide pour le moment.');
  }

  const REVIEWS = [
    {
      name: 'Amina',
      city: 'Yaoundé',
      quote: 'Très bon matelas, très confortable et très bien livré. J’ai immédiatement senti un grand changement dans mon sommeil.',
      badge: 'Commande satisfaisante',
      initials: 'A',
      accent: 'primary'
    },
    {
      name: 'Daniel',
      city: 'Bafoussam',
      quote: 'Le service est excellent et le matelas est vraiment de qualité. Très bon rapport qualité/prix et l’équipe est très réactive.',
      badge: 'Très recommandé',
      initials: 'D',
      accent: 'accent'
    },
    {
      name: 'Céline',
      city: 'Douala',
      quote: 'Le confort est au rendez-vous. J’ai commandé via WhatsApp et tout s’est bien passé. Mon sommeil est beaucoup plus réparateur.',
      badge: 'Expérience premium',
      initials: 'C',
      accent: 'secondary'
    }
  ];

  function renderReviews(){
    const container = document.getElementById('reviews-container');
    if(!container) return;

    container.innerHTML = REVIEWS.map((review)=>`
      <article class="review-card bg-white rounded-[2rem] p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full ${review.accent === 'primary' ? 'bg-primary/10 text-primary' : review.accent === 'accent' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'} flex items-center justify-center font-bold text-lg">
              ${review.initials}
            </div>
            <div>
              <h3 class="font-bold text-dark">${review.name}</h3>
              <p class="text-sm text-gray-500">${review.city}</p>
            </div>
          </div>
          <div class="text-amber-400 text-lg">★★★★★</div>
        </div>
        <p class="text-gray-600 leading-relaxed mb-4">« ${review.quote} »</p>
        <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          <i class="fas fa-check-circle"></i> ${review.badge}
        </div>
      </article>
    `).join('');
  }

  const PRODUCTS = [
    {
      id:'econ',
      name:'Matelas Économique',
      price:'75 000 FCFA',
      priceNumber:75000,
      tag:'economique',
      label:'Économique',
      subtitle:'Soutien simple et respirant',
      image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
    },
    {
      id:'conf',
      name:'Matelas Confort',
      price:'120 000 FCFA',
      priceNumber:120000,
      tag:'confort',
      label:'Confort',
      subtitle:'Équilibre parfait entre douceur et soutien',
      image:'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'
    },
    {
      id:'luxe',
      name:'Matelas Luxe',
      price:'220 000 FCFA',
      priceNumber:220000,
      tag:'luxe',
      label:'Luxe',
      subtitle:'Design premium et finition haut de gamme',
      image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'
    },
    {
      id:'ortho',
      name:'Matelas Orthopédique',
      price:'180 000 FCFA',
      priceNumber:180000,
      tag:'orthopedique',
      label:'Orthopédique',
      subtitle:'Support ciblé pour un sommeil réparateur',
      image:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'
    },
  ];

  const cartState = [];

  function getProductById(id){
    return PRODUCTS.find(product => product.id === id) || null;
  }

  function formatPrice(value){
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  }

  function setCartBadge(){
    const countEl = document.getElementById('cart-count');
    if(!countEl) return;
    const total = cartState.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = total;
    countEl.classList.toggle('hidden', total === 0);
  }

  function ensureCartUI(){
    let cart = document.getElementById('cart-drawer');
    if(cart) return cart;

    cart = document.createElement('aside');
    cart.id = 'cart-drawer';
    cart.setAttribute('aria-hidden', 'true');
    cart.className = 'cart-drawer';
    cart.innerHTML = `
      <div class="cart-backdrop" data-close-cart="true"></div>
      <div class="cart-panel" role="dialog" aria-modal="true" aria-label="Panier">
        <div class="cart-header">
          <div>
            <p class="cart-kicker">Mon panier</p>
            <h3>Votre commande</h3>
          </div>
          <button type="button" class="cart-close" aria-label="Fermer le panier">×</button>
        </div>
        <div class="cart-body">
          <div class="cart-items"></div>
        </div>
        <div class="cart-footer">
          <div class="cart-total-row">
            <span>Total</span>
            <strong class="cart-total">0 FCFA</strong>
          </div>
          <button type="button" class="cart-whatsapp">Commander via WhatsApp</button>
          <button type="button" class="cart-clear">Vider le panier</button>
        </div>
      </div>
    `;

    document.body.appendChild(cart);

    cart.addEventListener('click', (event) => {
      const closeTarget = event.target.closest('[data-close-cart="true"]');
      if(closeTarget) closeCart();

      const closeButton = event.target.closest('.cart-close');
      if(closeButton) closeCart();

      const clearButton = event.target.closest('.cart-clear');
      if(clearButton) {
        cartState.length = 0;
        setCartBadge();
        renderCart();
      }

      const whatsappButton = event.target.closest('.cart-whatsapp');
      if(whatsappButton) sendCartToWhatsApp();

      const removeButton = event.target.closest('[data-remove-from-cart]');
      if(removeButton) {
        const id = removeButton.getAttribute('data-remove-from-cart');
        const index = cartState.findIndex(item => item.id === id);
        if(index >= 0) {
          cartState.splice(index, 1);
          setCartBadge();
          renderCart();
        }
      }
    });

    return cart;
  }

  function renderCart(){
    const cart = ensureCartUI();
    const list = cart.querySelector('.cart-items');
    const totalEl = cart.querySelector('.cart-total');

    if(!list || !totalEl) return;

    if(!cartState.length){
      list.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon"><i class="fas fa-shopping-bag"></i></div>
          <p>Votre panier est vide.</p>
          <span>Ajoutez un matelas pour passer votre commande.</span>
        </div>
      `;
      totalEl.textContent = '0 FCFA';
      cart.setAttribute('aria-hidden', 'true');
      return;
    }

    const total = cartState.reduce((sum, item) => sum + (item.priceNumber || 0) * item.quantity, 0);
    totalEl.textContent = formatPrice(total);

    list.innerHTML = cartState.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-content">
          <div class="cart-item-top">
            <h4>${item.name}</h4>
            <button type="button" data-remove-from-cart="${item.id}" aria-label="Retirer ${item.name}">×</button>
          </div>
          <p>${item.price}</p>
          <div class="cart-item-meta">
            <span>Qté : ${item.quantity}</span>
            <strong>${formatPrice((item.priceNumber || 0) * item.quantity)}</strong>
          </div>
        </div>
      </div>
    `).join('');

    cart.setAttribute('aria-hidden', 'false');
  }

  function openCart(){
    const cart = ensureCartUI();
    renderCart();
    cart.classList.add('open');
    cart.setAttribute('aria-hidden', 'false');
  }

  function closeCart(){
    const cart = document.getElementById('cart-drawer');
    if(!cart) return;
    cart.classList.remove('open');
    cart.setAttribute('aria-hidden', 'true');
  }

  function toggleCart(){
    const cart = document.getElementById('cart-drawer');
    if(!cart){ openCart(); return; }
    if(cart.classList.contains('open')) closeCart(); else openCart();
  }

  function addToCart(itemOrId){
    const product = typeof itemOrId === 'string' ? getProductById(itemOrId) : itemOrId;
    if(!product) return;

    const existing = cartState.find(item => item.id === product.id);
    if(existing){ existing.quantity += 1; }
    else { cartState.push({ ...product, quantity: 1 }); }

    setCartBadge();
    renderCart();
    openCart();
  }

  function sendCartToWhatsApp(){
    if(!cartState.length){
      alert('Votre panier est vide pour le moment.');
      return;
    }

    const summary = cartState.map(item => `${item.name} x${item.quantity}`).join('\n');
    const total = cartState.reduce((sum, item) => sum + (item.priceNumber || 0) * item.quantity, 0);
    const text = `Bonjour Fotsing Sarl, je souhaite commander :\n${summary}\n\nTotal estimé : ${formatPrice(total)}`;
    openWhatsApp(text);
  }

  function renderProducts(filter='all'){
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    grid.innerHTML = '';
    const items = PRODUCTS.filter(p => filter==='all' || p.tag===filter);
    items.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'product-card-anim group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]';
      card.innerHTML = `\
        <div class="product-media relative overflow-hidden rounded-[26px] m-3 mb-0">\
          <img src="${p.image}" alt="${p.name}" class="w-full h-64 object-cover cursor-zoom-in" width="900" height="560" loading="lazy" decoding="async" data-zoomable="true" />\
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-950/5 to-white/0"></div>\
          <span class="product-card-badge absolute left-4 top-4 inline-flex items-center rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur-sm">${p.label}</span>\
          <button type="button" class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-primary shadow-sm backdrop-blur-sm transition hover:scale-105" aria-label="Ajouter ${p.name} au panier" data-add-to-cart="${p.id}">\
            <i class="fas fa-shopping-bag text-xs"></i>\
          </button>\
        </div>\
        <div class="px-5 pb-5 pt-4">\
          <div class="mb-2 flex items-start justify-between gap-3">\
            <div>\
              <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Collection</p>\
              <h3 class="text-xl font-bold text-dark leading-tight">${p.name}</h3>\
            </div>\
            <span class="rounded-full bg-primary/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">Top</span>\
          </div>\
          <p class="mb-5 text-sm leading-6 text-slate-500">${p.subtitle}</p>\
          <div class="flex items-end justify-between gap-3">\
            <div>\
              <span class="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">À partir de</span>\
              <span class="text-2xl font-extrabold text-dark">${p.price}</span>\
            </div>\
            <div class="flex gap-2">\
              <button class="btn-secondary !py-2 !px-3 !text-xs" type="button" data-add-to-cart="${p.id}">Ajouter</button>\
              <button class="btn-primary !py-2 !px-3 !text-xs" type="button" data-quick-buy="${p.id}">Commander</button>\
            </div>\
          </div>\
        </div>`;

      const commanderBtn = card.querySelector('[data-quick-buy]');
      const addBtn = card.querySelector('[data-add-to-cart]');
      if(commanderBtn) commanderBtn.addEventListener('click', () => addToCart(p.id));
      if(addBtn) addBtn.addEventListener('click', () => addToCart(p.id));

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

  function openImageModal(src, alt){
    let modal = document.getElementById('image-lightbox');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'image-lightbox';
      modal.className = 'image-lightbox';
      modal.innerHTML = `
        <div class="image-lightbox-backdrop" data-close-lightbox="true"></div>
        <div class="image-lightbox-panel">
          <button type="button" class="image-lightbox-close" aria-label="Fermer la photo">×</button>
          <img src="" alt="" />
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (event) => {
        const backdrop = event.target.closest('[data-close-lightbox="true"]');
        const closeButton = event.target.closest('.image-lightbox-close');
        if(backdrop || closeButton) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    const img = modal.querySelector('img');
    if(img){
      img.src = src;
      img.alt = alt;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function initProductImageZoom(){
    document.addEventListener('click', (event) => {
      const addButton = event.target.closest('[data-add-to-cart]');
      if(addButton){
        const id = addButton.getAttribute('data-add-to-cart');
        if(id){ addToCart(id); }
        return;
      }

      const quickBuy = event.target.closest('[data-quick-buy]');
      if(quickBuy){
        const id = quickBuy.getAttribute('data-quick-buy');
        addToCart(id);
        const product = getProductById(id);
        if(product){ openWhatsApp('Bonjour Fotsing Sarl, je souhaite commander: ' + product.name); }
        return;
      }

      const zoomable = event.target.closest('[data-zoomable="true"]');
      if(zoomable){
        openImageModal(zoomable.src, zoomable.alt || 'Produit');
      }
    });
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
    const text = `Bonjour Fotsing Sarl, \\\nJe m'appelle ${fname} ${lname}\\\nTéléphone: ${phone}\\\nProduit: ${product}\\\nMessage: ${message}`;
    openWhatsApp(text);
  }

  // Smooth anchors (handle only intra-page hashes)
  function initSmoothAnchors(){
    document.addEventListener('click', function(e){
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const href = a.getAttribute('href');
      if(href && href.length>1){
        const el = document.querySelector(href);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); closeMenu(); }
      }
    });
  }

  // Expose some helpers globally for inline attributes left in templates
  window.openWhatsApp = openWhatsApp;
  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;
  window.toggleCart = toggleCart;
  window.renderProducts = renderProducts;
  window.filterProducts = filterProducts;
  window.addToCart = addToCart;
  window.sendContactForm = sendContactForm;
  window.sendFormViaWhatsApp = sendFormViaWhatsApp;
  window.initProductImageZoom = initProductImageZoom;

  // Auto-init where appropriate
  function autoInit(){
    renderProducts && renderProducts();
    renderReviews && renderReviews();
    initSmoothAnchors();
    initProductImageZoom();
    initMobileMenuKeyboard();
    // Attach contact form submit handler if form is present
    const form = document.getElementById('contact-form');
    if(form) form.addEventListener('submit', sendContactForm);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', autoInit);
  } else { autoInit(); }

})();
