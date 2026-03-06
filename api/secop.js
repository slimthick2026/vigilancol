/**
 * VigilanCOL — Proxy SECOP II
 * Vercel Serverless Function (CommonJS)
 * Usa $q para full-text search (evita errores 400 con LIKE en SoQL)
 */

const SECOP_BASE = 'https://www.datos.gov.co/resource/jbjy-vk9h.json';
const APP_TOKEN  = process.env.SOCRATA_TOKEN || '';

module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')
    return res.status(405).json({ ok: false, error: 'Metodo no permitido' });

  try {
    const q      = (req.query.q      || '').trim();
    const depto  = (req.query.depto  || '').trim();
    const limit  = Math.min(parseInt(req.query.limit)  || 50,  200);
    const offset = Math.max(parseInt(req.query.offset) || 0,   0);

    const params = new URLSearchParams();
    params.set('$limit',  String(limit));
    params.set('$offset', String(offset));
    params.set('$order',  'fecha_de_firma DESC');

    // $q = full-text search de Socrata (funciona sin errores 400)
    if (q) params.set('$q', q);

    // Filtro de departamento solo si se especifica
    if (depto) {
      const d = depto.toUpperCase().replace(/'/g, "''");
      params.set('$where', `upper(departamento_entidad) like '%${d}%'`);
    }

    if (APP_TOKEN) params.set('$$app_token', APP_TOKEN);

    const url = `${SECOP_BASE}?${params.toString()}`;
    console.log('[secop] GET', url);

    const upstream = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    const body = await upstream.text();

    if (!upstream.ok) {
      console.error('[secop] upstream error', upstream.status, body.slice(0, 300));
      return res.status(200).json({
        ok:     false,
        error:  `SECOP II respondio HTTP ${upstream.status}`,
        detail: body.slice(0, 300),
      });
    }

    const data = JSON.parse(body);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      ok:        true,
      total:     data.length,
      offset:    offset,
      data:      data,
      source:    'SECOP II — datos.gov.co',
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[secop] catch', err);
    return res.status(200).json({
      ok:     false,
      error:  'Error en el proxy: ' + err.message,
      detail: String(err),
    });
  }
};
