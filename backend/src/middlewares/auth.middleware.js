// ============================================================
// authMiddleware — Protege rutas con JWT
// ============================================================
// Extrae el token del header Authorization: Bearer <token>,
// lo verifica con verifyToken() y mete los datos decodificados
// en req.user para que los controladores los usen.

import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido',
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};
