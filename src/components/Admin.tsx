import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { fetchGames } from '../api/gameService';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState<Partial<Game>>({
    id: undefined,
    name: '',
    price: '',
    imageUrl: '',
    console: '',
    console_url: '',
    rating: 0,
    isBestSeller: false,
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadGames();
    } else {
      setLoading(false);
    }
  }, []);

  const loadGames = async () => {
    try {
      const data = await fetchGames();
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.email === 'admin@konisgames.net' && authForm.password === 'konisgamesandmore') {
      localStorage.setItem('adminToken', 'dummy-token');
      setIsAuthenticated(true);
      loadGames();
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If no ID is provided, find the highest ID and increment by 1
      if (!formData.id) {
        const maxId = Math.max(...games.map(g => g.id), 0);
        formData.id = maxId + 1;
      }

      const response = await fetch('https://proyecto-n8n.latiyp.easypanel.host/webhook/konisgamesandmore/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save game');
      }

      await loadGames();
      setFormData({
        id: undefined,
        name: '',
        price: '',
        imageUrl: '',
        console: '',
        console_url: '',
        rating: 0,
        isBestSeller: false,
        description: ''
      });
      setError('');
    } catch (error) {
      setError('Failed to save game');
    }
  };

  const handleEdit = (game: Game) => {
    setFormData(game);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {error && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={authForm.email}
                onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-gray-700 p-3 rounded focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <input
                type="password"
                value={authForm.password}
                onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-gray-700 p-3 rounded focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              setIsAuthenticated(false);
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded mb-8">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Add/Edit Game</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">ID</label>
                  <input
                    type="number"
                    name="id"
                    value={formData.id || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-700 p-3 rounded"
                    placeholder="Auto-generated if empty"
                  />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full bg-gray-700 p-3 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Console</label>
                  <input
                    type="text"
                    name="console"
                    value={formData.console}
                    onChange={handleChange}
                    className="w-full bg-gray-700 p-3 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full bg-gray-700 p-3 rounded"
                  required
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logokonisgames.png';
                      }}
                    />
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

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-medium transition-colors"
              >
                {formData.id ? 'Update Game' : 'Add Game'}
              </button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Games List</h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {games.map(game => (
                <div key={game.id} className="bg-gray-700 p-4 rounded-lg flex gap-4">
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logokonisgames.png';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{game.name}</h3>
                    <p className="text-gray-300">{game.console}</p>
                    <p className="text-purple-400">${game.price}</p>
                    <button
                      onClick={() => handleEdit(game)}
                      className="mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;