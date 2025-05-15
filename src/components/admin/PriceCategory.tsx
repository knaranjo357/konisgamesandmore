import React from 'react';

interface PriceCategoryProps {
  category: {
    name: string;
    price: string;
  };
  onChange: (value: string) => void;
}

const PriceCategory: React.FC<PriceCategoryProps> = ({ category, onChange }) => {
  return (
    <div className="border-t border-gray-700 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">{category.name}</h3>
        </div>
        <div>
          <input
            type="number"
            step="0.01"
            value={category.price}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-700 p-3 rounded"
            placeholder="Price"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceCategory;