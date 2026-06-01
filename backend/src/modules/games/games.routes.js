import { Router } from 'express';
import { gamesController } from './games.controller.js';
import { RawgService } from '../../services/rawg.service.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const rawgService = new RawgService();

export const gamesRouter = Router();

gamesRouter.get('/cover', async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      return res.json({ success: true, data: null });
    }
    const url = await rawgService.searchGameCover(name);
    res.json({ success: true, data: url });
  } catch (error) {
    next(error);
  }
});

gamesRouter.use(authMiddleware);

gamesRouter.get('/', gamesController.listGames);
gamesRouter.get('/:id', gamesController.getGame);
gamesRouter.post('/', gamesController.createGame);
gamesRouter.put('/:id', gamesController.updateGame);
gamesRouter.delete('/:id', gamesController.deleteGame);
gamesRouter.patch('/:id/complete', gamesController.completeGame);
gamesRouter.patch('/:id/uncomplete', gamesController.uncompleteGame);
