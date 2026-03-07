/**
 * VigilanCOL — IA Actualizador de Candidatos
 * Vercel Serverless Function
 * Usa Claude API para analizar noticias recientes y sugerir actualizaciones
 * GET /api/actualizar-candidatos
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const CLAUDE_KEY = process.env.ANTHROPIC_API_KEY;
  if (!CLAUDE_KEY) {
    return res.status(200).json({
      ok: false,
      error: 'ANTHROPIC_API_KEY no configurada',
      instrucciones: 'Ve a Vercel → Settings → Environment Variables → agrega ANTHROPIC_API_KEY',
    });
  }

  try {
    // Primero buscamos noticias recientes de corrupción en Colombia
    const newsQuery = encodeURIComponent('candidatos Colombia 2026 corrupción investigación judicial congreso');
    
    // Llamar a Claude para analizar y generar actualizaciones
    const prompt = `Eres un analista anticorrupción experto en Colombia. 
    
Basándote en tu conocimiento actualizado sobre las elecciones Colombia 2026, genera una lista JSON de candidatos al Congreso (Senado y Cámara) que tengan investigaciones judiciales, disciplinarias o penales activas, o cuestionamientos documentados por medios confiables.

Para cada candidato incluye:
- nombre: string
- aspiracion: "Senado" | "Cámara" | "Presidencia"  
- partido: string
- cargo: string (cargo actual si lo tiene)
- proceso: string (descripción clara del cuestionamiento, máx 200 chars)
- entidad: string (Fiscalía, Corte Suprema, Procuraduría, etc.)
- riesgo: "critico" | "alto" | "medio" | "bajo"
- fuente: string (URL de fuente verificada)
- fuenteLabel: string (nombre corto de la fuente)
- fechaActualizacion: string (fecha aprox del último hecho)

IMPORTANTE:
- Solo incluye casos con FUENTES VERIFICABLES (El Colombiano, Infobae, CNN, La Silla Vacía, Fiscalía, Corte Suprema)
- Aplica presunción de inocencia — indica claramente si es investigación, indagación o llamado a juicio
- Máximo 20 candidatos, priorizando los de mayor riesgo
- Responde SOLO con JSON válido, sin texto adicional, sin markdown

Formato exacto:
{"ok":true,"actualizado":"2026-03-06","total":N,"candidatos":[...]}`;

    const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeResp.ok) {
      const err = await claudeResp.text();
      return res.status(200).json({ ok: false, error: 'Error al consultar IA: ' + err.slice(0, 200) });
    }

    const claudeData = await claudeResp.json();
    const rawText = claudeData.content?.[0]?.text || '{}';
    
    // Limpiar posible markdown
    const clean = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    // Cache 6 horas (no necesitamos actualizar más seguido)
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=3600');

    return res.status(200).json({
      ...parsed,
      generadoPor: 'Claude Sonnet (Anthropic)',
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[actualizar-candidatos]', err);
    return res.status(200).json({
      ok: false,
      error: 'Error al generar actualización: ' + err.message,
    });
  }
};
