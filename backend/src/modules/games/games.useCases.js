// ============================================================
// GamesUseCases — Lógica de negocio de juegos
// ============================================================
// CRUD completo con verificación de ownership: cada operación
// busca el juego filtrando por id + userId para asegurar que
// un usuario solo vea/edite/elimine sus propios juegos.
// El priorityScore se recalcula automáticamente al crear o
// actualizar usando: metacriticScore / hoursToBeat.

import { GamesService } from './games.service.js';
import { calculatePriorityScore } from '../../utils/priority.js';
import { serializeGame } from '../../utils/game.js';
import { NotFoundError } from '../../lib/errors.js';

const gamesService = new GamesService();

export class GamesUseCases {
  // Lista juegos del usuario con filtros: búsqueda por nombre,
  // categoría, etiqueta, estado (completado/pendiente).
  async listGames(filters, userId) {
    const where = { userId };

    if (filters.search) {
      where.name = { contains: filters.search };
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.tag) {
      where.tags = { contains: filters.tag };
    }

    if (filters.completed !== undefined) {
      where.completed = filters.completed === 'true';
    }

    const orderBy = {};
    const sortBy = filters.sortBy || 'priorityScore';
    const order = filters.order || 'desc';
    orderBy[sortBy] = order;

    const games = await gamesService.findMany(where, orderBy);

    return games.map(serializeGame);
  }

  async getGameById(id, userId) {
    const game = await gamesService.findFirst({ id, userId });

    if (!game) {
      throw new NotFoundError('Juego no encontrado');
    }

    return serializeGame(game);
  }

  // Crea juego con prioridad calculada automáticamente
  async createGame(input, userId) {
    const priorityScore = calculatePriorityScore(input.metacriticScore, input.hoursToBeat);

    const game = await gamesService.create({
      ...input,
      userId,
      priorityScore,
    });

    return serializeGame(game);
  }

  // Actualiza juego. Si cambiaron nota u horas, recalcula prioridad.
  // Si no se enviaron, usa los valores existentes.
  async updateGame(id, input, userId) {
    const existing = await gamesService.findFirst({ id, userId });

    if (!existing) {
      throw new NotFoundError('Juego no encontrado');
    }

    const metacriticScore = input.metacriticScore ?? existing.metacriticScore;
    const hoursToBeat = input.hoursToBeat ?? existing.hoursToBeat;
    const priorityScore = calculatePriorityScore(metacriticScore, hoursToBeat);

    const game = await gamesService.update(id, userId, {
      ...input,
      priorityScore,
    });

    return serializeGame(game);
  }

  async deleteGame(id, userId) {
    const existing = await gamesService.findFirst({ id, userId });

    if (!existing) {
      throw new NotFoundError('Juego no encontrado');
    }

    await gamesService.delete(id, userId);

    return { message: 'Juego eliminado correctamente' };
  }

  // Marca juego como completado con fecha actual + rating/notas
  // opcionales. El frontend muestra el sello de "completado"
  // cuando completedAt tiene valor.
  async completeGame(id, data, userId) {
    const existing = await gamesService.findFirst({ id, userId });

    if (!existing) {
      throw new NotFoundError('Juego no encontrado');
    }

    const game = await gamesService.update(id, userId, {
      completed: true,
      completedAt: new Date(),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.rating !== undefined && { rating: data.rating }),
    });

    return serializeGame(game);
  }

  // Desmarca completado: borra fecha, notas y rating
  async uncompleteGame(id, userId) {
    const existing = await gamesService.findFirst({ id, userId });

    if (!existing) {
      throw new NotFoundError('Juego no encontrado');
    }

    const game = await gamesService.update(id, userId, {
      completed: false,
      completedAt: null,
      notes: null,
      rating: null,
    });

    return serializeGame(game);
  }
}
