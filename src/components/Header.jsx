import NewYearCountdown from './NewYearCountdown';
import './Header.css';

const Header = () => (
  <header className="app-header">
    <div className="header-content">
      <NewYearCountdown />
    </div>
    <div className="goat-animation-layer" aria-hidden="true">
      <span className="goat-traversal">
        <span className="goat-facing">
        <svg className="goat-hop" viewBox="0 0 48 32" role="presentation">
          <path d="M7 13c1-5 7-7 14-6 5-1 11 2 13 7l-3 8H12c-5 0-7-4-5-9Z" fill="#f6f1e8" stroke="#dbcba9" strokeWidth="1.2" />
          <path d="m29 8-2-5 5 4m2 1 3-5 1 6" fill="#f6f1e8" stroke="#e3bd71" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m30 9-5-3 2 6m8-3 5-2-3 7" fill="#f6f1e8" stroke="#dbcba9" strokeWidth="1" strokeLinejoin="round" />
          <circle cx="34" cy="12" r="5" fill="#f6f1e8" stroke="#dbcba9" strokeWidth="1.1" />
          <ellipse cx="39" cy="14" rx="3" ry="2.1" fill="#f0d6bd" />
          <circle cx="35.5" cy="11" r=".8" fill="#26364e" />
          <path d="M8 11 4 9" fill="none" stroke="#e3bd71" strokeWidth="1.4" strokeLinecap="round" />
          <g className="goat-leg leg-one"><path d="m12 20-1 7 2 1" fill="none" stroke="#f6f1e8" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /><path d="m11 27 2 1" fill="none" stroke="#e3bd71" strokeWidth="1.8" strokeLinecap="round" /></g>
          <g className="goat-leg leg-two"><path d="m17 20 1 7 2 1" fill="none" stroke="#f6f1e8" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /><path d="m18 27 2 1" fill="none" stroke="#e3bd71" strokeWidth="1.8" strokeLinecap="round" /></g>
          <g className="goat-leg leg-three"><path d="m26 20-1 7 2 1" fill="none" stroke="#f6f1e8" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /><path d="m25 27 2 1" fill="none" stroke="#e3bd71" strokeWidth="1.8" strokeLinecap="round" /></g>
          <g className="goat-leg leg-four"><path d="m30 19 2 7 2 1" fill="none" stroke="#f6f1e8" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /><path d="m32 26 2 1" fill="none" stroke="#e3bd71" strokeWidth="1.8" strokeLinecap="round" /></g>
        </svg>
        </span>
      </span>
    </div>
  </header>
);

export default Header;
