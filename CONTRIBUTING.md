# 🤝 Guía para Contribuidores — VigilanCOL

¡Gracias por querer contribuir a VigilanCOL! Este proyecto existe para hacer de Colombia un país más transparente. Cada contribución, por pequeña que sea, importa.

## Tabla de contenidos

- [Código de conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configurar el entorno de desarrollo](#configurar-el-entorno-de-desarrollo)
- [Estilo de código](#estilo-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Actualizar datos de candidatos](#actualizar-datos-de-candidatos)
- [Reportar información incorrecta](#reportar-información-incorrecta)

---

## Código de conducta

Este proyecto sigue estos principios:

1. **Respeto** — Trato respetuoso entre todos los contribuidores
2. **Imparcialidad** — No apoyamos ni atacamos a ningún partido político
3. **Evidencia** — Solo incluimos información con fuentes verificables
4. **Presunción de inocencia** — Toda mención debe aclarar el estado legal real
5. **Transparencia** — El código y los datos son abiertos y auditables

---

## ¿Cómo puedo contribuir?

### 🐛 Reportar un bug

1. Abre un [Issue](https://github.com/TU_USUARIO/vigilancol/issues/new?template=bug_report.md)
2. Describe el problema claramente
3. Incluye pasos para reproducirlo
4. Adjunta captura de pantalla si aplica

### 💡 Sugerir una nueva funcionalidad

1. Abre un [Issue](https://github.com/TU_USUARIO/vigilancol/issues/new?template=feature_request.md)
2. Explica el problema que resuelve
3. Describe cómo funcionaría
4. Indica si puedes implementarla tú mismo

### 📊 Actualizar datos

Los datos de candidatos, escándalos y alertas se actualizan manualmente en `index.html`. Ver sección [Actualizar datos de candidatos](#actualizar-datos-de-candidatos).

### 🌐 Traducir

Actualmente el sitio está en español. Si quieres agregar soporte para inglés u otras lenguas, abre un Issue primero para coordinar.

### 💻 Contribuir código

Ver sección [Proceso de Pull Request](#proceso-de-pull-request).

---

## Configurar el entorno de desarrollo

### Requisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta en Vercel (para funciones API locales)
- Git

### Pasos

```bash
# 1. Fork en GitHub (botón "Fork" arriba a la derecha)

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/vigilancol.git
cd vigilancol

# 3. Instalar Vercel CLI globalmente
npm install -g vercel

# 4. Vincular con tu cuenta de Vercel
vercel link

# 5. Crear variables de entorno locales
cp .env.example .env.local
# Edita .env.local con tus API keys

# 6. Iniciar servidor de desarrollo
vercel dev
# Abre: http://localhost:3000
```

### Estructura de archivos clave

```
index.html
  ├── <style>          — Todo el CSS (líneas 10-280)
  ├── Tabs HTML        — Contenido de cada pestaña (líneas 285-750)
  ├── Modales          — Ventanas emergentes (líneas 752-800)
  └── <script>         — JavaScript (líneas 805-final)
       ├── COUNTDOWN    — Cuenta regresiva electoral
       ├── TABS         — Sistema de navegación
       ├── CDATA        — Array de candidatos al Congreso
       ├── PRES         — Array de candidatos presidenciales
       ├── DMAP         — Datos del mapa por departamento
       ├── UNGRD        — Datos caso UNGRD
       ├── SECOP II     — Buscador y detección de alertas
       └── EMAIL        — Formulario de suscripción

api/
  ├── secop.js                   — Proxy SECOP II
  ├── alertas.js                 — Alertas email (Resend)
  └── actualizar-candidatos.js  — Actualización IA (Claude)
```

---

## Estilo de código

### JavaScript

- **Sin frameworks** — Vanilla JS puro para mantener el proyecto accesible
- Variables con `const`/`let`, nunca `var`
- Funciones con nombres descriptivos en español o inglés
- Comentarios en español cuando el código no es obvio

```javascript
// ✅ Bien
async function buscarContratosSecop(query, departamento) {
  const params = new URLSearchParams({ q: query });
  // ...
}

// ❌ Evitar
async function f(q, d) {
  var p = new URLSearchParams({ q: q });
  // ...
}
```

### CSS

- Variables CSS para todos los colores (usar las existentes en `:root`)
- Clases cortas para componentes frecuentes
- Mobile-first con media queries

```css
/* ✅ Usar variables existentes */
.mi-componente {
  color: var(--cy);
  background: var(--s1);
  border: 1px solid var(--bd);
}

/* ❌ No hardcodear colores */
.mi-componente {
  color: #00d4ff;
  background: #0d1117;
}
```

### Variables CSS disponibles

| Variable | Color | Uso |
|----------|-------|-----|
| `--cy` | `#00d4ff` | Cian — acento principal |
| `--re` | `#ff4444` | Rojo — alertas críticas |
| `--ye` | `#ffc300` | Amarillo — alertas medias |
| `--gr` | `#3fb950` | Verde — positivo / seguro |
| `--or` | `#f0883e` | Naranja — alertas altas |
| `--pu` | `#d2a8ff` | Púrpura — informativo |
| `--bg` | `#07090f` | Fondo principal |
| `--s1` | `#0d1117` | Superficie 1 |
| `--s2` | `#161b22` | Superficie 2 |
| `--tx` | `#e6edf3` | Texto principal |
| `--mu` | `#7d8590` | Texto secundario/muted |
| `--bd` | `#21262d` | Borde normal |

### HTML

- Semántico cuando sea posible
- Atributos `onclick` para eventos simples
- IDs descriptivos con prefijos por módulo (ej: `sec-` para SECOP, `mp-` para mapa)

---

## Proceso de Pull Request

### 1. Crear rama

```bash
# Nomenclatura: tipo/descripcion-corta
git checkout -b feat/mapa-geojson-real
git checkout -b fix/secop-paginacion
git checkout -b data/candidatos-marzo-2026
git checkout -b docs/guia-contribucion
```

### 2. Hacer cambios

- Mantén los cambios enfocados en un solo tema
- No mezcles múltiples funcionalidades en un PR
- Prueba en local con `vercel dev` antes de enviar

### 3. Commit

```bash
# Formato: tipo(alcance): descripción en minúsculas
git commit -m "feat(mapa): agregar GeoJSON real de Colombia del DANE"
git commit -m "fix(secop): corregir paginación cuando hay >200 resultados"
git commit -m "data(candidatos): actualizar lista marzo 2026 con fuentes nuevas"
git commit -m "docs(readme): agregar sección de arquitectura"
```

**Tipos de commit:**
- `feat` — nueva funcionalidad
- `fix` — corrección de bug
- `data` — actualización de datos (candidatos, escándalos, etc.)
- `docs` — documentación
- `style` — cambios CSS/visuales (sin lógica)
- `refactor` — refactorización sin cambio de funcionalidad
- `test` — agregar o modificar tests
- `chore` — tareas de mantenimiento

### 4. Push y Pull Request

```bash
git push origin feat/mapa-geojson-real
```

Luego en GitHub: **"Compare & pull request"**

En la descripción del PR incluye:
- ¿Qué cambia?
- ¿Por qué es necesario?
- ¿Cómo se probó?
- Capturas de pantalla (si aplica)
- Issues relacionados: `Closes #123`

---

## Actualizar datos de candidatos

Los datos de candidatos están hardcodeados en `index.html` en dos arrays JavaScript:

### Array `CDATA` — Candidatos al Congreso

Ubicación: busca `const CDATA=[` en `index.html`

```javascript
// Formato de cada candidato:
{
  nombre: 'Nombre Completo del Candidato',
  aspiracion: 'Senado',              // 'Senado' | 'Cámara' | 'Congreso'
  partido: 'Nombre del Partido',
  cargo: 'Cargo actual',
  proceso: 'Descripción clara del cuestionamiento (máx 200 chars)',
  entidad: 'Fiscalía General',       // entidad que investiga
  riesgo: 'critico',                 // 'critico' | 'alto' | 'medio' | 'bajo'
  fuente: 'https://url-verificada.com/articulo',
  fl: 'El Colombiano'                // nombre corto de la fuente
}
```

**Reglas para agregar candidatos:**
1. ✅ Debe tener fuente verificable (medio reconocido o entidad oficial)
2. ✅ Indicar claramente si es investigación, indagación o condena
3. ✅ Aplicar presunción de inocencia en la redacción del `proceso`
4. ❌ No agregar candidatos por rumores o redes sociales
5. ❌ No agregar candidatos por diferencias políticas sin base legal

### Array `PRES` — Candidatos presidenciales

Ubicación: busca `const PRES=[` en `index.html`

```javascript
{
  n: 'Nombre',                       // nombre del candidato
  p: 'Partido / Movimiento',
  t: 'centro',                       // 'derecha' | 'centro' | 'izquierda'
  e: '👩',                           // emoji representativo
  enc: '~8%',                        // intención de voto (o '—' si no hay)
  d: 'Descripción breve del candidato...',
  tags: ['Partido Verde', 'Gran Consulta'],
  alerta: ''                         // vacío o descripción de cuestionamiento
}
```

### Objeto `DMAP` — Datos del mapa por departamento

Ubicación: busca `const DMAP={` en `index.html`

```javascript
'NOMBRE DEPARTAMENTO': {
  r: 'alto',     // 'critico' | 'alto' | 'medio' | 'bajo'
  a: 25,         // número de alertas (estimado o real)
  cs: 134,       // contratos sospechosos
  ci: 1,         // candidatos investigados
  d: 'Descripción del riesgo en este departamento.'
}
```

---

## Reportar información incorrecta

Si encuentras datos desactualizados, incorrectos o que violan la presunción de inocencia:

1. Abre un Issue con el label `data: correction`
2. Indica qué información está mal
3. Provee la fuente correcta con URL
4. Haremos la corrección en menos de 48 horas

**Especialmente importante:** Si una persona fue absuelta, la investigación fue archivada, o el dato es incorrecto, prioriza reportarlo. La precisión es nuestra responsabilidad.

---

## ¿Preguntas?

Abre un [Issue con label "question"](https://github.com/TU_USUARIO/vigilancol/issues/new?labels=question) y te respondemos lo antes posible.

---

*Gracias por contribuir a la transparencia de Colombia 🇨🇴*
