export function filterProducts(products, query, category) {
  const search = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesQuery = !search || `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(search);
    return matchesQuery && (category === 'All watches' || product.category === category);
  });
}

export function addToCart(cart, product) {
  const existing = cart.find((item) => item.id === product.id);
  return existing
    ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { ...product, quantity: 1 }];
}

export function updateQuantity(cart, id, quantity) {
  return quantity <= 0
    ? cart.filter((item) => item.id !== id)
    : cart.map((item) => item.id === id ? { ...item, quantity } : item);
}

export function cartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
