import React from 'react';
import { Game, PRICE_CATEGORIES } from '../../types';
import { Search, SortAsc, SortDesc, ChevronLeft, ChevronRight, Filter, X, Edit2, Trash2 } from 'lucide-react';

interface GamesListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (rowNumber: number) => void;
  consoles: string[];
  onConsoleChange?: (console: string) => void;
  loading?: boolean;
}

const GamesList: React.FC<GamesListProps> = ({ 
  games, 
  onEdit, 
  onDelete, 
  consoles,
  onConsoleChange,
  loading = false
}) => {
  const [selectedConsole, setSelectedConsole] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<'name' | 'cover' | 'rating' | 'console'>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(12);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleConsoleChange = (console: string) => {
    setSelectedConsole(console);
    setCurrentPage(1);
    setShowMobileFilters(false);
    if (onConsoleChange) {
      onConsoleChange(console);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const filteredAndSortedGames = games
    .filter(game => {
      const matchesConsole = selectedConsole === 'all' || game.console === selectedConsole;
      const matchesSearch = searchQuery === '' || 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesConsole && matchesSearch;
    })
    .sort((a, b) => {
      const aValue = String(a[sortField]);
      const bValue = String(b[sortField]);
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = filteredAndSortedGames.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Games Inventory</h2>
        <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
          {filteredAndSortedGames.length} Items
        </span>
      </div>
      
      {/* ================= MOBILE FILTERS ================= */}
      <div className="md:hidden mb-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-950/60 border border-gray-700/50 p-3.5 pl-11 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="bg-gray-800/80 border border-gray-700/50 text-white px-4 py-3 rounded-xl transition-all hover:bg-gray-700 flex items-center justify-center min-w-[56px]"
          >
            {showMobileFilters ? <X className="w-5 h-5 text-red-400" /> : <Filter className="w-5 h-5 text-purple-400" />}
          </button>
        </div>

        {showMobileFilters && (
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">Console</label>
              <select
                value={selectedConsole}
                onChange={(e) => handleConsoleChange(e.target.value)}
                className="w-full bg-gray-950/60 border border-gray-700/50 text-white p-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none"
              >
                <option value="all">🎮 All Consoles</option>
                {consoles.map((console, index) => (
                  <option key={index} value={console}>{console}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">Sort By</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('name')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all text-sm font-medium border ${
                    sortField === 'name' 
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                      : 'bg-gray-950/40 border-gray-700/50 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                </button>
                <button
                  onClick={() => handleSort('console')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all text-sm font-medium border ${
                    sortField === 'console' 
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                      : 'bg-gray-950/40 border-gray-700/50 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  Console {sortField === 'console' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">Items Per Page</label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="w-full bg-gray-950/60 border border-gray-700/50 text-white p-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none"
              >
                <option value={6}>6 items</option>
                <option value={12}>12 items</option>
                <option value={24}>24 items</option>
                <option value={48}>48 items</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ================= DESKTOP FILTERS ================= */}
      <div className="hidden md:flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="Search by title, condition..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-950/60 border border-gray-700/50 p-3.5 pl-11 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
          </div>
          
          <select
            value={selectedConsole}
            onChange={(e) => handleConsoleChange(e.target.value)}
            className="bg-gray-950/60 border border-gray-700/50 text-white p-3.5 rounded-xl min-w-[200px] focus:ring-2 focus:ring-purple-500/50 outline-none transition-all cursor-pointer"
          >
            <option value="all">🎮 All Consoles</option>
            {consoles.map((console, index) => (
              <option key={index} value={console}>{console}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center bg-gray-800/30 p-2 rounded-xl border border-gray-700/30">
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortField === 'name' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Title {sortField === 'name' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
            </button>
            <button
              onClick={() => handleSort('console')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortField === 'console' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Console {sortField === 'console' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
            </button>
          </div>

          <div className="flex items-center gap-3 px-3">
            <span className="text-gray-400 text-sm font-medium">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="bg-gray-900/50 border border-gray-700 text-white px-2.5 py-1.5 rounded-lg focus:ring-2 focus:ring-purple-500/50 outline-none text-sm cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Desktop Pagination Summary */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-1">
            <div className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{Math.min(startIndex + 1, filteredAndSortedGames.length)}</span> to <span className="text-white font-medium">{Math.min(endIndex, filteredAndSortedGames.length)}</span> of <span className="text-white font-medium">{filteredAndSortedGames.length}</span> games
            </div>

            <div className="flex items-center gap-1.5 bg-gray-900/40 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= GAMES GRID ================= */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-10 flex-1">
          {currentGames.length === 0 ? (
            <div className="text-center bg-gray-800/20 border border-gray-800/80 border-dashed rounded-3xl py-16 flex flex-col items-center">
              <Search className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium text-lg">No games found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            currentGames.map(game => (
              <div 
                key={game.id} 
                className="group relative bg-gray-800/40 border border-gray-700/50 hover:border-purple-500/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col sm:flex-row gap-5"
              >
                {/* Image Section */}
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <div className="w-32 h-32 sm:w-28 sm:h-32 rounded-xl overflow-hidden shadow-lg border border-gray-700 bg-gray-900">
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/logokonisgames.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  {game.isBestSeller && (
                    <span className="absolute -top-3 -right-3 sm:-left-3 sm:right-auto bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20">
                      🔥 HOT
                    </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                        {game.name}
                      </h3>
                      <div className="inline-block bg-gray-900/60 border border-gray-700/50 text-gray-300 text-xs px-2.5 py-1 rounded-md mt-1 font-medium tracking-wide">
                        {game.console}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Grid (Compact) */}
                  <div className="mt-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2 pt-3">
                    {PRICE_CATEGORIES.map(category => (
                      game[category.value] && (
                        <div key={category.value} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                          <span className="text-xs text-gray-400">{category.label}:</span>
                          <span className="text-sm font-semibold text-white">${game[category.value]}</span>
                        </div>
                      )
                    ))}
                    {/* Custom Pricing Fields */}
                    {['price1', 'price2', 'price3', 'price4', 'price5', 'price6', 'price7', 'price8'].map((field) => {
                      const value = game[field as keyof Game];
                      if (value && typeof value === 'string') {
                        const [name, price] = value.split('-');
                        if (name && price) {
                          return (
                            <div key={field} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]"></span>
                              <span className="text-xs text-gray-400 truncate max-w-[80px]" title={name}>{name}:</span>
                              <span className="text-sm font-semibold text-white">${price}</span>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>

                  {/* Actions (Visible on hover in Desktop, Always visible in Mobile) */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/30 sm:border-none sm:pt-0 sm:mt-0 sm:absolute sm:top-4 sm:right-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => onEdit(game)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    >
                      <Edit2 className="w-4 h-4" /> <span className="sm:hidden">Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(game.row_number)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> <span className="sm:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= MOBILE BOTTOM PAGINATION ================= */}
      {!loading && totalPages > 1 && (
        <div className="md:hidden mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-900/40 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) pageNum = i + 1;
                else if (currentPage <= 2) pageNum = i + 1;
                else if (currentPage >= totalPages - 1) pageNum = totalPages - 2 + i;
                else pageNum = currentPage - 1 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-gray-500 text-xs font-medium">
            Showing {Math.min(startIndex + 1, filteredAndSortedGames.length)}-{Math.min(endIndex, filteredAndSortedGames.length)} of {filteredAndSortedGames.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesList;