import { useState } from 'react';
import { BagIcon, SearchIcon } from './Icons.jsx';

export default function Navbar({ count, onCartClick, query, onQueryChange }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return <header className="site-header">
    <div className="topline">Complimentary delivery on orders over $250 <span>—</span> A little extra time, well spent.</div>
    <nav className="navbar wrap" aria-label="Main navigation">
      <a className="brand" href="#home" aria-label="WAQT home">WAQT<span className="brand-dot">.</span><small>TIME, CONSIDERED</small></a>
      <div className="nav-links"><a href="#collection">Watches</a><a href="#story">Our story</a><a href="#footer">Visit us</a></div>
      <div className="nav-actions">
        <div className={searchOpen ? 'nav-search search-open' : 'nav-search'}>
          <button className="search-toggle" aria-label={searchOpen ? 'Close search' : 'Open search'} onClick={() => setSearchOpen((open) => !open)}><SearchIcon /></button>
          <input aria-label="Search watches" placeholder="Search" value={query} onChange={(event) => onQueryChange(event.target.value)} />
        </div>
        <button className="bag-button" onClick={onCartClick} aria-label={`Open shopping bag, ${count} items`}><BagIcon /><span>Bag</span><b>{count}</b></button>
      </div>
    </nav>
  </header>;
}
