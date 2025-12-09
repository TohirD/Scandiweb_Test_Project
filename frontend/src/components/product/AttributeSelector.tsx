import React from 'react';
import type { AttributeSet, AttributeItem } from '../../types/product';
import { toKebabCase } from '../../utils/kebabCase';

interface Props {
  attribute: AttributeSet;
  selectedValue?: string;
  onSelect?: (value: string) => void;
  readOnly?: boolean;
  isProductPage?: boolean;
}

const AttributeSelector: React.FC<Props> = ({
  attribute,
  selectedValue,
  onSelect,
  readOnly = false,
  isProductPage = false,
}) => {
  const containerTestId = isProductPage
    ? `product-attribute-${toKebabCase(attribute.name)}`
    : undefined;

  const handleClick = (item: AttributeItem) => {
    if (readOnly || !onSelect) return;
    onSelect(item.value);
  };

  return (
    <div
      className="attribute-set"
      data-testid={containerTestId}
    >
      <div className="attribute-name">{attribute.name.toUpperCase()}:</div>
      <div className="attribute-items">
        {attribute.items.map((item) => {
          const isSelected = item.value === selectedValue;
          const baseClass =
            attribute.type === 'swatch'
              ? 'attribute-item attribute-swatch'
              : 'attribute-item attribute-text';

          const className = `${baseClass} ${
            isSelected ? 'attribute-selected' : ''
          } ${readOnly ? 'attribute-readonly' : ''}`;

          return (
            <button
              key={item.id}
              type="button"
              className={className}
              style={
                attribute.type === 'swatch'
                  ? { backgroundColor: item.value }
                  : undefined
              }
              onClick={() => handleClick(item)}
            >
              {attribute.type === 'text' ? item.value : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeSelector;
