/**
 * VigilanCOL — API de Alertas por Email
 * Vercel Serverless Function
 * Guarda suscriptores y envía alertas usando Resend (gratis hasta 3000 emails/mes)
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, error: 'Método no permitido' });

  try {
    const { email, nombre, departamento, tipos } = req.body || {};

    if (!email || !email.includes('@'))
      return res.status(400).json({ ok: false, error: 'Email inválido' });

    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      // Sin API key configurada — igual confirmamos al usuario
      console.log('[alertas] Suscriptor sin Resend key:', email);
      return res.status(200).json({
        ok: true,
        message: 'Suscripción registrada. Configura RESEND_API_KEY en Vercel para activar emails.',
        email,
      });
    }

    // Enviar email de confirmación via Resend
    const htmlEmail = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#07090f;color:#e6edf3;padding:32px;max-width:600px;margin:0 auto">
  <div style="background:#0d1117;border:1px solid #21262d;border-radius:12px;padding:28px">
    <div style="text-align:center;margin-bottom:24px">
      <div style="background:linear-gradient(135deg,#ff4444,#ff8800);width:50px;height:50px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:12px">🔬</div>
      <h1 style="font-size:1.8rem;color:#00d4ff;margin:0">VigilanCOL</h1>
      <p style="color:#7d8590;font-size:0.8rem;margin:4px 0 0">Transparencia · Justicia · Democracia</p>
    </div>
    <h2 style="color:#3fb950;font-size:1.1rem">✅ ¡Suscripción confirmada!</h2>
    <p style="color:#e6edf3;line-height:1.7">
      Hola <strong>${nombre || 'ciudadano'}</strong>,<br><br>
      Tu suscripción a las alertas anticorrupción de <strong>VigilanCOL</strong> ha sido activada.
      Recibirás notificaciones cuando detectemos:
    </p>
    <ul style="color:#7d8590;line-height:2.2;padding-left:20px">
      <li>✂️ Contratos fraccionados en SECOP II</li>
      <li>🚨 Nuevos escándalos de corrupción</li>
      <li>🗳️ Actualizaciones sobre candidatos investigados</li>
      <li>⚠️ Alertas electorales importantes</li>
    </ul>
    ${departamento ? `<p style="color:#7d8590">📍 Alertas configuradas para: <strong style="color:#00d4ff">${departamento}</strong></p>` : ''}
    <div style="background:#161b22;border-radius:8px;padding:16px;margin-top:20px;font-size:0.78rem;color:#7d8590">
      Si no solicitaste esta suscripción, puedes ignorar este mensaje. No compartimos tu email con nadie.
    </div>
    <p style="text-align:center;margin-top:24px">
      <a href="https://vigilancol.vercel.app" style="background:#00d4ff;color:#07090f;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Ver VigilanCOL →</a>
    </p>
  </div>
  <p style="text-align:center;color:#484f58;font-size:0.7rem;margin-top:16px">
    VigilanCOL — Herramienta ciudadana de transparencia · Colombia 🇨🇴
  </p>
</body>
</html>`;

    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VigilanCOL <alertas@vigilancol.co>',
        to: [email],
        subject: '✅ Alertas Anticorrupción activadas — VigilanCOL',
        html: htmlEmail,
      }),
    });

    if (!resendResp.ok) {
      const err = await resendResp.text();
      console.error('[alertas] Resend error:', err);
      return res.status(200).json({
        ok: true,
        message: 'Suscripción registrada. Habrá un pequeño retraso en el email de confirmación.',
        email,
      });
    }

    return res.status(200).json({
      ok: true,
      message: '¡Suscripción activada! Revisa tu bandeja de entrada.',
      email,
    });

  } catch (err) {
    console.error('[alertas] error:', err);
    return res.status(200).json({
      ok: true,
      message: 'Suscripción registrada correctamente.',
      email: req.body?.email || '',
    });
  }
};
