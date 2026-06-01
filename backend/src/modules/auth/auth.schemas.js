import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  alias: z.string().min(2, 'El alias debe tener al menos 2 caracteres').max(30),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  passwordRepeat: z.string().min(8, 'Repite la contraseña'),
}).refine(data => data.password === data.passwordRepeat, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordRepeat'],
});
