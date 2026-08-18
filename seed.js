require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const Station = require('./models/Station');
const { Admin } = require('./services/authService');
const mongoose = require('mongoose');

const STATIONS = [
  // Red line
  { name: 'Central', line: 'Red', order: 1, code: 'R1', lat: 40.7128, lng: -74.006 },
  { name: 'Union', line: 'Red', order: 2, code: 'R2', lat: 40.735, lng: -73.99 },
  { name: 'Harbor', line: 'Red', order: 3, code: 'R3', lat: 40.75, lng: -73.98 },
  { name: 'Summit', line: 'Red', order: 4, code: 'R4', lat: 40.77, lng: -73.97 },
  // Blue line
  { name: 'Riverside', line: 'Blue', order: 1, code: 'B1', lat: 40.71, lng: -74.02 },
  { name: 'Market', line: 'Blue', order: 2, code: 'B2', lat: 40.72, lng: -74.0 },
  { name: 'Parkway', line: 'Blue', order: 3, code: 'B3', lat: 40.73, lng: -73.985 },
  { name: 'Airport', line: 'Blue', order: 4, code: 'B4', lat: 40.64, lng: -73.78 },
  // Green line
  { name: 'Garden', line: 'Green', order: 1, code: 'G1', lat: 40.68, lng: -73.94 },
  { name: 'Stadium', line: 'Green', order: 2, code: 'G2', lat: 40.69, lng: -73.93 },
  { name: 'Meadow', line: 'Green', order: 3, code: 'G3', lat: 40.7, lng: -73.92 },
];

async function seed() {
  await connectDB();

  await Station.deleteMany({});
  await Station.insertMany(STATIONS);
  console.log(`Seeded ${STATIONS.length} stations`);

  const email = (process.env.ADMIN_EMAIL || 'admin@metrosync.io').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.deleteMany({}); // clear any old admins
  await Admin.create({ email, passwordHash, role: 'admin' });
  console.log(`Seeded admin: ${email}`);

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
