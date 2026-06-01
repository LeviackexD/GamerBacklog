// ============================================================
// errorMiddleware — Manejador global de errores
// ============================================================
// Express llama a este middleware cuando un controlador lanza
// una excepción (next(err)). Según el tipo de error, responde
// con el código HTTP adecuado y un mensaje claro.
// - ZodError → 400 con detalle de cada campo inválido
// - AppError (ConflictError, NotFoundError, UnauthorizedError) → su status
// - Cualquier otro → 500 genérico

import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

export const errorMiddleware = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
};
