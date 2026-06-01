import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import { router } from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { globalLimiter } from './middlewares/rate-limit.middleware.js';
import { env } from './config/env.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const openapiSpec = JSON.parse(
  readFileSync(join(__dirname, '../docs/openapi-spec.json'), 'utf8'),
);

export const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(env.nodeEnv === 'development' ? morgan('dev') : morgan('combined'));
app.use(globalLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use('/api', router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
