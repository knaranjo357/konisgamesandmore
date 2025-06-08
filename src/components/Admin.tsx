import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { fetchGames } from '../api/gameService';
import GameForm from './admin/GameForm';
import GamesList from './admin/GamesList';
import CustomersSection from './admin/CustomersSection';
import { Users, Package } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState<Partial<Game>>({
    name: '',
    cover: '',
    game: '',
    manual: '',
    cover_case_game: '',
    complete_with_game: '',
    price1: '',
    price2: '',
    price3: '',
    imageUrl: '',
    imageUrl2: '',
    imageUrl3: '',
    console: '',
    console_url: '',
    isBestSeller: false,
    description: ''
  });
  const [error, setError] = useState('');
  const [consoles, setConsoles] = useState<{ name: string; url: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'games' | 'customers'>('games');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadGames();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const uniqueConsoles = Array.from(new Set(games.map(game => ({
        name: game.console,
        url: game.console_url
      })))).reduce((acc, curr) => {
        if (!acc.find(c => c.name === curr.name)) {
          acc.push(curr);
        }
        return acc;
      }, [] as { name: string; url: string }[]);
      setConsoles(uniqueConsoles);
    }
  }, [games]);

  const loadGames = async () => {
    try {
      const data = await fetchGames();
      const uniqueGames = data.reduce((acc: Game[], current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setGames(uniqueGames);
    } catch (error) {
      console.error('Error loading games:', error);
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.email === 'jfpcontracting00@gmail.com' && authForm.password === 'Michigangobills#99') {
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
      // Calculate new ID if not editing
      if (!formData.id) {
        const maxId = Math.max(...games.map(g => g.id), 0);
        formData.id = maxId + 1;
      }

      const response = await fetch('https://n8n.alliasoft.com/webhook/konisgamesandmore/games', {
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
        id: Math.max(...games.map(g => g.id), 0) + 1,
        name: '',
        cover: '',
        game: '',
        manual: '',
        cover_case_game: '',
        complete_with_game: '',
        price1: '',
        price2: '',
        price3: '',
        imageUrl: '',
        imageUrl2: '',
        imageUrl3: '',
        console: '',
        console_url: '',
        isBestSeller: false,
        description: ''
      });
      setError('');
    } catch (error) {
      setError('Failed to save game');
    }
  };

  const handleDelete = async (rowNumber: number) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        const response = await fetch('https://n8n.alliasoft.com/webhook/konisgamesandmore/games', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ row_number: rowNumber }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete game');
        }

        await loadGames();
        setError('');
      } catch (error) {
        setError('Failed to delete game');
      }
    }
  };

  const handleEdit = (game: Game) => {
    setFormData(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Set initial ID for new game form
  useEffect(() => {
    if (!formData.id && games.length > 0) {
      const maxId = Math.max(...games.map(g => g.id), 0);
      setFormData(prev => ({ ...prev, id: maxId + 1 }));
    }
  }, [games, formData.id]);

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

        {/* Tab Toggle */}
        <div className="flex mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'games'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Package className="w-5 h-5" />
              Games Catalog
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'customers'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
              Customers
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded mb-8">
            {error}
          </div>
        )}
        
        {activeTab === 'games' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <GameForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                consoles={consoles}
                isEditing={!!formData.id}
              />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <GamesList
                games={games}
                onEdit={handleEdit}
                onDelete={handleDelete}
                consoles={consoles.map(c => c.name)}
              />
            </div>
          </div>
        ) : (
          <CustomersSection />
        )}
      </div>
    </div>
  );
};

export default Admin;