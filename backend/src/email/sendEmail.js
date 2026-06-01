import { Resend } from 'resend';
import { env } from '../config/env.js';

let resend;

function getClient() {
  if (!resend && env.resendApiKey) {
    resend = new Resend(env.resendApiKey);
  }
  return resend;
}

export async function sendEmail(to, resetLink) {
  const client = getClient();

  if (!client) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 RESEND NO CONFIGURADO');
    console.log('   Enlace de recuperación:');
    console.log(`   ${resetLink}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }

  await client.emails.send({
    from: 'Gamer Backlog <onboarding@resend.dev>',
    to,
    subject: 'Restablece tu contraseña en Gamer Backlog',
    html: `
      <div style="background:#0a0a0a;color:#e0e0e0;font-family:monospace;padding:40px;max-width:480px;margin:0 auto;">
        <div style="border:2px solid #00e5ff;padding:32px;">
          <h1 style="color:#00e5ff;font-size:18px;margin:0 0 16px 0;">
            &lt;GB/&gt; RESTABLECER CONTRASEÑA
          </h1>
          <p style="font-size:16px;line-height:1.5;margin:0 0 24px 0;color:#e0e0e0;">
            Has solicitado restablecer tu contraseña de <strong>Gamer Backlog</strong>.
            El enlace expira en <strong style="color:#ffd700;">1 hora</strong>.
          </p>
          <a href="${resetLink}"
             style="display:inline-block;background:#00e5ff;color:#0a0a0a;
                    padding:14px 28px;text-decoration:none;font-weight:bold;
                    font-size:14px;border:2px solid #00e5ff;">
            RESTABLECER CONTRASEÑA
          </a>
          <p style="margin-top:24px;color:#666;font-size:14px;border-top:1px solid #333;padding-top:16px;">
            Si no solicitaste este cambio, ignora este mensaje.
          </p>
        </div>
      </div>
    `,
  });
}
