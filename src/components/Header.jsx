import NewYearCountdown from './NewYearCountdown';
import './Header.css';

const Header = () => (
  <header className="app-header">
    <div className="header-content">
      <NewYearCountdown />
    </div>
  </header>
);

export default Header;
