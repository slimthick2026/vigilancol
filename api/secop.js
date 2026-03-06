/**
 * VigilanCOL — Proxy SECOP II
 * Vercel Serverless Function
 * Resuelve el problema de CORS llamando a datos.gov.co desde el servidor.
 * Endpoint: /api/secop?q=ministerio&depto=BOGOTÁ&limit=50&offset=0
 */

const SECOP_BASE = 'https://www.datos.gov.co/resource/jbjy-vk9h.json';

// Token de app de Socrata (opcional pero recomendado para más requests/hora)
// Obtén uno gratis en: https://data.socrata.com/profile/edit/developer_settings
const APP_TOKEN = process.env.SOCRATA_TOKEN || '';

module.exports = async function handler(req, res) {
  // ── CORS: permitir cualquier origen ──────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // ── Leer parámetros del frontend ──────────────────────────────────────
    const {
      q       = '',
      depto   = '',
      limit   = '50',
      offset  = '0',
      order   = 'fecha_de_firma DESC',
    } = req.query;

    // ── Construir query SoQL ──────────────────────────────────────────────
    const conditions = [];

    if (q && q.trim()) {
      const safe = q.toUpperCase().replace(/'/g, "''"); // evitar SQL injection
      conditions.push(
        `(upper(nombre_entidad) like '%${safe}%'` +
        ` OR upper(descripcion_del_proceso) like '%${safe}%'` +
        ` OR upper(proveedor_adjudicado) like '%${safe}%'` +
        ` OR upper(nit_del_proveedor) like '%${safe}%')`
      );
    }

    if (depto && depto.trim()) {
      const safeDep = depto.toUpperCase().replace(/'/g, "''");
      conditions.push(`upper(departamento_entidad) like '%${safeDep}%'`);
    }

    const params = new URLSearchParams({
      '$limit':  String(Math.min(parseInt(limit) || 50, 200)), // máx 200
      '$offset': String(Math.max(parseInt(offset) || 0, 0)),
      '$order':  order,
    });

    if (conditions.length > 0) {
      params.set('$where', conditions.join(' AND '));
    }

    if (APP_TOKEN) {
      params.set('$$app_token', APP_TOKEN);
    }

    const url = `${SECOP_BASE}?${params.toString()}`;

    // ── Llamar a datos.gov.co ─────────────────────────────────────────────
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-App-Token': APP_TOKEN || '',
      },
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('SECOP API error:', response.status, errText);
      return res.status(response.status).json({
        error: `Error de SECOP II: HTTP ${response.status}`,
        detail: errText.slice(0, 200),
      });
    }

    const data = await response.json();

    // ── Responder al frontend ─────────────────────────────────────────────
    // Cache de 5 minutos (los datos de SECOP no cambian tan rápido)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      ok: true,
      total: data.length,
      offset: parseInt(offset),
      data,
      source: 'SECOP II — datos.gov.co',
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Proxy error:', err);

    if (err.name === 'TimeoutError') {
      return res.status(504).json({
        error: 'Tiempo de espera agotado al consultar SECOP II',
        detail: 'El servidor de datos.gov.co tardó demasiado en responder.',
      });
    }

    return res.status(500).json({
      error: 'Error interno del proxy',
      detail: err.message,
    });
  }
}
