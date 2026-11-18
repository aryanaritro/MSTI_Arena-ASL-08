import ProductCard from './ProductCard.jsx';

export default function Collection({ products, categories, activeCategory, onCategoryChange, onAdd, loading, source }) {
  return <section className="collection wrap" id="collection">
    <div className="section-heading"><div><p className="eyebrow">The collection</p><h2>Good things take <em>time.</em></h2></div><p className="collection-intro">A small collection of enduring design.<br/>Find the one that feels like yours.</p></div>
    <div className="collection-controls">
      <div className="category-tabs" role="group" aria-label="Filter watches by category">
        {categories.map((category) => <button key={category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => onCategoryChange(category)} aria-pressed={activeCategory === category}>{category}</button>)}
      </div>
      {!loading && <span className="result-count">{products.length} {products.length === 1 ? 'piece' : 'pieces'}{source === 'sample' ? ' · curated edit' : ''}</span>}
    </div>
    {loading ? <div className="loading-state"><span className="loader" /> Finding your next favourite…</div> : products.length ? <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} onAdd={onAdd} index={index} />)}</div> : <div className="empty-results">No watches found. Try another search or category.</div>}
  </section>;
}
