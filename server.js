const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const alertRoutes = require('./routes/alerts');
const prefRoutes = require('./routes/preferences');
const { fetchAndBroadcastNews } = require('./jobs/newsFetcher');
const { sendDigests } = require('./jobs/digestJob');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Health check (Render pings this)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/preferences', prefRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Make io accessible in controllers
app.set('io', io);

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('subscribe', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Cron jobs
// Fetch breaking news every 15 mins
cron.schedule('*/15 * * * *', () => {
  console.log('Running news fetch job...');
  fetchAndBroadcastNews(io);
});

// Send hourly digests at the top of every hour
cron.schedule('0 * * * *', () => {
  console.log('Running hourly digest job...');
  sendDigests('hourly', io);
});

// Send daily digests at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log('Running daily digest job...');
  sendDigests('daily', io);
});

// Connect DB then start
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});