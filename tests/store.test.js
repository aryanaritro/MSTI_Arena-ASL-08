import test from 'node:test';
import assert from 'node:assert/strict';
import { addToCart, cartCount, cartTotal, filterProducts, updateQuantity } from '../src/utils/store.js';
import { fetchProducts, normalizeProducts } from '../src/services/products.js';

const watches = [
  { id: 1, title: 'Heritage Automatic', category: 'Classic', description: 'Steel case', price: 289 },
  { id: 2, title: 'Meridian Chronograph', category: 'Chronograph', description: 'Leather strap', price: 365 }
];

test('search and category filters compose and ignore case', () => {
  assert.deepEqual(filterProducts(watches, 'LEATHER', 'All watches').map((item) => item.id), [2]);
  assert.deepEqual(filterProducts(watches, 'steel', 'Classic').map((item) => item.id), [1]);
  assert.deepEqual(filterProducts(watches, '', 'Chronograph').map((item) => item.id), [2]);
});

test('cart adds, increments, updates, removes, and totals correctly', () => {
  let cart = addToCart([], watches[0]);
  cart = addToCart(cart, watches[0]);
  cart = addToCart(cart, watches[1]);
  assert.equal(cartCount(cart), 3);
  assert.equal(cartTotal(cart), 943);
  cart = updateQuantity(cart, 1, 1);
  assert.equal(cartTotal(cart), 654);
  cart = updateQuantity(cart, 1, 0);
  assert.deepEqual(cart.map((item) => item.id), [2]);
});

test('product service keeps watch inventory and excludes clothes and watch accessories', async () => {
  const apiResult = await fetchProducts(async () => ({ ok: true, json: async () => [
    { id: 12, title: 'Sample watch', category: 'watches', price: '29.95', image: 'watch.jpg' },
    { id: 13, title: 'Cotton shirt', category: "men's clothing", price: '19.95', image: 'shirt.jpg' },
    { id: 14, title: 'Leather watch strap', category: 'accessories', price: '9.95', image: 'strap.jpg' }
  ] }));
  assert.equal(apiResult.source, 'api');
  assert.equal(apiResult.products.length, 1);
  assert.deepEqual(apiResult.products[0], { id: 12, title: 'Sample watch', category: 'Classic', price: 29.95, image: 'watch.jpg', description: '' });
  const irrelevantCatalog = await fetchProducts(async () => ({ ok: true, json: async () => [{ id: 13, title: 'Cotton shirt', category: "men's clothing", price: 19.95, image: 'shirt.jpg' }] }));
  assert.equal(irrelevantCatalog.source, 'sample');
  assert.ok(irrelevantCatalog.products.every((product) => /tissot|seiko|citizen|casio|orient|hamilton|rado|tag heuer/i.test(product.title)));
  const fallback = await fetchProducts(async () => { throw new Error('offline'); });
  assert.equal(fallback.source, 'sample');
  assert.ok(fallback.products.length >= 4);
  assert.equal(normalizeProducts([{ id: 1, title: 'A portable device', category: 'electronics', price: 1, image: '' }]).length, 0);
});
