# API Specification — Gamer Backlog API

## Base URL
```
http://localhost:4000/api
```
Via Nuxt proxy: `http://localhost:3000/api`

## Response format

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "name", "message": "El nombre es obligatorio" }
  ]
}
```

---

## Endpoints

### Health check

`GET /api/health`

**Response:**
```json
{
  "success": true,
  "data": { "status": "ok" }
}
```

---

### Register

`POST /api/auth/register`

**Rate limited.** **Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| email | string | sí | Email del usuario |
| password | string | sí | Mínimo 8 caracteres |
| alias | string | sí | Nombre visible (2-30 caracteres) |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "jwt...",
    "user": { "id": 1, "email": "user@test.com", "alias": "Player1" }
  }
}
```

---

### Login

`POST /api/auth/login`

**Rate limited.** **Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| email | string | sí | Email del usuario |
| password | string | sí | Contraseña |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt...",
    "user": { "id": 1, "email": "user@test.com", "alias": "Player1" }
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Email o contraseña incorrectos"
}
```

---

### Get current user

`GET /api/auth/me`

**Auth required.** **Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@test.com",
    "alias": "Player1",
    "createdAt": "2026-05-28T16:00:00.000Z"
  }
}
```

---

### Get user stats

`GET /api/auth/stats`

**Auth required.** **Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "user@test.com", "alias": "Player1" },
    "stats": {
      "totalGames": 10,
      "completedGames": 3,
      "totalHours": 120,
      "averageRating": 4.2,
      "completionRate": 30,
      "level": 1,
      "xpPercent": 0,
      "classTitle": "Novato",
      "recentCompleted": [
        { "name": "Zelda", "rating": 5, "hoursToBeat": 55 }
      ],
      "categoryBreakdown": [
        { "category": "RPG", "count": 4, "percent": 40 }
      ]
    }
  }
}
```

---

### Forgot password

`POST /api/auth/forgot-password`

**Rate limited.** **Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| email | string | sí | Email del usuario |

Siempre devuelve el mismo mensaje (exista o no el email). Si el email existe,
genera un token de 32 bytes, lo almacena en `PasswordResetToken` con expiración
de 1 hora, y envía un email con el enlace vía Resend.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Si el email existe, recibirás un enlace para restablecer tu contraseña"
  }
}
```

---

### Reset password

`POST /api/auth/reset-password`

**Rate limited.** **Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| token | string | sí | Token recibido por email |
| password | string | sí | Nueva contraseña (mínimo 8 caracteres) |
| passwordRepeat | string | sí | Debe coincidir con password |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Contraseña actualizada correctamente"
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

### Create game

`POST /api/games`

**Auth required.** **Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| name | string | sí | Nombre del juego |
| category | string | sí | Categoría (ej: Aventura, RPG, Shooter) |
| tags | string | sí | Etiquetas separadas por comas |
| metacriticScore | number (0-100) | sí | Puntuación Metacritic |
| hoursToBeat | number (>0) | sí | Horas estimadas para completarlo |
| completed | boolean | no (default: false) | Completado o no |
| notes | string | no | Notas adicionales |
| rating | number (1-5) | no | Valoración personal |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "The Legend of Zelda",
    "category": "Aventura",
    "tags": "accion,aventura",
    "metacriticScore": 97,
    "hoursToBeat": 55,
    "completed": false,
    "completedAt": null,
    "notes": null,
    "rating": null,
    "priorityScore": 1.76,
    "createdAt": "2026-05-28T16:15:40.582Z",
    "updatedAt": "2026-05-28T16:15:40.582Z"
  }
}
```

---

### List games

`GET /api/games`

**Auth required.** **Query params (todos opcionales):**
| Parámetro | Valores | Descripción |
|-----------|---------|-------------|
| search | string | Búsqueda parcial por nombre |
| category | string | Filtro por categoría exacta |
| tag | string | Búsqueda parcial en tags |
| completed | `true` / `false` | Filtrar por estado de completado |
| sortBy | `priorityScore`, `metacriticScore`, `hoursToBeat`, `name` | Campo de ordenación (default: priorityScore) |
| order | `asc`, `desc` | Dirección de ordenación (default: desc) |

**Response (200):**
```json
{
  "success": true,
  "data": [ { ... juego ... } ]
}
```

---

### Get game by ID

`GET /api/games/:id`

**Auth required.** **Response (200):** Game object
**Response (404):**
```json
{ "success": false, "message": "Juego no encontrado" }
```

---

### Update game

`PUT /api/games/:id`

**Auth required.** **Body:** Mismos campos que create, todos opcionales. Si se envían `metacriticScore` o `hoursToBeat`, se recalcula `priorityScore`.

**Response (200):** Game object actualizado

---

### Delete game

`DELETE /api/games/:id`

**Auth required.** **Response (200):**
```json
{
  "success": true,
  "data": { "message": "Juego eliminado correctamente" }
}
```

---

### Complete game

`PATCH /api/games/:id/complete`

**Auth required.** **Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| notes | string | no | Notas al completar |
| rating | number (1-5) | no | Valoración personal |

Establece `completed: true` y `completedAt` con la fecha actual automáticamente.

---

### Uncomplete game

`PATCH /api/games/:id/uncomplete`

**Auth required.** Revierte `completed: false`, limpia `completedAt`, `notes`, `rating`.

**Response (200):** Game object restaurado
