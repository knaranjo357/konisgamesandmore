import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface PriceCategoryProps {
  category: {
    visible: boolean;
    name: string;
    price: string;
  };
  onToggle: () => void;
  onChange: (value: string) => void;
}

const PriceCategory: React.FC<PriceCategoryProps> = ({ category, onToggle, onChange }) => {
  return (
    <div className="border-t border-gray-700 pt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">{category.name}</h3>
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
        >
          {category.visible ? (
            <>
              <Minus size={16} />
              Hide
            </>
          ) : (
            <>
              <Plus size={16} />
              Add
            </>
          )}
        </button>
      </div>

      {category.visible && (
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
      )}
    </div>
  );
};

export default PriceCategory;