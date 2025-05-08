import React, { useState, useEffect } from 'react';
import { fetchGames } from '../api/gameService';
import { Game } from '../types';
import GameCard from './GameCard';

const TopRatedGames: React.FC = () => {
  const [topRated, setTopRated] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const games = await fetchGames();
        // Sort by rating (highest first) and take top 4
        const sortedGames = [...games].sort((a, b) => 
          Number(b.rating) - Number(a.rating)
        ).slice(0, 4);
        
        setTopRated(sortedGames);
        setError(null);
      } catch (err) {
        setError('Failed to load games. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []); // Empty dependency array to run only once

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Top Rated Games</h2>
        
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg max-w-md mx-auto text-center">
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topRated.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopRatedGames;