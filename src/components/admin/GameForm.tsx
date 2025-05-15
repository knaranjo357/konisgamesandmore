import React, { useState, useRef, useEffect } from 'react';
import { Game, PRICE_CATEGORIES } from '../../types';
import { Search, Plus, Minus } from 'lucide-react';
import PriceCategory from './PriceCategory';

interface GameFormProps {
  formData: Partial<Game>;
  setFormData: (data: Partial<Game>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  consoles: { name: string; url: string }[];
  isEditing: boolean;
}

const GameForm: React.FC<GameFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  consoles,
  isEditing
}) => {
  const [showConsoleDropdown, setShowConsoleDropdown] = useState(false);
  const [filteredConsoles, setFilteredConsoles] = useState<{ name: string; url: string }[]>([]);
  const consoleInputRef = useRef<HTMLInputElement>(null);
  const [priceCategories, setPriceCategories] = useState(
    PRICE_CATEGORIES.map(cat => ({
      visible: Boolean(formData[cat.value]),
      name: cat.label,
      price: formData[cat.value] || '',
      value: cat.value
    }))
  );
  const [customCategories, setCustomCategories] = useState([
    { visible: false, name: '', price: '' },
    { visible: false, name: '', price: '' },
    { visible: false, name: '', price: '' }
  ]);

  // Initialize custom categories when editing
  useEffect(() => {
    if (isEditing) {
      const newCustomCategories = [...customCategories];
      ['price1', 'price2', 'price3'].forEach((field, index) => {
        const value = formData[field as keyof Game];
        if (value && typeof value === 'string') {
          const [name, price] = value.split('-');
          newCustomCategories[index] = {
            visible: true,
            name,
            price
          };
        }
      });
      setCustomCategories(newCustomCategories);
    }
  }, [isEditing, formData.id]);

  // Update price categories when formData changes
  useEffect(() => {
    setPriceCategories(
      PRICE_CATEGORIES.map(cat => ({
        visible: Boolean(formData[cat.value]),
        name: cat.label,
        price: formData[cat.value] || '',
        value: cat.value
      }))
    );
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleConsoleSelect = (console: { name: string; url: string }) => {
    setFormData({
      ...formData,
      console: console.name,
      console_url: console.url
    });
    setShowConsoleDropdown(false);
  };

  const handlePriceCategoryChange = (index: number, field: 'price', value: string) => {
    const updated = [...priceCategories];
    updated[index] = { ...updated[index], [field]: value };
    setPriceCategories(updated);
    setFormData({
      ...formData,
      [updated[index].value]: value || null
    });
  };

  const togglePriceCategory = (index: number) => {
    const updated = [...priceCategories];
    updated[index] = { ...updated[index], visible: !updated[index].visible };
    setPriceCategories(updated);
    if (!updated[index].visible) {
      setFormData({
        ...formData,
        [updated[index].value]: null
      });
    }
  };

  const handleCustomCategoryChange = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...customCategories];
    updated[index] = { ...updated[index], [field]: value };
    setCustomCategories(updated);
    
    if (updated[index].name && updated[index].price) {
      setFormData({
        ...formData,
        [`price${index + 1}`]: `${updated[index].name}-${updated[index].price}`
      });
    }
  };

  const toggleCustomCategory = (index: number) => {
    const updated = [...customCategories];
    updated[index] = { ...updated[index], visible: !updated[index].visible };
    setCustomCategories(updated);
    if (!updated[index].visible) {
      setFormData({
        ...formData,
        [`price${index + 1}`]: null
      });
    }
  };

  React.useEffect(() => {
    if (formData.console) {
      const filtered = consoles.filter(c => 
        c.name.toLowerCase().includes(formData.console!.toLowerCase())
      );
      setFilteredConsoles(filtered);
    } else {
      setFilteredConsoles([]);
    }
  }, [formData.console, consoles]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="sticky top-0 bg-gray-800 p-4 -mx-6 -mt-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Game' : 'Add New Game'}</h2>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {isEditing ? 'Update Game' : 'Add Game'}
        </button>
      </div>

      {isEditing && (
        <div>
          <label className="block mb-2">ID</label>
          <input
            type="number"
            name="id"
            value={formData.id || ''}
            onChange={handleChange}
            className="w-full bg-gray-700 p-3 rounded"
            disabled
          />
        </div>
      )}
      
      <div>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-gray-700 p-3 rounded"
          required
        />
      </div>

      <div className="space-y-6">
        {priceCategories.map((category, index) => (
          <PriceCategory
            key={index}
            category={category}
            onToggle={() => togglePriceCategory(index)}
            onChange={(value) => handlePriceCategoryChange(index, 'price', value)}
          />
        ))}

        {customCategories.map((category, index) => (
          <div key={index} className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Custom Category {index + 1}</h3>
              <button
                type="button"
                onClick={() => toggleCustomCategory(index)}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleCustomCategoryChange(index, 'name', e.target.value)}
                    className="w-full bg-gray-700 p-3 rounded"
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    value={category.price}
                    onChange={(e) => handleCustomCategoryChange(index, 'price', e.target.value)}
                    className="w-full bg-gray-700 p-3 rounded"
                    placeholder="Price"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative">
        <label className="block mb-2">Console</label>
        <div className="relative">
          <input
            type="text"
            name="console"
            ref={consoleInputRef}
            value={formData.console}
            onChange={handleChange}
            onFocus={() => setShowConsoleDropdown(true)}
            className="w-full bg-gray-700 p-3 rounded"
            required
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        {showConsoleDropdown && filteredConsoles.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredConsoles.map((console, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors"
                onClick={() => handleConsoleSelect(console)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={console.url}
                    alt={console.name}
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logokonisgames.png';
                    }}
                  />
                  <span>{console.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2">Console Image URL</label>
        <input
          type="url"
          name="console_url"
          value={formData.console_url}
          onChange={handleChange}
          className="w-full bg-gray-700 p-3 rounded"
          required
        />
        {formData.console_url && (
          <div className="mt-2">
            <img
              src={formData.console_url}
              alt="Console Preview"
              className="w-32 h-32 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logokonisgames.png';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2">Game Images URLs</label>
        <div className="space-y-4">
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Main Image URL"
            className="w-full bg-gray-700 p-3 rounded"
            required
          />
          <input
            type="url"
            name="imageUrl2"
            value={formData.imageUrl2}
            onChange={handleChange}
            placeholder="Second Image URL"
            className="w-full bg-gray-700 p-3 rounded"
            required
          />
          <input
            type="url"
            name="imageUrl3"
            value={formData.imageUrl3}
            onChange={handleChange}
            placeholder="Third Image URL"
            className="w-full bg-gray-700 p-3 rounded"
            required
          />
        </div>
        {formData.imageUrl && (
          <div className="mt-2 flex gap-2">
            <img
              src={formData.imageUrl}
              alt="Preview 1"
              className="w-32 h-32 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logokonisgames.png';
              }}
            />
            {formData.imageUrl2 && (
              <img
                src={formData.imageUrl2}
                alt="Preview 2"
                className="w-32 h-32 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logokonisgames.png';
                }}
              />
            )}
            {formData.imageUrl3 && (
              <img
                src={formData.imageUrl3}
                alt="Preview 3"
                className="w-32 h-32 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logokonisgames.png';
                }}
              />
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Rating (0-5)</label>
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            step="0.5"
            value={formData.rating}
            onChange={handleChange}
            className="w-full bg-gray-700 p-3 rounded"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isBestSeller"
            checked={formData.isBestSeller}
            onChange={handleChange}
            className="w-5 h-5 bg-gray-700 rounded mr-2"
          />
          <label>Best Seller</label>
        </div>
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-gray-700 p-3 rounded"
          rows={4}
          required
        />
      </div>
    </form>
  );
};

export default GameForm;