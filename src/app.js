const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandling');
const  swaggerDocs  = require('./config/swaggerConfig');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parser
app.use(express.json());


// Routes
app.use('/api/tasks', taskRoutes);

// Swagger documentation
swaggerDocs(app, process.env.PORT);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found'
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;