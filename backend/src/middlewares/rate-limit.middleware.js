import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiadas solicitudes, inténtalo de nuevo en un minuto' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,
  message: { success: false, message: 'Demasiadas solicitudes, por favor intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});
