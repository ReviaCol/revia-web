# Reviá Web — Setup & Run

> Proyecto Next.js 16 + React 19 + Tailwind v4 + Motion (Framer Motion v11+).
> Hero V4 Cinematic implementado. Sincronizado con `02-mockups-claude-design/01-hero-manifesto/final/`.

---

## 1. Cómo correr en tu PC

Abre una terminal en `C:\Users\andre\Documents\Claude\Projects\Reviá Web Page\05-src\` y ejecuta:

```bash
npm install
```

Esto va a tomar 1-3 minutos (descarga ~700 MB de dependencias). Cuando termine:

```bash
npm run dev
```

Abre el navegador en `http://localhost:3000`. Deberías ver el Hero V4 Cinematic — igual al `final/desktop.html` que aprobaste, pero ahora corriendo como aplicación Next.js real con animaciones via Motion.

---

## 2. Qué se implementó

### Estructura de archivos

```
05-src/
├── src/
│   ├── app/
│   │   ├── layout.tsx            ← fuentes Jost+Manrope, metadata SEO
│   │   ├── page.tsx              ← monta <Hero />
│   │   └── globals.css           ← tokens, grain noise, base styles
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx        ← logo + 4 items, transparente sobre hero
│   │   └── hero/
│   │       ├── Hero.tsx          ← grid 70/30, orquestador
│   │       ├── ManifestoReveal.tsx  ← "Tu belleza ya existe." + "Espera ser revelada."
│   │       ├── Monolith.tsx      ← bloque terracotta + figure slot + mark vertical
│   │       ├── ScrollHint.tsx    ← línea + "Desliza para revelar" + flecha pulsante
│   │       └── SectionContinued.tsx  ← segundo viewport con resto del manifesto
│   └── lib/
│       └── motion-tokens.ts      ← easing y durations centralizados
├── public/
│   └── brand/
│       └── revia-logo.png        ← logo trimmeado
└── package.json                  ← motion@11, next@16, react@19, tailwind@4
```

### Sincronización con el handoff de Claude Design

Cada decisión de craft del `final/handoff-notes.md` se preservó:

| Decisión de craft | Implementación |
|---|---|
| `mix-blend-mode: multiply` en logo PNG | ✓ `<Image className="mix-blend-multiply" />` |
| `white-space: nowrap` en líneas del manifesto desktop | ✓ `.manifesto-line` en globals.css con media query |
| Stagger horizontal (línea 2 con padding-left 80px) | ✓ `style={{ paddingLeft: "80px" }}` |
| Grain noise SVG turbulence 4% opacity | ✓ `body::before` en globals.css |
| `<em>` sobre "revelada" sin itálica, terracotta-600 | ✓ inline style en ManifestoReveal |
| Monolith mark vertical "MMXXVI · BOGOTÁ" | ✓ `writing-mode: vertical-rl + rotate(180deg)` |
| Easing único `cubic-bezier(0.22, 1, 0.36, 1)` | ✓ `easing.outExpo` en motion-tokens.ts |
| IntersectionObserver para reveals | ✓ `whileInView` de Motion (usa IO internamente) |
| `prefers-reduced-motion` fallback | ✓ regla CSS global con duration 400ms |

### Lo que NO se implementó todavía

- **Mobile dedicado**: por ahora el monolito se oculta en mobile (`@media max-width: 900px`). El layout mobile completo del `final/mobile.html` (banda terracotta horizontal, CTA outline, hamburger menu) queda como ajuste de la próxima sesión.
- **Foto editorial real**: el `figure-slot` muestra el placeholder peach con líneas diagonales. Cuando tengas la foto, la dejas en `public/brand/figura-hero.jpg` y reemplazamos.
- **Logo SVG**: usa el PNG trimmed (788 KB). Ideal pero no crítico migrar a SVG.

---

## 3. Verificaciones visuales recomendadas

Cuando el dev server esté corriendo, valida en este orden:

1. **Desktop 1440px** (resize tu navegador o usa devtools):
   - Manifesto serif Jost grande, peso 500.
   - Bloque terracotta a la derecha con sombra ambient.
   - Microtexto vertical "MMXXVI · BOGOTÁ" en el monolito.
   - Línea pulsante + "DESLIZA PARA REVELAR" abajo a la izquierda.

2. **Scroll**: al hacer scroll, debe revelarse la segunda línea "Espera ser revelada." (con "revelada" en terracotta), y luego el segundo viewport con "Manifiesto · ii" + el resto.

3. **Mobile 375px** (devtools → mobile view):
   - El bloque terracotta desaparece (ojo: layout mobile completo queda pendiente).
   - El manifesto se reorganiza vertical, font-size más chico.
   - El nav se reemplaza por el icono ☰.

4. **Reduced motion**: en macOS System Settings → Accessibility → Display → Reduce motion (o equivalente Windows). Refresca. Las animaciones deben ser solo opacity, sin blur ni translate.

5. **Focus**: presiona Tab. Cada link/botón debe mostrar un outline marrón institucional `#75554F`.

---

## 4. Comandos útiles

```bash
npm run dev      # dev server con hot reload (puerto 3000)
npm run build    # build de producción (validar que compila sin errores)
npm run start    # corre el build de producción localmente
npm run lint     # ESLint
```

---

## 5. Próximos pasos sugeridos (en orden)

1. Tú corres `npm install && npm run dev` → tomas screenshot del Hero corriendo → me lo pasas.
2. Yo audito el render real vs el mockup, identificamos ajustes finos si los hay.
3. Cerramos Fase 4 (Verify) del workflow con QA report en `08-workflow/qa-runs/01-hero/`.
4. Arrancamos Fase 5 (Learn): retrospectiva del Hero + memorias actualizadas.
5. Después, los siguientes BRIEFs en Claude Design (Filosofía, Tratamientos hub, Equipo, Contacto, Layout global) en paralelo a fixes de mobile del Hero.

Si algo falla en `npm install` o `npm run dev`, copia y pégame el error completo.
