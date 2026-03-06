import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { fetchGames, fetchGamesByConsole } from '../api/gameService';
import GameForm from './admin/GameForm';
import GamesList from './admin/GamesList';
import CustomersSection from './admin/CustomersSection';
import { Users, Package, Gamepad2, LogOut } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  
  // SOLUCIÓN AL ERROR DE TYPE: Usamos <any> para que TypeScript no bloquee los campos extra como 'cover', 'manual', etc.
  const [formData, setFormData] = useState<any>({
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
      setGamesLoading(true);
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
    } catch (err) { // SOLUCIÓN: Cambiado a 'err' para que no choque con el state 'error'
      console.error('Error loading games:', err);
      setError('Failed to load games');
    } finally {
      setLoading(false);
      setGamesLoading(false);
    }
  };

  const loadGamesByConsole = async (console: string) => {
    if (console === 'all') {
      await loadGames();
      return;
    }

    try {
      setGamesLoading(true);
      const consoleGames = await fetchGamesByConsole(console);
      const uniqueGames = consoleGames.reduce((acc: Game[], current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setGames(uniqueGames);
      setError('');
    } catch (err) {
      console.error('Error loading games by console:', err);
      setError('Failed to load games for this console');
    } finally {
      setGamesLoading(false);
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
        name: '', cover: '', game: '', manual: '', cover_case_game: '', complete_with_game: '',
        price1: '', price2: '', price3: '', imageUrl: '', imageUrl2: '', imageUrl3: '',
        console: '', console_url: '', isBestSeller: false, description: ''
      });
      setError('');
    } catch (err) {
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
      } catch (err) {
        setError('Failed to delete game');
      }
    }
  };

  const handleEdit = (game: Game) => {
    setFormData(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!formData.id && games.length > 0) {
      const maxId = Math.max(...games.map(g => g.id), 0);
      setFormData(prev => ({ ...prev, id: maxId + 1 }));
    }
  }, [games, formData.id]);

  /* ================== RENDERIZADO ================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] relative flex items-center justify-center overflow-hidden">
        {/* Efectos de luces de fondo (Blur) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="bg-gray-900/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-800/50 max-w-md w-full z-10 mx-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl border border-purple-500/30">
              <Gamepad2 className="w-10 h-10 text-purple-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Admin Panel
          </h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="block w-2 h-2 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Email Address</label>
              <input
                type="email"
                value={authForm.email}
                onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-gray-950/50 border border-gray-800 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Password</label>
              <input
                type="password"
                value={authForm.password}
                onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-gray-950/50 border border-gray-800 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      {/* Navbar Superior */}
      <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-lg border-b border-gray-800/60">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/20">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Koni's Dashboard</h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                setIsAuthenticated(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-transparent hover:border-red-400/20 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Selector de Pestañas (Tabs) */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-900/80 p-1.5 rounded-2xl inline-flex shadow-inner border border-gray-800/50">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Package className="w-5 h-5" />
              Games Catalog
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'customers'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Users className="w-5 h-5" />
              Customers
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-2">
            <span className="block w-2 h-2 bg-red-500 rounded-full"></span>
            {error}
          </div>
        )}
        
        {activeTab === 'games' ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Columna Izquierda: Formulario (Más angosta) */}
            <div className="xl:col-span-4 2xl:col-span-3">
              <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 p-6 rounded-3xl shadow-xl sticky top-28">
                <GameForm
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  consoles={consoles}
                  isEditing={!!formData.id}
                />
              </div>
            </div>

            {/* Columna Derecha: Lista de Juegos (Más ancha) */}
            <div className="xl:col-span-8 2xl:col-span-9">
              <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 p-6 rounded-3xl shadow-xl min-h-[600px]">
                <GamesList
                  games={games}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  consoles={consoles.map(c => c.name)}
                  onConsoleChange={loadGamesByConsole}
                  loading={gamesLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 p-6 rounded-3xl shadow-xl min-h-[600px]">
            <CustomersSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;