const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const gameRoutes = require('./routes/game');
const comfyuiRoutes = require('./routes/comfyui');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - IMPORTANT!
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json({ limit: '50mb' }));

// Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/game', gameRoutes);
app.use('/api/comfyui', comfyuiRoutes);

// Test endpoint to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🎲 Ready for D&D adventures!`);
});