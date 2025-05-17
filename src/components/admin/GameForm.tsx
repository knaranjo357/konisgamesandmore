import React, { useState, useRef, useEffect } from 'react';
import { Game } from '../../types';
import { Search } from 'lucide-react';
import ImageUpload from './ImageUpload';

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
  const [showAdditionalImages, setShowAdditionalImages] = useState(false);

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

  const handleCustomCategoryChange = (index: number, field: 'name' | 'price', value: string) => {
    const priceField = `price${index + 1}` as keyof Game;
    const currentValue = formData[priceField] || '';
    const [currentName, currentPrice] = currentValue.split('-');
    
    if (field === 'name') {
      setFormData({
        ...formData,
        [priceField]: `${value}-${currentPrice || ''}`
      });
    } else {
      setFormData({
        ...formData,
        [priceField]: `${currentName || ''}-${value}`
      });
    }
  };

  const sortedConsoles = [...consoles].sort((a, b) => a.name.localeCompare(b.name));

  React.useEffect(() => {
    if (formData.console) {
      const filtered = sortedConsoles.filter(c => 
        c.name.toLowerCase().includes(formData.console!.toLowerCase())
      );
      setFilteredConsoles(filtered);
    } else {
      setFilteredConsoles([]);
    }
  }, [formData.console, consoles]);

  const handleImageUploadSuccess = (imageNumber: number, url: string) => {
    setFormData({
      ...formData,
      [imageNumber === 1 ? 'imageUrl' : imageNumber === 2 ? 'imageUrl2' : 'imageUrl3']: url
    });
  };

  const handleImageUploadError = (error: string) => {
    console.error('Image upload error:', error);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="sticky top-0 bg-gray-800 p-4 -mx-6 -mt-6 flex justify-between items-center border-b border-gray-700 z-50">
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Game' : 'Add New Game'}</h2>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {isEditing ? 'Update Game' : 'Add Game'}
        </button>
      </div>

      <input
        type="hidden"
        name="id"
        value={formData.id || ''}
      />

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
            placeholder="Select or type console name"
            required
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        {showConsoleDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {sortedConsoles.map((console, index) => (
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
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logokonisgames.png';
              }}
            />
          </div>
        )}
      </div>
      
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

      <div className="space-y-4">
        <label className="block mb-2">Images</label>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Main Image</label>
          <ImageUpload
            id={formData.id || 0}
            imageNumber={1}
            currentUrl={formData.imageUrl || ''}
            onUploadSuccess={(url) => handleImageUploadSuccess(1, url)}
            onError={handleImageUploadError}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdditionalImages(!showAdditionalImages)}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
          >
            {showAdditionalImages ? 'Hide Additional Images' : 'Add More Images'}
          </button>

          {showAdditionalImages && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Second Image</label>
                <ImageUpload
                  id={formData.id || 0}
                  imageNumber={2}
                  currentUrl={formData.imageUrl2 || ''}
                  onUploadSuccess={(url) => handleImageUploadSuccess(2, url)}
                  onError={handleImageUploadError}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Third Image</label>
                <ImageUpload
                  id={formData.id || 0}
                  imageNumber={3}
                  currentUrl={formData.imageUrl3 || ''}
                  onUploadSuccess={(url) => handleImageUploadSuccess(3, url)}
                  onError={handleImageUploadError}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Price Categories</h3>
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={formData[`price${index}` as keyof Game]?.split('-')[0] || ''}
                  onChange={(e) => handleCustomCategoryChange(index - 1, 'name', e.target.value)}
                  className="w-full bg-gray-700 p-3 rounded"
                  placeholder="Category name"
                />
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  value={formData[`price${index}` as keyof Game]?.split('-')[1] || ''}
                  onChange={(e) => handleCustomCategoryChange(index - 1, 'price', e.target.value)}
                  className="w-full bg-gray-700 p-3 rounded"
                  placeholder="Price"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default GameForm;