import { env } from '../config/env.js';

const RAWG_BASE = 'https://api.rawg.io/api';

export class RawgService {
  async searchGameCover(gameName) {
    if (!env.rawgApiKey) return null;

    try {
      const res = await fetch(
        `${RAWG_BASE}/games?key=${env.rawgApiKey}&search=${encodeURIComponent(gameName)}&page_size=1`
      );

      if (!res.ok) return null;

      const data = await res.json();
      const game = data.results?.[0];
      return game?.background_image || null;
    } catch {
      return null;
    }
  }
}
