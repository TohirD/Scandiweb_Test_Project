import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/product/ProductList';

const CategoryPage: React.FC = () => {
  const params = useParams();
  const category = params.name ?? 'all';

  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <section className="page">
      <h1 className="page-title">{title}</h1>
      <ProductList category={category} />
    </section>
  );
};

export default CategoryPage;
