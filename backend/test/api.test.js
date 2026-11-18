import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../server.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const mongoUri = process.env.MONGODB_TEST_URI;
const app = createApp();

if (!mongoUri) {
  test('integration suite skipped: set MONGODB_TEST_URI to run database-backed API tests', { skip: true }, () => {});
} else {
  before(async () => {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    await Promise.all([User.init(), Product.init()]);
    await Promise.all([User.deleteMany({}), Product.deleteMany({})]);
  });
  after(async () => { await mongoose.disconnect(); });

  test('health reports connected database', async () => {
    const response = await request(app).get('/api/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.database, 'connected');
  });

  test('registers a user with a hashed password and no password in response', async () => {
    const response = await request(app).post('/api/auth/register').send({ name: 'Sam Karim', email: 'SAM@example.com', password: 'strong-password-1' });
    assert.equal(response.status, 201);
    assert.equal(response.body.user.email, 'sam@example.com');
    assert.equal('password' in response.body.user, false);
    const user = await User.findOne({ email: 'sam@example.com' }).select('+password');
    assert.notEqual(user.password, 'strong-password-1');
    assert.equal(await (await import('bcryptjs')).default.compare('strong-password-1', user.password), true);
  });

  test('rejects duplicate and invalid registration data', async () => {
    const duplicate = await request(app).post('/api/auth/register').send({ name: 'Sam Karim', email: 'sam@example.com', password: 'strong-password-1' });
    assert.equal(duplicate.status, 409);
    const invalid = await request(app).post('/api/auth/register').send({ name: 'S', email: 'bad', password: 'short' });
    assert.equal(invalid.status, 400);
  });

  test('creates and retrieves products', async () => {
    const created = await request(app).post('/api/products').send({
      name: 'Classic Automatic', brand: 'WAQT', description: 'Steel automatic watch', price: 245,
      imageUrl: 'https://example.com/watch.jpg', category: 'Automatic', stockQuantity: 4
    });
    assert.equal(created.status, 201);
    const listed = await request(app).get('/api/products');
    assert.equal(listed.status, 200);
    assert.equal(listed.body.products.length, 1);
    assert.equal(listed.body.products[0].name, 'Classic Automatic');
    const invalid = await request(app).post('/api/products').send({ name: 'Bad', price: -1 });
    assert.equal(invalid.status, 400);
  });
}
