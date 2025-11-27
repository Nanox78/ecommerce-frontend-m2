# Tienda e-Commerce — Frontend (MVP) - Módulo 2

## Objetivo

Desarrollar la primera versión (MVP) del frontend de una tienda en línea utilizando HTML5 semántico, Bootstrap para diseño responsivo y JavaScript para interacción básica (carrito simulado, render dinámico de productos). El proyecto funciona como portafolio del módulo.

## Tecnologías

* HTML5 (semántico): header, nav, main, section, footer
* CSS3 (Bootstrap 5 CDN + estilos personalizados)
* JavaScript (ES6) y jQuery para animaciones y manipulación del DOM
* LocalStorage (para persistir el carrito de forma simple)
* Git + GitHub para control de versiones

## Estructura del proyecto

```
ecommerce-frontend-m2/
├─ index.html
├─ README.md
├─ .gitignore
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js
└─ img/
   └─ (imágenes de los productos)
```

## Funcionamiento y características (MVP)

* Vista **Home**: grilla de productos con cards (Bootstrap).
* **Detalle de producto**: imagen principal, galería de miniaturas, título, descripción y botón "Agregar al carrito".
* **Carrito** (simulado): listado de productos añadidos, control cantidad (+ / -), subtotal sin IVA y total con IVA (IVA 19%). Contador en la navbar.
* Precios mostrados en CLP (formateo con `Intl.NumberFormat`).
* Filtros de categoría y búsqueda básica.
* Animaciones jQuery para hover y entradas visuales.

## Cómo ejecutar (local)

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/ecommerce-frontend-m2.git
   cd ecommerce-frontend-m2
   ```
2. Abrir el archivo `index.html` en un navegador (doble clic) o servir localmente con un servidor estático, por ejemplo con Python:

   ```bash
   # Python 3
   python -m http.server 8000
   # Luego abrir http://localhost:8000
   ```
3. Probar funcionalidades:

   * Agregar productos al carrito, verificar contador.
   * Página de detalle: cambiar miniaturas.
   * Carrito: aumentar/disminuir cantidad, eliminar producto.

## Notas de desarrollo

* Los precios en `js/app.js` están definidos como valor **sin IVA** (neto). La visualización en listados muestra precio con IVA y la vista del carrito muestra ambos (sin y con IVA).
* Para convertir precios que ya estén con IVA a neto: `net = Math.round(gross / 1.19)`.

## Recomendaciones / próximos pasos

* Integrar backend para persistencia de pedidos y autenticación.
* Implementar tests unitarios en funciones críticas.
* Mejorar accesibilidad (atributos `alt`, roles ARIA, foco en controles).
* Implementar workflow CI/CD simple (por ejemplo GitHub Pages para el frontend).

---

**Autor:** Hernán Morales
**Fecha:** [27/11/2025]
