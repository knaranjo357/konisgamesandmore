import React, { useState, useRef, useEffect } from 'react';
import { Game } from '../../types';
import { Search, Flame, Save, Plus } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface GameFormProps {
  formData: any; // Usamos 'any' aquí temporalmente si 'Partial<Game>' sigue dando error con los campos extra
  setFormData: (data: any) => void;
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    
    let newName = currentName;
    let newPrice = currentPrice;

    if (field === 'name') {
      newName = value;
    } else {
      newPrice = value;
    }

    if (newName === '' && newPrice === '') {
      setFormData({
        ...formData,
        [priceField]: ''
      });
      setErrors(prev => ({ ...prev, [priceField]: '' }));
      return;
    }

    if (newName === '' || newPrice === '') {
      setErrors(prev => ({
        ...prev,
        [priceField]: 'Both category name and price are required'
      }));
    } else {
      setErrors(prev => ({ ...prev, [priceField]: '' }));
    }

    setFormData({
      ...formData,
      [priceField]: `${newName}-${newPrice}`
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasErrors = false;
    const newErrors: { [key: string]: string } = {};

    [1, 2, 3, 4, 5, 6, 7, 8].forEach(index => {
      const priceField = `price${index}` as keyof Game;
      const value = formData[priceField] || '';
      const [name, price] = value.split('-');

      if ((name && !price) || (!name && price)) {
        newErrors[priceField] = 'Both category name and price are required';
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      handleSubmit(e);
    }
  };

  const sortedConsoles = [...consoles].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
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
    <form onSubmit={handleFormSubmit} className="flex flex-col h-full relative">
      {/* Header Fijo */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl pb-4 pt-2 -mt-2 mb-6 border-b border-gray-800/80 z-40 flex justify-between items-center rounded-t-3xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isEditing ? '✏️ Edit Game' : '✨ Add New Game'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isEditing ? 'Update the details below' : 'Fill in the game details'}
          </p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5"
        >
          <Save className="w-4 h-4" />
          {isEditing ? 'Save' : 'Publish'}
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <input type="hidden" name="id" value={formData.id || ''} />

        {/* --- SECCIÓN 1: Info Básica --- */}
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 space-y-5">
          <h3 className="text-xs font-bold tracking-widest text-purple-400 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Basic Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Game Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-950/60 border border-gray-700/50 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-600"
              placeholder="e.g. Super Mario 64"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Platform / Console</label>
            <div className="relative group">
              <input
                type="text"
                name="console"
                ref={consoleInputRef}
                value={formData.console}
                onChange={handleChange}
                onFocus={() => setShowConsoleDropdown(true)}
                className="w-full bg-gray-950/60 border border-gray-700/50 text-white p-3.5 pl-11 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-600"
                placeholder="Search console..."
                required
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
            </div>
            
            {showConsoleDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-auto custom-scrollbar">
                {sortedConsoles.map((console, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center gap-3 border-b border-gray-700/50 last:border-0"
                    onClick={() => handleConsoleSelect(console)}
                  >
                    <img
                      src={console.url}
                      className="w-8 h-8 object-cover rounded-md bg-gray-900 border border-gray-600"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/logokonisgames.png'; }}
                    />
                    <span className="font-medium text-gray-200">{console.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Console URL Hidden Input pero mostrando la preview si existe */}
          <input type="hidden" name="console_url" value={formData.console_url} onChange={handleChange} />
          {formData.console_url && (
            <div className="mt-2 flex items-center gap-3 bg-gray-900/50 p-2 rounded-lg border border-gray-700/50 w-fit">
              <img
                src={formData.console_url}
                alt="Console"
                className="w-8 h-8 object-cover rounded"
                onError={(e) => { (e.target as HTMLImageElement).src = '/logokonisgames.png'; }}
              />
              <span className="text-xs text-gray-400 pr-2">Selected Icon</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-950/60 border border-gray-700/50 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none placeholder-gray-600"
              rows={4}
              placeholder="Game condition, details, regions..."
              required
            />
          </div>

          <label className="flex items-center gap-3 p-4 bg-gray-950/40 border border-orange-500/20 rounded-xl cursor-pointer hover:bg-gray-900/60 transition-colors group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-900 border-gray-600 rounded text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <Flame className={`w-5 h-5 ${formData.isBestSeller ? 'text-orange-500' : 'text-gray-500 group-hover:text-orange-400'} transition-colors`} />
              <span className={`font-medium ${formData.isBestSeller ? 'text-orange-400' : 'text-gray-400'}`}>Mark as Best Seller</span>
            </div>
          </label>
        </div>

        {/* --- SECCIÓN 2: Imágenes --- */}
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 space-y-5">
          <h3 className="text-xs font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Media Gallery
          </h3>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">Primary Cover Image</label>
            <ImageUpload id={formData.id || 0} imageNumber={1} currentUrl={formData.imageUrl || ''} onUploadSuccess={(url) => handleImageUploadSuccess(1, url)} onError={handleImageUploadError} />
          </div>

          <button
            type="button"
            onClick={() => setShowAdditionalImages(!showAdditionalImages)}
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 mt-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors w-fit"
          >
            {showAdditionalImages ? '− Hide extra images' : <><Plus className="w-4 h-4"/> Add extra images</>}
          </button>

          {showAdditionalImages && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700/50 animate-fadeIn">
              <div className="space-y-1 bg-gray-900/30 p-3 rounded-xl border border-gray-800">
                <label className="text-xs font-medium text-gray-400">Image 2 (e.g. Cartridge)</label>
                <ImageUpload id={formData.id || 0} imageNumber={2} currentUrl={formData.imageUrl2 || ''} onUploadSuccess={(url) => handleImageUploadSuccess(2, url)} onError={handleImageUploadError} />
              </div>
              <div className="space-y-1 bg-gray-900/30 p-3 rounded-xl border border-gray-800">
                <label className="text-xs font-medium text-gray-400">Image 3 (e.g. Back Cover)</label>
                <ImageUpload id={formData.id || 0} imageNumber={3} currentUrl={formData.imageUrl3 || ''} onUploadSuccess={(url) => handleImageUploadSuccess(3, url)} onError={handleImageUploadError} />
              </div>
            </div>
          )}
        </div>

        {/* --- SECCIÓN 3: Precios --- */}
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
          <h3 className="text-xs font-bold tracking-widest text-green-400 uppercase flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Pricing Categories
          </h3>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
              const priceField = `price${index}` as keyof Game;
              const error = errors[priceField];
              const [categoryName, categoryPrice] = (formData[priceField] || '-').split('-');

              return (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-900/30 p-3 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      value={categoryName || ''}
                      onChange={(e) => handleCustomCategoryChange(index - 1, 'name', e.target.value)}
                      className={`w-full bg-gray-950/60 border ${error ? 'border-red-500' : 'border-gray-700/50'} text-white p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/50 outline-none placeholder-gray-600`}
                      placeholder={`Category ${index} (e.g. CIB)`}
                    />
                  </div>
                  <div className="w-full sm:w-1/3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={categoryPrice || ''}
                      onChange={(e) => handleCustomCategoryChange(index - 1, 'price', e.target.value)}
                      className={`w-full bg-gray-950/60 border ${error ? 'border-red-500' : 'border-gray-700/50'} text-white p-3 pl-7 rounded-xl text-sm focus:ring-2 focus:ring-green-500/50 outline-none placeholder-gray-600`}
                      placeholder="0.00"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs sm:hidden mt-1">{error}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
};

export default GameForm;