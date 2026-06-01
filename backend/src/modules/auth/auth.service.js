import { prisma } from '../../config/prisma.js';

export class AuthService {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data) {
    return prisma.user.create({ data });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserGames(userId) {
    return prisma.game.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  async createPasswordResetToken(data) {
    return prisma.passwordResetToken.create({ data });
  }

  async findPasswordResetToken(token) {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  }

  async markTokenAsUsed(id) {
    return prisma.passwordResetToken.update({ where: { id }, data: { used: true } });
  }

  async invalidateOldTokens(userId) {
    return prisma.passwordResetToken.updateMany({
      where: { userId, used: false },
      data: { used: true },
    });
  }

  async updatePassword(userId, hashedPassword) {
    return prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  }
}
