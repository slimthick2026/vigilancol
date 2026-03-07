# 🔬 VigilanCOL — Plataforma Anticorrupción Colombia

<div align="center">

![VigilanCOL](https://img.shields.io/badge/VigilanCOL-3.0-00d4ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6Ii8+PC9zdmc+)
![License](https://img.shields.io/badge/Licencia-MIT-3fb950?style=for-the-badge)
![Colombia](https://img.shields.io/badge/Colombia-🇨🇴-ffc300?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Desplegado_en-Vercel-000000?style=for-the-badge&logo=vercel)

**Transparencia · Justicia · Democracia**

[🌐 Demo en vivo](https://vigilancol.vercel.app) · [📋 Reportar bug](https://github.com/TU_USUARIO/vigilancol/issues) · [💡 Sugerir mejora](https://github.com/TU_USUARIO/vigilancol/issues/new?template=feature_request.md) · [📖 Documentación](https://github.com/TU_USUARIO/vigilancol/wiki)

<br>

[![Donar con PayPal](https://img.shields.io/badge/💙_Apoya_el_proyecto-PayPal-003087?style=for-the-badge&logo=paypal)](https://paypal.me/slimthick062026)

</div>

---

## ¿Qué es VigilanCOL?

VigilanCOL es una **herramienta ciudadana de código abierto** para monitorear la corrupción en Colombia. Conecta datos públicos del Estado colombiano y los presenta de forma clara para que cualquier ciudadano pueda tomar decisiones informadas, especialmente en períodos electorales.

**No somos una ONG, no somos un partido político. Somos código.**

### Funcionalidades actuales (v3.0)

| Módulo | Descripción | Fuente de datos |
|--------|-------------|-----------------|
| 📊 Dashboard | Alertas activas y calendario electoral | Manual + medios verificados |
| 🗳️ Candidatos Congreso | Lista de candidatos con investigaciones activas | Fiscalía, CSJ, Procuraduría |
| 🏛️ Presidenciales | Candidatos presidenciales 2026 con encuestas | Registraduría, medios |
| 🗺️ Mapa Corrupción | Mapa por departamento con nivel de riesgo | SECOP II + alertas |
| 🚨 Caso UNGRD | Línea de tiempo y congresistas involucrados | Corte Suprema, Infobae |
| 📋 SECOP II | Buscador en tiempo real con detección de alertas | datos.gov.co API |
| 🔔 Alertas Email | Suscripción a notificaciones anticorrupción | Resend API |
| 🤖 IA Candidatos | Actualización automática con Claude AI | Anthropic API |

---

## 🚀 Inicio rápido

### Prerrequisitos

- Cuenta en [GitHub](https://github.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Node.js 18+ (solo para desarrollo local)

### Despliegue en 5 minutos (sin código)

1. Haz **fork** de este repositorio
2. Ve a [vercel.com](https://vercel.com) → **"Add New Project"**
3. Importa tu fork → **"Deploy"**
4. ¡Listo! Tendrás tu propia instancia en `tu-proyecto.vercel.app`

### Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/vigilancol.git
cd vigilancol

# Instalar Vercel CLI
npm install -g vercel

# Ejecutar en modo desarrollo (incluye las funciones /api)
vercel dev

# Abrir en el navegador
open http://localhost:3000
```

### Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
# Requerida para actualización de candidatos con IA
ANTHROPIC_API_KEY=sk-ant-...

# Requerida para envío de alertas por email
RESEND_API_KEY=re_...

# Opcional: aumenta límite de requests a datos.gov.co
SOCRATA_TOKEN=tu_token_aqui
```

En Vercel: `Settings → Environment Variables → agregar cada variable`

---

## 🏗️ Arquitectura

```
vigilancol/
├── index.html                    # Frontend completo (SPA sin frameworks)
├── vercel.json                   # Configuración de rutas Vercel
│
├── api/                          # Backend serverless (Vercel Functions)
│   ├── secop.js                  # Proxy SECOP II → datos.gov.co
│   ├── alertas.js                # Suscripción y envío de alertas email
│   └── actualizar-candidatos.js  # Actualización IA de candidatos
│
├── README.md                     # Este archivo
├── CONTRIBUTING.md               # Guía para contribuidores
├── SECURITY.md                   # Política de seguridad
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    └── PULL_REQUEST_TEMPLATE.md
```

### Stack tecnológico

**Frontend**
- HTML5 + CSS3 + Vanilla JavaScript (sin frameworks — cero dependencias)
- Google Fonts: Bebas Neue + Outfit
- Diseño responsive mobile-first

**Backend (Vercel Serverless Functions)**
- Node.js 18+ (CommonJS)
- Sin base de datos — datos en tiempo real desde APIs públicas

**APIs externas**
| API | Uso | Costo | Documentación |
|-----|-----|-------|---------------|
| [datos.gov.co / Socrata](https://dev.socrata.com) | SECOP II contratos | Gratis | [docs](https://dev.socrata.com/docs/queries/) |
| [Anthropic Claude](https://anthropic.com) | Actualización IA candidatos | ~$0.01/llamada | [docs](https://docs.anthropic.com) |
| [Resend](https://resend.com) | Alertas email | Gratis 3k/mes | [docs](https://resend.com/docs) |

### Flujo de datos

```
Usuario (navegador)
    │
    ├─── GET /api/secop?q=UNGRD
    │         │
    │    [Vercel Function]──────► datos.gov.co (SECOP II)
    │         │                        │
    │    ◄────┘ JSON limpio ◄──────────┘
    │
    ├─── POST /api/alertas
    │         │
    │    [Vercel Function]──────► Resend API (email)
    │
    └─── GET /api/actualizar-candidatos
              │
         [Vercel Function]──────► Anthropic Claude API
```

---

## 📡 API Reference

### `GET /api/secop`

Proxy hacia la API pública de SECOP II (datos.gov.co). Resuelve el problema de CORS.

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `q` | string | No | Búsqueda full-text (entidad, proveedor, objeto) |
| `depto` | string | No | Filtrar por departamento |
| `limit` | number | No | Resultados por página (máx 200, default 50) |
| `offset` | number | No | Paginación (default 0) |

**Ejemplo:**
```bash
GET /api/secop?q=UNGRD&limit=10

# Respuesta exitosa:
{
  "ok": true,
  "total": 10,
  "offset": 0,
  "data": [...],
  "source": "SECOP II — datos.gov.co",
  "timestamp": "2026-03-06T..."
}
```

---

### `POST /api/alertas`

Registra un suscriptor y envía email de confirmación.

**Body (JSON):**
```json
{
  "email": "ciudadano@ejemplo.com",
  "nombre": "Juan Pérez",
  "departamento": "Antioquia",
  "frecuencia": "diaria",
  "tipos": ["secop", "judicial", "electoral"]
}
```

**Respuesta:**
```json
{
  "ok": true,
  "message": "¡Suscripción activada! Revisa tu bandeja de entrada.",
  "email": "ciudadano@ejemplo.com"
}
```

---

### `GET /api/actualizar-candidatos`

Usa Claude AI para generar lista actualizada de candidatos cuestionados.

**Requiere:** Variable de entorno `ANTHROPIC_API_KEY`

**Respuesta:**
```json
{
  "ok": true,
  "actualizado": "2026-03-06",
  "total": 15,
  "candidatos": [
    {
      "nombre": "Nombre Candidato",
      "aspiracion": "Senado",
      "partido": "Partido X",
      "cargo": "Representante",
      "proceso": "Descripción del cuestionamiento...",
      "entidad": "Fiscalía General",
      "riesgo": "alto",
      "fuente": "https://...",
      "fuenteLabel": "El Colombiano"
    }
  ],
  "generadoPor": "Claude Sonnet (Anthropic)"
}
```

---

## 🔍 Algoritmo de Detección de Alertas SECOP

El sistema detecta automáticamente patrones de posible corrupción en contratos públicos:

```javascript
// Reglas de detección (api/secop.js y index.html)

// 1. FRACCIONAMIENTO — Contratos cerca del límite de mínima cuantía
if (valor >= $40M && valor <= $50M)
  → alerta: "✂️ Posible fraccionamiento"

// 2. CONTRATACIÓN DIRECTA ELEVADA — Sin competencia y alto valor
if (modalidad.includes('directa') && valor > $500M)
  → alerta: "🔴 Directa >$500M"

// 3. PROPONENTE ÚNICO — Sin competencia real
if (numero_de_oferentes == 1)
  → alerta: "⚠️ Proponente único"

// 4. VALOR ANÓMALO — Contrato de muy alto valor
if (valor > $5.000M)
  → alerta: "💰 Valor >$5.000M"

// 5. CONSULTORÍA SIN LICITACIÓN
if (descripcion.includes('consultor') && valor > $1.000M && !modalidad.includes('licitaci'))
  → alerta: "📋 Consultoría sin licitación"
```

¿Tienes ideas para mejorar estas reglas? Abre un [issue](https://github.com/TU_USUARIO/vigilancol/issues/new) o un PR.

---

## 🤝 Cómo Contribuir

¡Las contribuciones son bienvenidas! Lee la guía completa en [CONTRIBUTING.md](./CONTRIBUTING.md).

### Áreas que necesitan ayuda

**🐛 Bugs conocidos**
- [ ] El mapa SVG es una aproximación — necesita coordenadas geográficas reales
- [ ] La tabla de candidatos necesita paginación cuando hay muchos registros
- [ ] Los datos del mapa de corrupción son estimados — necesitan conectarse a fuentes reales

**✨ Mejoras prioritarias**
- [ ] **Base de datos de candidatos** — conectar a API o Google Sheets en tiempo real
- [ ] **Mapa SVG real** — usar GeoJSON oficial de Colombia (DANE)
- [ ] **Historial de contratos** — guardar búsquedas anteriores
- [ ] **Comparador de candidatos** — side-by-side entre candidatos
- [ ] **API de Procuraduría** — cruzar con sanciones disciplinarias
- [ ] **PWA** — convertir en app instalable para celular
- [ ] **Modo oscuro/claro** — toggle de tema
- [ ] **i18n** — soporte multiidioma (español, inglés, lenguas indígenas)
- [ ] **Tests** — agregar pruebas unitarias para las funciones API

**📊 Datos**
- [ ] Integrar API de la Fiscalía
- [ ] Integrar datos de la Contraloría General
- [ ] Cruzar con datos del CNE (financiación de campañas)
- [ ] Agregar datos históricos de corrupción por departamento

### Proceso de contribución

```bash
# 1. Fork del repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/vigilancol.git
cd vigilancol

# 3. Crear rama para tu mejora
git checkout -b feature/mi-mejora
# o para un bug:
git checkout -b fix/nombre-del-bug

# 4. Hacer cambios y commit
git add .
git commit -m "feat: agregar mapa con GeoJSON real de Colombia"

# 5. Push y Pull Request
git push origin feature/mi-mejora
# Luego abre un PR en GitHub
```

**Convención de commits:**
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `data:` actualización de datos
- `docs:` documentación
- `style:` cambios visuales/CSS
- `refactor:` refactorización de código

---

## 📊 Fuentes de Datos

Todas las fuentes son públicas y verificables:

| Fuente | Tipo | URL | Uso en VigilanCOL |
|--------|------|-----|-------------------|
| SECOP II | API pública | [datos.gov.co](https://www.datos.gov.co/resource/jbjy-vk9h.json) | Contratos públicos en tiempo real |
| Registraduría | Web oficial | [registraduria.gov.co](https://www.registraduria.gov.co) | Datos electorales |
| Fiscalía General | Web oficial | [fiscalia.gov.co](https://www.fiscalia.gov.co) | Investigaciones penales |
| Corte Suprema | Web oficial | [cortesuprema.gov.co](https://www.cortesuprema.gov.co) | Casos contra aforados |
| Procuraduría | Web oficial | [procuraduria.gov.co](https://www.procuraduria.gov.co) | Sanciones disciplinarias |
| Contraloría | Web oficial | [contraloria.gov.co](https://www.contraloria.gov.co) | Responsabilidad fiscal |
| El Colombiano | Medio verificado | [elcolombiano.com](https://www.elcolombiano.com) | Noticias verificadas |
| Infobae Colombia | Medio verificado | [infobae.com/colombia](https://www.infobae.com/colombia) | Noticias verificadas |
| La Silla Vacía | Medio verificado | [lasillavacia.com](https://www.lasillavacia.com) | Política colombiana |

---

## ⚖️ Aviso Legal

> **Presunción de inocencia:** Toda la información presentada en VigilanCOL proviene de fuentes públicas verificadas (Fiscalía, Corte Suprema, Procuraduría, medios de comunicación reconocidos). La mención de una persona en esta plataforma **no implica culpabilidad** — solo refleja lo que las autoridades y medios han reportado públicamente. En Colombia aplica la presunción de inocencia consagrada en el **Art. 29 de la Constitución Política**.
>
> **Libertad de información:** El acceso a información pública está garantizado por el **Art. 74 de la Constitución** y la **Ley 1712/2014 (Ley de Transparencia)**. VigilanCOL ejerce este derecho al compilar y presentar información de fuentes oficiales.
>
> **Sin fines comerciales ni partidistas:** VigilanCOL no pertenece ni apoya a ningún partido político, candidato o movimiento. Es una herramienta neutral de ciudadanía activa.

---

## 🛡️ Seguridad

¿Encontraste una vulnerabilidad? Lee [SECURITY.md](./SECURITY.md) o contacta directamente.

**Buenas prácticas implementadas:**
- Las API keys nunca van en el frontend
- El proxy backend sanitiza inputs contra SQL injection
- Sin almacenamiento de datos personales en el servidor
- CORS configurado correctamente

---

## 📜 Licencia

MIT License — ver [LICENSE](./LICENSE)

```
Copyright (c) 2026 VigilanCOL Contributors

Se permite el uso, copia, modificación y distribución de este software
libremente, siempre que se mantenga este aviso de copyright.
```

---

## 👥 Contribuidores

<table>
<tr>
<td align="center">
<b>Fundador</b><br>
<sub>Ciudadano colombiano que decidió actuar 🇨🇴</sub>
</td>
</tr>
</table>

¿Quieres aparecer aquí? [Contribuye al proyecto →](./CONTRIBUTING.md)

---

## 🙏 Agradecimientos

- [Registraduría Nacional](https://www.registraduria.gov.co) — por los datos electorales públicos
- [datos.gov.co](https://datos.gov.co) — por la API pública de contratación
- [Socrata](https://dev.socrata.com) — por la infraestructura de datos abiertos
- [Anthropic](https://anthropic.com) — por Claude AI
- [Vercel](https://vercel.com) — por el hosting gratuito
- Todos los periodistas colombianos que investigan la corrupción a pesar de los riesgos

---

<div align="center">

**Hecho con ❤️ por ciudadanos colombianos para ciudadanos colombianos**

*"La corrupción prospera en el silencio. VigilanCOL es el ruido."*

[⭐ Dale una estrella en GitHub](https://github.com/TU_USUARIO/vigilancol) para que más colombianos lo encuentren

[![Donar con PayPal](https://img.shields.io/badge/💙_Donar_con_PayPal-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/slimthick062026)

*Cada donación ayuda a mantener el servidor y seguir actualizando los datos* 🙏

</div>
