import React, { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import CartOverlay from '../cart/CartOverlay';
import { useCart } from '../../context/CartContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalQuantity } = useCart();
  const location = useLocation();

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  // close cart when route changes
  useEffect(() => {
    closeCart();
  }, [location.pathname]);

  // close cart on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

 // if at lease one item in cart then cart is open
  useEffect(() => {
    if (totalQuantity > 0) {
      openCart();
    }
  }, [totalQuantity]);

  return (
    <div className="app-root">
      <Header onCartClick={toggleCart} isCartOpen={isCartOpen} />

      <div className={`app-main-wrapper ${isCartOpen ? 'dimmed' : ''}`}>
        <main className="app-main">{children}</main>
      </div>

      <CartOverlay isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default Layout;

