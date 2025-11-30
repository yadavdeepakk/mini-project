require('dotenv').config();
console.log('JWT_SECRET present?', !!process.env.JWT_SECRET);
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.use(cors());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// MongoDB Connection
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('YOUR_MONGODB_CONNECTION_STRING')) {
    // Use provided connection string
    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected (from MONGODB_URI)');
      return;
    } catch (err) {
      console.error('MongoDB connection error (MONGODB_URI):', err);
      // Fallthrough to memory server
    }
  }

  // Fallback: start an in-memory MongoDB for local development / testing
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log('MongoDB connected (in-memory fallback)');

    // Ensure mongod stops when process exits
    const cleanup = async () => {
      try {
        await mongoose.disconnect();
        await mongod.stop();
      } catch (e) {
        console.error('Error stopping in-memory mongo', e);
      }
      process.exit();
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (err) {
    console.error('Failed to start in-memory MongoDB fallback:', err);
  }
}

connectDB();

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const familyRoutes = require('./routes/familyRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api', medicationRoutes); // Medication routes are prefixed with /api/patients/:id/medications
app.use('/api/reminders', reminderRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/affiliate', affiliateRoutes);

// Serve static uploaded images
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('MediScan Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
