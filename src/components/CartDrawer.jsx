import { createPortal } from 'react-dom';
import { BagIcon, CloseIcon } from './Icons.jsx';

export default function CartDrawer({ open, cart, total, onClose, onQuantityChange, onRemove }) {
  if (!open) return null;
  return createPortal(<div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="drawer-header"><div><p className="eyebrow">Your selection</p><h2 id="cart-title">Shopping bag <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span></h2></div><button className="icon-button" aria-label="Close shopping bag" onClick={onClose}><CloseIcon /></button></div>
      {cart.length ? <>
        <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}>
          <img src={item.image} alt="" /><div className="cart-item-details"><p className="product-category">{item.category}</p><h3>{item.title}</h3><p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p><div className="cart-item-actions"><div className="quantity-control"><button aria-label={`Decrease ${item.title} quantity`} onClick={() => onQuantityChange(item.id, item.quantity - 1)}>−</button><span>{item.quantity}</span><button aria-label={`Increase ${item.title} quantity`} onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button></div><button className="remove-button" onClick={() => onRemove(item.id)}>Remove</button></div></div>
        </div>)}</div>
        <div className="drawer-footer"><div className="subtotal"><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="button button-dark checkout-button" onClick={() => alert('Checkout is coming soon.')}>Continue to checkout <span>→</span></button><button className="continue-shopping" onClick={onClose}><BagIcon /> Continue shopping</button></div>
      </> : <div className="cart-empty"><div className="empty-bag"><BagIcon /></div><h3>Your bag is taking a little pause.</h3><p>Good things are worth the wait. Explore the collection and find your next favourite.</p><button className="button button-dark" onClick={onClose}>Explore watches <span>→</span></button></div>}
    </aside>
  </div>, document.body);
}
