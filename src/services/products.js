import { sampleProducts } from '../data/sampleProducts.js';

const API_URL = 'https://fakestoreapi.com/products';

function formatCategory(category = '') {
  const normalized = category.toLowerCase();
  if (normalized.includes('jewel')) return 'Dress';
  if (normalized.includes('electronics')) return 'Classic';
  if (normalized.includes("men's")) return 'Sport';
  if (normalized.includes("women's")) return 'Classic';
  return category ? category[0].toUpperCase() + category.slice(1) : 'Classic';
}

export function normalizeProducts(products) {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    category: formatCategory(product.category),
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
    if (!Array.isArray(products) || products.length === 0) throw new Error('Product service returned no products');
    return { products: normalizeProducts(products), source: 'api' };
  } catch {
    return { products: sampleProducts, source: 'sample' };
  }
}
