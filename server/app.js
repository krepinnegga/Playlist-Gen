import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://playlist-gen-liart.vercel.app',
  'http://localhost:5173',
  'http://172.20.10.2:5173',
];

// Apply CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Special case for local development
      if (process.env.NODE_ENV === 'development') {
        const isLocalhost =
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:');
        if (isLocalhost) {
          return callback(null, true);
        }
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// Handle preflight requests
app.options('*', cors());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
