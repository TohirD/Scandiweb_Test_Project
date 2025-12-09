import React, { useEffect, useState, type ReactNode } from 'react';
import Header from './Header';
import CartOverlay from '../cart/CartOverlay';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

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
