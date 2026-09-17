# Portfolio — Akram Amghibech

Portfolio personal de **Akram Amghibech**, técnico SMR en Bilbao.
Administración de sistemas Windows y Linux, redes Cisco. Busco prácticas en Bilbao y alrededores.

![HTML5](https://img.shields.io/badge/HTML5-semántico-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-moderno-1572B6?logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green)
![Pages](https://img.shields.io/badge/GitHub_Pages-listo-blue?logo=github)

**Demo:** https://akamto.github.io/Portfolio/

![Vista previa del portfolio](assets/og-cover.png)

## Características

- 100% HTML semántico + CSS moderno + JS puro, sin frameworks ni dependencias.
- Modo claro / oscuro con guardado en `localStorage` y sin flash (script en `<head>`).
- Responsive real: móvil ≤860px con menú hamburguesa + overlay, tablet ≥861px, desktop ≥1024px.
- Accesible: skip-link, ARIA (`aria-current`, `aria-hidden`/`inert` en menú), foco visible, contraste AA, `prefers-reduced-motion`, funciona sin JS (`<noscript>`).
- SEO: canonical, Open Graph / Twitter Card con dimensiones, `sitemap.xml`, `robots.txt`, JSON-LD `Person`.
- PWA lista: `site.webmanifest` con iconos 32/180/192/512 + maskable 512, `screenshots` wide + narrow, `shortcuts` y `categories`; offline con `sw.js` (JS puro, caché `portfolio-v2` con stale-while-revalidate).
- Favicon en 3 formatos: `favicon.ico` + `favicon.svg` + PNG, con `color-scheme` claro/oscuro.
- Contacto directo sin backend: `mailto` + CV descargable.
- Portada Open Graph `assets/og-cover.png` (1200x630 real con la marca).
- Página `404.html` con tema, rutas absolutas `/Portfolio/` (funciona en cualquier subruta), favicons PNG + SVG, manifest y hoja de impresión.

## Verlo en local

No necesita servidor ni build. Opción 1: abre `index.html` en el navegador.

Opción 2 (recomendada, evita problemas con rutas):

```powershell
# Python
python -m http.server 8000
# o Node
npx serve .
```

Luego abre http://localhost:8000

## Estructura

```text
Portfolio/
├── index.html              # contenido y SEO
├── style.css               # estilos, temas, responsive, print
├── script.js               # tema, menú móvil, scroll, reveal + registro SW
├── sw.js                   # Service Worker nativo: portfolio offline
├── cv-akram-amghibech.pdf  # CV descargable (enlazado en la web)
├── favicon.ico             # favicon clásico 48px
├── favicon.svg             # favicon principal
├── assets/
│   ├── favicon-32.png      # 32x32
│   ├── apple-touch-icon.png# 180x180
│   ├── icon-192.png        # PWA 192
│   ├── icon-512.png        # PWA 512
│   ├── maskable-512.png    # PWA maskable 512
│   ├── foto-perfil.png     # foto perfil hero 84px
│   └── og-cover.png        # imagen Open Graph 1200x630
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── .nojekyll
├── .gitattributes
└── LICENSE (MIT)
```

## Subirlo como nueva repo `Portfolio`

La carpeta ya es un repo git local con el primer commit hecho (sin remote, sin push).
Solo falta publicarlo:

```powershell
# 1. Crea la repo vacía "Portfolio" en GitHub (sin README, sin .gitignore, sin LICENSE)
# 2. Revisa el estado local:
git status
git log --oneline

# 3. Conecta y sube (SOLO cuando tú quieras, esto sí publica):
git remote add origin https://github.com/akamto/Portfolio.git
git branch -M main
git push -u origin main

# 4. Activa Pages: GitHub > Settings > Pages > Deploy from branch > main / (root)
# 5. Tu web quedará en: https://akamto.github.io/Portfolio/
```

> Si ya tienes la demo en otra URL, actualiza `canonical`, `og:url`, `og:image` en `index.html`, y `robots.txt` + `sitemap.xml`.

## Personalizar

- Cambia colores/fuentes en `:root` de `style.css`.
- `assets/og-cover.png` ya es una portada 1200x630 con tu marca (opcional: sustituir por captura real).
- Cuando publiques repos reales, cambia los enlaces `https://github.com/akamto?tab=repositories` por la URL de cada proyecto (hay un `<!-- TODO -->` en `index.html` que lo marca).
- Actualiza `cv-akram-amghibech.pdf` y listo, la web ya lo enlaza en hero, sobre-mí, contacto y footer.

## Contacto

- Email: akram.amghibech@ikasle.eus
- LinkedIn: https://www.linkedin.com/in/akram-amghibech-tohami-880716360/
- GitHub: https://github.com/akamto

## Licencia

MIT — ver [LICENSE](LICENSE).
