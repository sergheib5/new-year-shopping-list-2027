import NewYearCountdown from './NewYearCountdown';
import './Header.css';

const Header = () => (
  <header className="app-header">
    <div className="header-content">
      <NewYearCountdown />
    </div>
    <div className="goat-animation-layer" aria-hidden="true">
      <span className="goat-traversal">
        <svg className="goat-hop" viewBox="0 0 64 40" role="presentation">
          <g className="goat-leg leg-one"><path d="m22 22-7 7-5 2" fill="none" stroke="#b77b3e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /><path d="m10 30 4 0-1 2-4 1Z" fill="#55402f" /></g>
          <g className="goat-leg leg-two"><path d="m28 23-2 7 1 3" fill="none" stroke="#d6a05e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="m25 32 4 0 1 2-4 0Z" fill="#55402f" /></g>
          <path d="M20 16c-4-3-6-5-8-7 4 1 6 2 8 5" fill="#c98e4b" stroke="#694c31" strokeWidth=".8" strokeLinejoin="round" />
          <path d="M16 18c1-6 9-10 19-9 6 0 11 2 14 6l-4 10c-8 4-20 4-28 0-3-2-3-5-1-7Z" fill="#c99150" stroke="#694c31" strokeWidth="1" strokeLinejoin="round" />
          <path d="M21 14c3-3 7-4 11-3" fill="none" stroke="#e5b978" strokeWidth="1" strokeLinecap="round" />
          <g className="goat-scarf-tail"><path d="M45 17c-5-3-8-4-13-3l4 4-4 2c5 2 10 2 15 1Z" fill="#d94d5b" stroke="#713e3d" strokeWidth=".8" strokeLinejoin="round" /><path d="m37 15 4 4m-4 0 3 2" fill="none" stroke="#ffe1bd" strokeWidth=".8" strokeLinecap="round" /></g>
          <path d="M44 14c1-6 7-9 12-7 4 2 5 5 5 8l3 3-3 3-5 0-5 4-6-4-4-1Z" fill="#d3a060" stroke="#694c31" strokeWidth="1" strokeLinejoin="round" />
          <path d="m47 10-7-4 2 7m13-6c4-6 7-5 8-3m-11 4c-1-6 1-8 3-8" fill="#d3a060" stroke="#694c31" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M45 15c-3-1-6-2-8-1l5 4" fill="#d3a060" stroke="#694c31" strokeWidth=".9" strokeLinejoin="round" />
          <circle cx="57" cy="12" r="2.2" fill="#fff" stroke="#694c31" strokeWidth=".5" />
          <circle cx="57.7" cy="12.2" r="1.1" fill="#27364b" />
          <path d="m62 16 1.6 1-1.3 1.2" fill="#573f30" stroke="#694c31" strokeWidth=".5" strokeLinejoin="round" />
          <path d="m54 22 2 6 3-6-2 2Z" fill="#76523a" stroke="#694c31" strokeWidth=".6" strokeLinejoin="round" />
          <path d="M41 16c1 3 3 5 7 7l-2 3c-5-2-8-5-9-8Z" fill="#cf4657" stroke="#713e3d" strokeWidth=".8" strokeLinejoin="round" />
          <path d="m40 17 2 3" fill="none" stroke="#ffe1bd" strokeWidth=".8" strokeLinecap="round" />
          <path d="m44 21 3 1 0 3-2 1-2-2Z" fill="#f4c544" stroke="#8e632d" strokeWidth=".7" strokeLinejoin="round" />
          <g className="goat-leg leg-three"><path d="m43 22 6 5 5 1" fill="none" stroke="#d3a060" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /><path d="m53 27 4 0 1 2-4 0Z" fill="#55402f" /></g>
          <g className="goat-leg leg-four"><path d="m38 24 3 6 4 2" fill="none" stroke="#b77b3e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="m43 31 4 1 0 2-4-1Z" fill="#55402f" /></g>
        </svg>
      </span>
    </div>
  </header>
);

export default Header;
