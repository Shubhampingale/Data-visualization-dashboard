// backend/server.js

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb://127.0.0.1:27017/data-visualization'; // Replace with your MongoDB connection URL

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

// Event listeners for MongoDB connection
connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

