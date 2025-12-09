import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import ProductCard from './ProductCard';
import { useCart } from '../../context/CartContext';
import type { SelectedAttribute } from '../../types/cart';

interface ProductListProps {
  category: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const { products, loading, error } = useProducts(category);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const handleQuickAdd = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // default attributes: first option from each set
    const selected: SelectedAttribute[] = product.attributes.map((set) => ({
      name: set.name,
      value: set.items[0]?.value ?? '',
    }));

    addToCart(product, selected, 1);
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenDetails={() => navigate(`/product/${product.id}`)}
          onQuickAdd={() => handleQuickAdd(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;
