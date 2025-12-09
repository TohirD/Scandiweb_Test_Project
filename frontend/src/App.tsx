import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '../src/context/CartContext';
import Layout from '../src/components/layout/Layout';
import CategoryPage from './pages/CategoryPage';
import ProductPage from '../src/pages/ProductPage'


const App: React.FC = () => {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/category/all" replace />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
};

export default App;
