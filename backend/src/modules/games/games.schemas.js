import { z } from 'zod';

export const createGameSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  tags: z.string().min(1, 'Añade al menos una etiqueta'),
  metacriticScore: z.coerce.number().int().min(0).max(100),
  hoursToBeat: z.coerce.number().positive(),
  completed: z.boolean().optional().default(false),
  notes: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});

const updateFields = { ...createGameSchema.shape };
delete updateFields.completed;
export const updateGameSchema = z.object(updateFields).partial();

export const completeGameSchema = z.object({
  notes: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});

export const listGamesQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  completed: z.enum(['true', 'false']).optional(),
  sortBy: z
    .enum(['priorityScore', 'metacriticScore', 'hoursToBeat', 'name'])
    .optional()
    .default('priorityScore'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});
