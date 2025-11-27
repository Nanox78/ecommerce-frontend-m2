// Datos de ejemplo (en produccion, vendrían de una API o JSON)
];


// Carrito simple (localStorage)
const CART_KEY = 'tienda_cart_v1';
function getCart(){return JSON.parse(localStorage.getItem(CART_KEY) || '[]');}
function saveCart(cart){localStorage.setItem(CART_KEY, JSON.stringify(cart));updateCartCount();}
function updateCartCount(){const c = getCart().reduce((s,i)=>s+i.qty,0); const el = document.getElementById('cart-count'); if(el) el.textContent = c}


// Renderizar listado en index.html
function renderProducts(){
const grid = document.getElementById('products-grid');
if(!grid) return;
grid.innerHTML = '';
products.forEach(p=>{
const card = document.createElement('div'); card.className='card';
card.innerHTML = `
<img src="${p.img}" alt="${p.title}" />
<h3>${p.title}</h3>
<p>${p.desc}</p>
<div class="price">$${p.price.toLocaleString()}</div>
<div style="margin-top:.5rem">
<a class="btn btn-primary" href="product.html?id=${p.id}">Ver producto</a>
<button class="btn" onclick="addToCart(${p.id})">Comprar</button>
</div>
`;
grid.appendChild(card);
});
}


// Renderizar detalle en product.html
function renderProductDetail(){
const detail = document.getElementById('product-detail');
if(!detail) return;
const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id')) || products[0].id;
const p = products.find(x=>x.id===id);
if(!p) { detail.innerHTML='<p>Producto no encontrado</p>'; return; }
detail.innerHTML = `
<div>
<img src="${p.img}" alt="${p.title}" style="width:100%;border-radius:8px"/>
</div>
<div>
<h2>${p.title}</h2>
<p>${p.desc}</p>
<p class="price">$${p.price.toLocaleString()}</p>
<button class="btn btn-primary" onclick="addToCart(${p.id})">Agregar al carrito</button>
</div>
`;
}


function addToCart(id){
const cart = getCart();
const item = cart.find(i=>i.id===id);
if(item) item.qty+=1; else cart.push({id, qty:1});
saveCart(cart);
alert('Producto agregado al carrito');
}


// Inicialización en cualquier página
document.addEventListener('DOMContentLoaded', ()=>{
renderProducts();
renderProductDetail();
updateCartCount();
});