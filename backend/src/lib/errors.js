// ============================================================
// Clases de error personalizadas
// ============================================================
// Todas heredan de AppError que añade un status HTTP.
// El middleware error.middleware.js captura estos errores y
// responde con el código correcto (404, 401, 409, etc.).

export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto') {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}
