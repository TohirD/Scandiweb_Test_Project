import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetails } from '../hooks/useProductDetails';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Gallery from '../components/product/Gallery';
import AttributeSelector from '../components/product/AttributeSelector';
import { useCart } from '../context/CartContext';
import type { SelectedAttribute } from '../types/cart';

function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

const ProductPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { product, loading, error } = useProductDetails(id);
  const { addToCart } = useCart();

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const allAttributesSelected = useMemo(() => {
    if (!product) return false;
    return product.attributes.every(
      (attr) =>
        selectedAttributes[attr.name] && selectedAttributes[attr.name] !== '',
    );
  }, [product, selectedAttributes]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const price = product.prices[0];

  const handleSelectAttribute = (name: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    if (!allAttributesSelected) return;

    const selected: SelectedAttribute[] = product.attributes.map((attr) => ({
      name: attr.name,
      value: selectedAttributes[attr.name],
    }));

    addToCart(product, selected, 1);
  };

  return (
    <section className="page product-page">
      <Gallery images={product.gallery} />

      <div className="product-details">
        <h1 className="product-title">{product.name}</h1>

        {product.attributes.map((attr) => (
          <AttributeSelector
            key={attr.id}
            attribute={attr}
            selectedValue={selectedAttributes[attr.name]}
            onSelect={(value) => handleSelectAttribute(attr.name, value)}
            isProductPage
          />
        ))}

        <div className="product-price-block">
          <div className="attribute-name">PRICE:</div>
          <div className="product-price-big">
            {price && (
              <>
                {price.currencySymbol}
                {price.amount.toFixed(2)}
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="add-to-cart-btn"
          disabled={!allAttributesSelected || !product.inStock}
          onClick={handleAddToCart}
          data-testid="add-to-cart"
        >
          ADD TO CART
        </button>

        <div className="product-description" data-testid="product-description">
          {stripHtml(product.description)}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
