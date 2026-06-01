export function serializeGame(game) {
  return {
    ...game,
    completedAt: game.completedAt instanceof Date
      ? game.completedAt.toISOString()
      : (game.completedAt ?? null),
  };
}
