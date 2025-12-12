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
  isProductPage,
}) => {
  const handleClick = (item: AttributeItem) => {
    if (readOnly || !onSelect) return;
    onSelect(item.value);
  };

  const attributeKey = attribute.name.toLowerCase();
  const isColorAttribute = attributeKey === 'color';
  const isCapacityAttribute = attributeKey === 'capacity';

  const containerTestId = isProductPage
    ? `product-attribute-${toKebabCase(attribute.name)}`
    : undefined;

  return (
    <div className="attribute-set" data-testid={containerTestId}>
      <div className="attribute-name">{attribute.name}:</div>

      <div className="attribute-items">
        {attribute.items.map((item) => {
          const isSelected = selectedValue === item.value;

          const baseClass =
            attribute.type === 'swatch'
              ? 'attribute-item attribute-swatch'
              : 'attribute-item attribute-text';

          const className = [
            baseClass,
            isSelected ? 'attribute-selected' : '',
            readOnly ? 'attribute-readonly' : '',
          ]
            .filter(Boolean)
            .join(' ');

          let itemTestId: string | undefined;

          if (isColorAttribute) {
            const key = item.id || item.value;
            itemTestId = `product-attribute-color-${key}`;
          } else if (isCapacityAttribute) {
            const key = item.id || item.value;
            itemTestId = `product-attribute-capacity-${key}`;
          }

          return (
            <button
              key={item.id}
              type="button"
              className={className}
              data-testid={itemTestId}
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
