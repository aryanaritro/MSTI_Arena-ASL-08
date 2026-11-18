import { ArrowIcon } from './Icons.jsx';

export default function Hero() {
  return <section className="hero wrap" id="home">
    <div className="hero-copy">
      <p className="eyebrow"><span /> A more considered kind of time</p>
      <h1>Find your<br /><em>own</em> time.</h1>
      <p className="hero-description">Watches with a point of view. Thoughtfully chosen, made to be worn for years, and always right on time.</p>
      <a className="button button-dark" href="#collection">Explore the collection <ArrowIcon /></a>
      <div className="hero-note"><span className="note-line" /> Designed for the moments that matter</div>
    </div>
    <div className="hero-art" aria-label="A classic wristwatch in warm afternoon light" role="img">
      <div className="hero-image"></div>
      <div className="hero-stamp"><span>W</span><small>EST.<br/>1984</small></div>
      <div className="hero-caption"><span>01 / 03</span><i /> Made for everyday, and then some.</div>
      <div className="hero-vertical">THE ART OF KEEPING TIME</div>
    </div>
  </section>;
}
