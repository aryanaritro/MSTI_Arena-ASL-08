export default function ProductCard({ product, onAdd, index }) {
  return <article className="product-card" style={{ '--card-index': index }}>
    <div className="product-image-wrap">
      <img src={product.image} alt={product.title} loading="lazy" />
      {index === 0 && <span className="product-tag">A WAQT favourite</span>}
      <button className="quick-add" onClick={() => onAdd(product)}>Add to bag <span>+</span></button>
    </div>
    <div className="product-info">
      <div><p className="product-category">{product.category}</p><h3>{product.title}</h3></div>
      <p className="product-price">${product.price.toFixed(2)}</p>
    </div>
  </article>;
}
