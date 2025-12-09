import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  isCartOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, isCartOpen }) => {
  const { categories } = useCategories();
  const { totalQuantity } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const match = /^\/category\/([^/]+)/.exec(location.pathname);
  const activeCategory = match ? match[1] : 'all';

  const handleCategoryClick = (name: string) => {
    navigate(`/category/${name}`);
  };

  return (
    <header className="header">
      <nav className="header-left">
        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            className={
              cat.name === activeCategory
                ? 'nav-link nav-link-active'
                : 'nav-link'
            }
            onClick={() => handleCategoryClick(cat.name)}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </nav>

      <div className="header-center">
        {/* Simple text logo, you can replace with SVG later */}
        <Link to="/category/all" className="logo">
            <img src="/a-logo.png" alt="Scandi Shop logo" className="logo-image" />
        </Link>
      </div>

      <div className="header-right">
        <button
        type="button"
        className={`cart-btn ${isCartOpen ? 'cart-btn-active' : ''}`}
        onClick={onCartClick}
        data-testid="cart-btn"
        aria-label="Open cart"
        >
        <img src="/Cart.png" alt="Cart" className="cart-icon" />

        {totalQuantity > 0 && (
          <span className="cart-btn-badge">
            {totalQuantity}
          </span>
        )}
        </button>
      </div>
    </header>
  );
};

export default Header;
