import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShoppingList from './pages/ShoppingList';
import Menu from './pages/Menu';
import ErrorBoundary from './components/ErrorBoundary';
import { StoresProvider } from './contexts/StoresContext';
import { useNewYearCountdown } from './hooks/useNewYearCountdown';
import './App.css';

// Get base path from environment variable
// Defaults to '/' for Vercel and local dev
// For GitHub Pages, set VITE_BASE_PATH to your repo name (e.g., '/shopping-list/')
const basePath = import.meta.env.VITE_BASE_PATH || '/';

function App() {
  const { targetYear } = useNewYearCountdown();

  // Update document title and meta description dynamically
  useEffect(() => {
    const title = `New Year Shopping List ${targetYear}`;
    const description = `New Year ${targetYear} Shopping List - Collaborative shopping list and menu planner`;
    
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      // Create meta description if it doesn't exist
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }
  }, [targetYear]);

  return (
    <ErrorBoundary>
      <StoresProvider>
        <Router basename={basePath}>
          <Routes>
            <Route path="/" element={<ShoppingList />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </Router>
      </StoresProvider>
    </ErrorBoundary>
  );
}

export default App;
