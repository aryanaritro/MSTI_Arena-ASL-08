import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Collection from './components/Collection.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';
import { fetchProducts } from './services/products.js';
import { addToCart, cartCount, cartTotal, filterProducts, updateQuantity } from './utils/store.js';
import './styles.css';

function App() {
  const [products, setProducts] = useState([]);
  const [source, setSource] = useState('api');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All watches');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchProducts().then((result) => {
      if (!alive) return;
      setProducts(result.products);
      setSource(result.source);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => event.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', closeOnEscape); };
  }, [cartOpen]);

  const categories = useMemo(() => ['All watches', ...new Set(products.map((product) => product.category))], [products]);
  const visibleProducts = useMemo(() => filterProducts(products, query, activeCategory), [products, query, activeCategory]);

  function addItem(product) {
    setCart((current) => addToCart(current, product));
    setCartOpen(true);
  }

  return <>
    <Navbar count={cartCount(cart)} onCartClick={() => setCartOpen(true)} query={query} onQueryChange={setQuery} />
    <main><Hero /><div className="assurance-strip"><div><span>01</span>Thoughtfully selected</div><i /><div><span>02</span>Made for the long run</div><i /><div><span>03</span>Always personal</div></div>
      <Collection products={visibleProducts} categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} onAdd={addItem} loading={loading} source={source} />
      <section className="story-band" id="story"><div className="story-inner"><p className="eyebrow">A little more about WAQT</p><h2>Time is the one thing<br/>we all <em>share.</em></h2><p>We believe the best things aren’t rushed. Each watch in our collection has a story, a purpose, and a place in yours.</p><a className="text-link" href="mailto:hello@waqt.example">Get to know us <span>→</span></a></div><div className="story-image" role="img" aria-label="A watchmaker carefully assembling a timepiece" /></section>
    </main>
    <Footer />
    <CartDrawer open={cartOpen} cart={cart} total={cartTotal(cart)} onClose={() => setCartOpen(false)} onQuantityChange={(id, quantity) => setCart((current) => updateQuantity(current, id, quantity))} onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))} />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
