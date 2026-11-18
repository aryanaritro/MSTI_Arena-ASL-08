import { sampleProducts } from '../data/sampleProducts.js';

const API_URL = 'https://fakestoreapi.com/products';

export function isWatchProduct(product) {
  const category = String(product.category ?? '').trim();
  const title = String(product.title ?? '');
  const description = String(product.description ?? '');
  const isWatchCategory = /\b(watches|watch|wristwatches|timepieces|timepiece)\b/i.test(category);
  const namesWatch = /\b(watches|watch|timepieces|timepiece)\b/i.test(title);
  const isAccessory = /\b(straps?|bands?|bracelets?|boxes|cases|winders?)\b/i.test(title);
  return Boolean(title.trim()) && !isAccessory && (isWatchCategory || namesWatch);
}

function formatCategory(product) {
  const details = `${product.title} ${product.category} ${product.description ?? ''}`.toLowerCase();
  if (/chronograph|chrono/.test(details)) return 'Chronograph';
  if (/diver|diving|field watch|g-shock|sport watch/.test(details)) return 'Sport';
  if (/dress watch|moonphase|bambino|presage/.test(details)) return 'Dress';
  return 'Classic';
}

export function normalizeProducts(products) {
  return products.filter(isWatchProduct).map((product) => ({
    id: product.id,
    title: product.title,
    category: formatCategory(product),
    price: Number(product.price),
    image: product.image,
    description: product.description ?? ''
  }));
}

export async function fetchProducts(fetcher = fetch) {
  try {
    const response = await fetcher(API_URL, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Product service returned ${response.status}`);
    const products = await response.json();
    if (!Array.isArray(products)) throw new Error('Product service returned an invalid catalog');
    const watches = normalizeProducts(products);
    if (watches.length === 0) throw new Error('Product service returned no watches');
    return { products: watches, source: 'api' };
  } catch {
    return { products: sampleProducts, source: 'sample' };
  }
}
