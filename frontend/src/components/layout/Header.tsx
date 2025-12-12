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

  let activeCategory = 'all';

  const categoryMatchFromCategoryRoute =
    /^\/category\/([^/]+)/.exec(location.pathname);
  const categoryMatchFromRoot = /^\/([^/]+)/.exec(location.pathname);

  if (categoryMatchFromCategoryRoute && categoryMatchFromCategoryRoute[1]) {
    activeCategory = categoryMatchFromCategoryRoute[1];
  } else if (
    location.pathname !== '/' &&
    categoryMatchFromRoot &&
    categoryMatchFromRoot[1]
  ) {
    activeCategory = categoryMatchFromRoot[1];
  }

  const handleCategoryClick = (
    name: string,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    navigate(`/category/${name}`);
  };

  return (
    <header className="header">
      <nav className="header-left">
        {categories.map((cat) => {
          const isActive = cat.name === activeCategory;

          return (
            <a
              key={cat.name}
              href={`/${cat.name}`}
              className={isActive ? 'nav-link nav-link-active' : 'nav-link'}
              data-testid={
                isActive ? 'active-category-link' : 'category-link'
              }
              onClick={(e) => handleCategoryClick(cat.name, e)}
              style={{ textDecoration: 'none' }} 
            >
              {cat.name.toUpperCase()}
            </a>
          );
        })}
      </nav>

      <div className="header-center">
        <Link to="/category/all" className="logo">
          <img
            src="/a-logo.png"
            alt="Scandi Shop logo"
            className="logo-image"
          />
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
            <span className="cart-btn-badge">{totalQuantity}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;


