// ============================================================
// env — Variables de entorno validadas
// ============================================================
// Carga .env con dotenv y exporta las vars en un objeto.
// requireEnv() lanza error si una variable obligatoria falta.
// En producción, CORS_ORIGIN es obligatorio por seguridad.

import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const rawCorsOrigin = process.env.CORS_ORIGIN;
if (process.env.NODE_ENV === 'production' && !rawCorsOrigin) {
  throw new Error('CORS_ORIGIN is required in production');
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: rawCorsOrigin ?? '*',
  resendApiKey: process.env.RESEND_API_KEY,
  rawgApiKey: process.env.RAWG_API_KEY,
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
};
