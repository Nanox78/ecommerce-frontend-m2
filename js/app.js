// Configuración
const VAT = 0.19; // IVA 19%
const currency = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

// Datos de productos: NOTA: price = precio SIN IVA (neto)
const products = [
  {
    id: 1,
    title: 'Auriculares Bluetooth X10',
    price: 42008, // precio NETO en CLP (sin IVA)
    category: 'Audio',
    imgs: ['./img/auricularx10.jpg','./img/auricularx10-2.jpg','./img/auricularx10-3.jpg'],
    description: 'Auriculares inalámbricos con cancelación de ruido y 20h de batería.'
  },
  {
    id: 2,
    title: 'Reloj SmartFit Z',
    price: 75622,
    category: 'Wearables',
    imgs: ['./img/reloj.webp','./img/reloj-2.webp'],
    description: 'Reloj inteligente con monitoreo de salud y pantalla AMOLED.'
  },
  {
    id: 3,
    title: 'Altavoz Portátil Boom',
    price: 50412,
    category: 'Audio',
    imgs: ['./img/parlante.webp','./img/parlante-2.webp'],
    description: 'Altavoz resistente al agua con sonido 360° y bajos potentes.'
  },
  {
    id: 4,
    title: 'Teclado Mecánico Clicky',
    price: 63017,
    category: 'Periféricos',
    imgs: ['./img/teclado.webp','./img/teclado-2.webp','./img/teclado-3.webp'],
    description: 'Teclado con switches mecánicos y retroiluminación RGB.'
  }
];

// Utilidades
function formatCLP(amount) { return currency.format(Math.round(amount)); }
function withVAT(net) { return net * (1 + VAT); }
function netFromGross(gross) { return gross / (1 + VAT); }

// Carrito en localStorage: estructura [{id, qty, title, price /*net*/}]
function getCart() {
  const raw = localStorage.getItem('tienda_cart');
  return raw ? JSON.parse(raw) : [];
}
function saveCart(cart) {
  localStorage.setItem('tienda_cart', JSON.stringify(cart));
  updateCartBadge();
}
function getCartCount() {
  const cart = getCart();
  return cart.reduce((s, i) => s + i.qty, 0);
}
function updateCartBadge() {
  $('#cartCount').text(getCartCount());
}

// Añadir al carrito (1 unidad)
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  const p = products.find(x => x.id === productId);
  if (!p) return;
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, qty: 1, title: p.title, price: p.price });
  saveCart(cart);
  showToast(`${p.title} agregado al carrito`);
  // animación hacer 'pulse' en el botón del carrito
  $('#cartLink').animate({ fontSize: '1.05rem' }, 120).animate({ fontSize: '1rem' }, 120);
}

// Remover item
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCartView();
}

// Cambio de cantidad (qty mínima 1)
function changeQty(productId, qty) {
  const cart = getCart();
  const it = cart.find(i => i.id === productId);
  if (!it) return;
  it.qty = Math.max(1, Number(qty));
  saveCart(cart);
  renderCartView();
} 

// Mostrar un toast (Bootstrap) simple
function showToast(message) {
  if (!document.getElementById('toastContainer')) {
    const cont = document.createElement('div');
    cont.id = 'toastContainer';
    cont.style.position = 'fixed';
    cont.style.right = '20px';
    cont.style.bottom = '20px';
    cont.style.zIndex = 9999;
    document.body.appendChild(cont);
  }
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-primary border-0';
  toastEl.role = 'alert';
  toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  document.getElementById('toastContainer').appendChild(toastEl);
  const bs = new bootstrap.Toast(toastEl, { delay: 1600 });
  bs.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Render home: muestra algunos productos destacados y hover previews
function renderHomeView() {
  // Animación entrada: fadeIn
  $('#app').html(`
    <section class="text-center mb-4">
      <h2>Ofertas destacadas</h2>
      <p class="text-muted">Promociones seleccionadas para ti</p>
    </section>

    <section id="featured" class="row g-3">
      ${products.map(p => `
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card product-card h-100" data-imgs='${JSON.stringify(p.imgs)}' data-id="${p.id}">
          <img src="${p.imgs[0]}" class="card-img-top product-img product-img-preview" alt="${p.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text text-truncate">${p.description}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <div>
                <strong>${formatCLP(withVAT(p.price))}</strong>
                <small class="price-note">IVA incluido</small>
              </div>
              <div>
                <a href="#product?id=${p.id}" class="btn btn-sm btn-outline-primary me-2">Ver</a>
                <button class="btn btn-sm btn-success btn-buy" data-id="${p.id}">Comprar</button>
              </div>
            </div>
          </div>
        </div>
      </div>`).join('')}
    </section>
  `);

  // jQuery: animaciones y hover previews
  // Al hacer hover en cada tarjeta rotar por las imágenes
  $('.product-card').each(function() {
    const $card = $(this);
    const imgs = JSON.parse($card.attr('data-imgs'));
    let idx = 0;
    let timer = null;

    $card.on('mouseenter', function() {
      // efecto bounce usando animate
      $card.stop(true).animate({ top: '-6px' }, 120).animate({ top: '0px' }, 120);
      // empezar rotación de imágenes
      timer = setInterval(() => {
        idx = (idx + 1) % imgs.length;
        $card.find('.product-img-preview').fadeOut(120, function() {
          $(this).attr('src', imgs[idx]).fadeIn(160);
        });
      }, 700); // cambia cada 700ms
    });

    $card.on('mouseleave', function() {
      clearInterval(timer);
      // volver a la imagen principal (índice 0)
      idx = 0;
      $card.find('.product-img-preview').fadeOut(120, function() {
        $(this).attr('src', imgs[0]).fadeIn(160);
      });
    });
  });

  // eventos compra
  $('.btn-buy').on('click', function() {
    const id = Number($(this).data('id'));
    addToCart(id);
  });

  // animación general aparecer con slide
  $('#featured > div').hide().each(function(i){
    $(this).delay(i*80).fadeIn(220);
  });
}

// Render productos
function renderProductsView(filter = '') {
  const q = filter.trim().toLowerCase();
  const list = products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  $('#app').html(`
    <section class="mb-3 d-flex justify-content-between align-items-center">
      <h2>Productos</h2>
      <small class="text-muted">Mostrando ${list.length} producto(s)</small>
    </section>
    <section class="row g-3">
      ${list.map(p => `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card product-card h-100" data-imgs='${JSON.stringify(p.imgs)}' data-id="${p.id}">
            <img src="${p.imgs[0]}" class="card-img-top product-img product-img-preview" alt="${p.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.title}</h5>
              <p class="card-text text-truncate">${p.description}</p>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <div>
                  <strong>${formatCLP(withVAT(p.price))}</strong>
                  <small class="price-note">IVA incluido</small>
                </div>
                <div>
                  <a href="#product?id=${p.id}" class="btn btn-sm btn-outline-primary me-2">Ver</a>
                  <button class="btn btn-sm btn-success btn-buy" data-id="${p.id}">Comprar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </section>
  `);

  // mismo comportamiento de desplazamiento que en Inicio
  $('.product-card').hover(function(){
    const $card = $(this);
    const imgs = JSON.parse($card.attr('data-imgs'));
    let idx = 0;
    $card.data('imgTimer', setInterval(()=> {
      idx = (idx+1)%imgs.length;
      $card.find('.product-img-preview').fadeOut(120, function(){
        $(this).attr('src', imgs[idx]).fadeIn(160);
      });
    }, 700));
  }, function(){
    const $card = $(this);
    clearInterval($card.data('imgTimer'));
    const imgs = JSON.parse($card.attr('data-imgs'));
    $card.find('.product-img-preview').fadeOut(120, function(){
      $(this).attr('src', imgs[0]).fadeIn(160);
    });
  });

  $('.btn-buy').on('click', function(){ addToCart(Number($(this).data('id'))); });

  // animación aparecer con slideUp
  $('.product-card').hide().each(function(i){ $(this).delay(i*60).slideDown(180); });
}

// Render detalle muestra galería
function renderProductDetail(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) { $('#app').html('<div class="alert alert-danger">Producto no encontrado</div>'); return; }
  $('#app').html(`
    <div class="row g-4">
      <div class="col-12 col-md-6">
        <div class="card shadow-sm">
          <img id="detailMain" src="${p.imgs[0]}" class="card-img-top" alt="${p.title}">
          <div class="p-3 d-flex thumb-list">${p.imgs.map((src, idx)=> `<img src="${src}" data-src="${src}" class="thumb ${idx===0?'active':''}">`).join('')}</div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <h2>${p.title}</h2>
        <p class="text-muted">Categoría: ${p.category}</p>
        <h3 class="text-primary">${formatCLP(withVAT(p.price))} <small class="price-note">IVA incluido</small></h3>
        <p>${p.description}</p>
        <div class="d-flex gap-2">
          <button class="btn btn-lg btn-success" id="addDetail">Agregar al carrito</button>
          <a href="#products" class="btn btn-outline-secondary">Volver a productos</a>
        </div>
      </div>
    </div>
  `);

  // miniaturas
  $('.thumb').on('click', function(){
    const src = $(this).attr('data-src');
    $('#detailMain').fadeOut(120, function(){ $(this).attr('src', src).fadeIn(150); });
    $('.thumb').removeClass('active');
    $(this).addClass('active');
  });

  $('#addDetail').on('click', function(){ addToCart(p.id); });
}

// carrito muestra precios NETOS y BRUTOS, subtotal(s) y total
function renderCartView() {
  const cart = getCart();
  if (cart.length === 0) {
    $('#app').html(`
      <div class="text-center">
        <h2>Tu carrito está vacío</h2>
        <p class="text-muted">Añade productos desde la página de productos.</p>
        <a href="#products" class="btn btn-primary">Ver Productos</a>
      </div>
    `);
    updateCartBadge();
    return;
  }

  // calcular subtotales
  const subtotalNet = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  const subtotalGross = cart.reduce((s,i)=> s + withVAT(i.price) * i.qty, 0);

  $('#app').html(`
    <h2>Carrito de compras</h2>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio (sin IVA)</th>
            <th>Precio (con IVA)</th>
            <th>Cantidad</th>
            <th>Subtotal (sin IVA)</th>
            <th>Subtotal (con IVA)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => `
            <tr data-id="${item.id}">
              <td>${item.title}</td>
              <td>${formatCLP(item.price)}</td>
              <td>${formatCLP(withVAT(item.price))}</td>
              <td style="width:220px;">
                <div class="qty-controls">
                  <input type="number" min="1" value="${item.qty}" class="form-control qty-input" data-id="${item.id}" style="width:80px;">
                </div>
              </td>
              <td>${formatCLP(item.price * item.qty)}</td>
              <td>${formatCLP(withVAT(item.price) * item.qty)}</td>
              <td><button class="btn btn-sm btn-danger btn-remove" data-id="${item.id}">Eliminar</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-end align-items-center gap-3">
      <div class="text-end">
        <div class="text-muted">Subtotal (sin IVA):</div>
        <div><strong>${formatCLP(subtotalNet)}</strong></div>
        <div class="text-muted mt-2">Total (IVA ${Math.round(VAT*100)}%):</div>
        <h3>${formatCLP(subtotalGross)}</h3>
      </div>

      <div>
        <button class="btn btn-success btn-lg" id="checkoutBtn">Proceder a pagar</button>
      </div>
    </div>
  `);

  // eventos
  $('.qty-input').on('change', function(){
    const id = Number($(this).data('id'));
    const val = Number($(this).val());
    changeQty(id, val);
  });

  $('.btn-decrease').on('click', function(){
    const id = Number($(this).data('id'));
    const cart = getCart();
    const it = cart.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, it.qty - 1);
    saveCart(cart);
    renderCartView();
  });

  $('.btn-increase').on('click', function(){
    const id = Number($(this).data('id'));
    const cart = getCart();
    const it = cart.find(i => i.id === id);
    if (!it) return;
    it.qty += 1;
    saveCart(cart);
    renderCartView();
  });

  $('.btn-remove').on('click', function(){
    removeFromCart(Number($(this).data('id')));
  });

  $('#checkoutBtn').on('click', function(){
    localStorage.removeItem('tienda_cart');
    updateCartBadge();
    renderCartView();
    showToast('Compra realizada (simulada). Gracias por tu compra.');
  });
}

// Renderizar
function renderAboutView() {
  $('#app').html(`
    <div class="p-4 shadow-sm rounded bg-white">
      <h2>Acerca de TiendaDemo</h2>
      <p>Portafolio Modulo 2 de frontend para un e-commerce. HTML, CSS, Bootstrap, jQuery y JS.</p>
      <p>Funcionalidades: listado, detalle con galería, carrito persistente, filtros y animaciones.</p>
    </div>
  `);
}

function parseHash() {
  const hash = location.hash.replace(/^#/, '');
  const [path, query] = hash.split('?');
  const params = {};
  if (query) query.split('&').forEach(p => { const [k,v] = p.split('='); params[k] = decodeURIComponent(v); });
  return { path: path || 'home', params };
}

function router() {
  const { path, params } = parseHash();
  if (path === 'home') renderHomeView();
  else if (path === 'products') renderProductsView(params.q || '');
  else if (path === 'product' && params.id) renderProductDetail(Number(params.id));
  else if (path === 'cart') renderCartView();
  else if (path === 'about') renderAboutView();
  else renderHomeView();
  updateCartBadge();
}

// Búsqueda - guarda en session y renderiza productos
function searchProducts() {
  const q = $('#searchInput').val().trim();
  sessionStorage.setItem('tienda_search', q);
  renderProductsView(q);
  location.hash = 'products';
}

// Generar filtros por categoría dinámicamente (pill buttons)
function renderCategoryFilters() {
  const cats = Array.from(new Set(products.map(p => p.category)));
  const $container = $('#categoryFilters');
  // agregamos un dropdown o botones al nav
  cats.forEach(cat => {
    const $li = $(`<li class="nav-item"><a class="nav-link category-pill" href="#products?cat=${encodeURIComponent(cat)}">${cat}</a></li>`);
    $container.append($li);
  });
}

// Inicialización
$(document).ready(function(){
  $('#year').text(new Date().getFullYear());
  renderCategoryFilters();

  // Si hash inicial tiene cat o q
  const { path, params } = parseHash();
  if (path === 'products' && params.cat) {
    renderProductsView(params.cat);
  } else if (sessionStorage.getItem('tienda_search')) {
    if (location.hash.startsWith('#products')) renderProductsView(sessionStorage.getItem('tienda_search'));
  }

  router();
  window.addEventListener('hashchange', router);
  updateCartBadge();

  // Click en marca vuelve a home
  $('.navbar-brand').on('click', function(e){ e.preventDefault(); location.hash = 'home'; });
});

// exponer funciones necesarias si se usan desde atributos HTML
window.addToCart = addToCart;
window.renderProductsView = renderProductsView;
window.renderCartView = renderCartView;
window.searchProducts = searchProducts;

