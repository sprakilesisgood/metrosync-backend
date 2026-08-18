const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('supertest');

process.env.JWT_SECRET = 'test-secret';
const app = require('../index');
const Station = require('../models/Station');
const { Admin } = require('../services/authService');

let mongo;
let stationId;
const ADMIN = { email: 'admin@test.io', password: 'test1234' };

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const station = await Station.create({ name: 'Central', line: 'Red', order: 1 });
  stationId = station._id.toString();
  await Admin.create({
    email: ADMIN.email,
    passwordHash: await bcrypt.hash(ADMIN.password, 10),
    role: 'admin',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('GET /api/v1/stations returns 200 and an array', async () => {
  const res = await request(app).get('/api/v1/stations');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('POST /api/v1/auth/login returns a token for valid credentials', async () => {
  const res = await request(app).post('/api/v1/auth/login').send(ADMIN);
  expect(res.status).toBe(200);
  expect(typeof res.body.token).toBe('string');
});

test('POST announcement without token returns 401', async () => {
  const res = await request(app)
    .post(`/api/v1/stations/${stationId}/announcements`)
    .send({ text: 'Train delayed' });
  expect(res.status).toBe(401);
});

// Bonus: a valid admin can post, and it comes back 201.
test('admin can create an announcement (201)', async () => {
  const login = await request(app).post('/api/v1/auth/login').send(ADMIN);
  const res = await request(app)
    .post(`/api/v1/stations/${stationId}/announcements`)
    .set('Authorization', `Bearer ${login.body.token}`)
    .send({ text: 'Service resumed', type: 'info' });
  expect(res.status).toBe(201);
  expect(res.body.text).toBe('Service resumed');
});
