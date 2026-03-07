# 🛡️ Política de Seguridad — VigilanCOL

## Reportar una vulnerabilidad

Si descubres una vulnerabilidad de seguridad en VigilanCOL, **no la publiques en un Issue público**. Esto podría poner en riesgo a los usuarios.

Reporta de forma privada:
1. Abre un **Security Advisory** en GitHub: `Security → Advisories → Report a vulnerability`
2. O envía un email a: `seguridad@vigilancol.co` (si está configurado)

Responderemos en menos de 72 horas.

## Alcance

| En alcance | Fuera de alcance |
|------------|------------------|
| Exposición de API keys en el frontend | Ataques de fuerza bruta a APIs externas |
| Inyección de código en las funciones API | Vulnerabilidades en datos.gov.co |
| XSS en la interfaz de usuario | Problemas en servicios de terceros |
| Exposición de datos de suscriptores | Ingeniería social |

## Buenas prácticas implementadas

- Las API keys se almacenan solo como variables de entorno en Vercel (nunca en el código)
- El proxy SECOP sanitiza inputs para prevenir inyección
- No se almacenan datos personales en base de datos propia
- Sin autenticación de usuarios — no hay sesiones que comprometer
- HTTPS forzado por Vercel en producción

## Aviso a investigadores de seguridad

Si eres investigador de seguridad, bienvenido a auditar este código. Es un proyecto de código abierto y la transparencia también aplica a nuestra seguridad. Si encuentras algo, lo apreciamos y lo publicaremos junto con el fix y el crédito a quien lo encontró.
