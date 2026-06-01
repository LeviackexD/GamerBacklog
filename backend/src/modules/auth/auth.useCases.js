// ============================================================
// AuthUseCases — Lógica de negocio de autenticación
// ============================================================
// Capa intermedia entre el controlador (HTTP) y el servicio (BD).
// Aquí se aplican las reglas: verificar email duplicado, hashear
// contraseñas con argon2, firmar JWT, calcular estadísticas.
// Los errores se lanzan como clases AppError para que el
// middleware error.middleware.js los capture y responda con el
// código HTTP correcto.

import crypto from 'node:crypto';
import argon2 from 'argon2';
import { AuthService } from './auth.service.js';
import { signToken } from '../../utils/jwt.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../lib/errors.js';
import { sendEmail } from '../../email/sendEmail.js';
import { env } from '../../config/env.js';

const authService = new AuthService();

export class AuthUseCases {
  // Crea un usuario nuevo. Si el email ya existe, lanza 409.
  // La contraseña llega en texto plano y se hashea con argon2.
  async register(input) {
    const existing = await authService.findByEmail(input.email);

    if (existing) {
      throw new ConflictError('El email ya está registrado');
    }

    const hashedPassword = await argon2.hash(input.password);

    const user = await authService.createUser({
      email: input.email,
      password: hashedPassword,
      alias: input.alias,
    });

    // Auto-login: devolvemos token directamente tras registrar
    const token = signToken({ id: user.id, email: user.email, alias: user.alias });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        alias: user.alias,
      },
    };
  }

  // Verifica email + password. Errores genéricos "Credenciales
  // incorrectas" para no revelar si el email existe o no.
  async login(input) {
    const user = await authService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

    const validPassword = await argon2.verify(user.password, input.password);

    if (!validPassword) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

    const token = signToken({ id: user.id, email: user.email, alias: user.alias });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        alias: user.alias,
      },
    };
  }

  async getProfile(userId) {
    const user = await authService.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      alias: user.alias,
      createdAt: user.createdAt.toISOString(),
    };
  }

  // Estadísticas con estilo RPG: nivel (cada 3 juegos completados
  // subes de nivel), clase según categoría favorita, % de
  // completitud, horas totales, desglose por categoría.
  async getStats(userId) {
    const user = await authService.findById(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    const games = await authService.getUserGames(userId);

    const totalGames = games.length;
    const completedGames = games.filter(g => g.completed).length;

    const totalHours = games.reduce((sum, g) => sum + g.hoursToBeat, 0);

    const ratedGames = games.filter(g => g.rating);
    const averageRating = ratedGames.length
      ? Number((ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length).toFixed(1))
      : 0;

    const completionRate = totalGames
      ? Number(((completedGames / totalGames) * 100).toFixed(1))
      : 0;

    const level = Math.floor(completedGames / 3) + 1;
    const xpPercent = totalGames
      ? Math.round(((completedGames % 3) / 3) * 100)
      : 0;

    // Categoría más jugada → define la clase del usuario
    const categoryCounts = {};
    games.forEach(g => {
      categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
    });
    const entries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const topCategory = entries[0]?.[0] || 'Novato';

    const classMap = {
      'RPG': 'RPG Main',
      'Shooter': 'Shooter Elite',
      'Aventura': 'Aventurero',
      'Indie': 'Indie Devotee',
      'Puzle': 'Puzzle Master',
      'Plataformas': 'Platform King',
      'Metroidvania': 'Explorer',
    };
    const classTitle = classMap[topCategory] || `${topCategory} Expert`;

    const recentCompleted = games
      .filter(g => g.completed)
      .slice(0, 3)
      .map(g => ({
        name: g.name,
        rating: g.rating,
        hoursToBeat: g.hoursToBeat,
      }));

    const categoryBreakdown = entries.map(([category, count]) => ({
      category,
      count,
      percent: Number(((count / totalGames) * 100).toFixed(0)),
    }));

    return {
      user: { id: user.id, email: user.email, alias: user.alias },
      stats: {
        totalGames,
        completedGames,
        totalHours,
        averageRating,
        completionRate,
        level,
        xpPercent,
        classTitle,
        topCategory,
        recentCompleted,
        categoryBreakdown,
      },
    };
  }

  // Genera un token de 32 bytes para reset de contraseña,
  // expira en 1 hora. Siempre devuelve el mismo mensaje para
  // evitar que un atacante pueda enumerar emails registrados.
  async forgotPassword(input) {
    const user = await authService.findByEmail(input.email);

    if (user) {
      await authService.invalidateOldTokens(user.id);

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await authService.createPasswordResetToken({ token, userId: user.id, expiresAt });

      const resetLink = `${env.appUrl}/restablecer-password?token=${token}`;

      await sendEmail(input.email, resetLink);
    }

    return { message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' };
  }

  // Valida token, verifica que no esté usado ni expirado,
  // hashea la nueva contraseña y la guarda.
  async resetPassword(input) {
    const record = await authService.findPasswordResetToken(input.token);

    if (!record || record.used || record.expiresAt < new Date()) {
      throw new UnauthorizedError('Token inválido o expirado');
    }

    const user = await authService.findById(record.userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const hashedPassword = await argon2.hash(input.password);
    await authService.updatePassword(user.id, hashedPassword);
    await authService.markTokenAsUsed(record.id);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
