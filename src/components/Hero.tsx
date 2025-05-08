import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="relative pt-32 pb-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800"
    >
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg')] bg-cover bg-center opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900"></div>
      <div className="container mx-auto px-4 relative">
        <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Retro Gaming Paradise
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300/90 max-w-3xl mx-auto leading-relaxed font-light">
            Discover our handpicked collection of classic games, meticulously reproduced for modern gamers
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <a 
              href="#shop" 
              className="group relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 text-center min-w-[220px] shadow-lg shadow-purple-500/20"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </a>
            <a 
              href="#suggestion" 
              className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm text-purple-400 hover:text-white px-10 py-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 text-center min-w-[220px] border border-purple-500/30"
            >
              <span className="relative z-10">Request a Game</span>
              <div className="absolute inset-0 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 opacity-50"></div>
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-500 hover:translate-y-[-8px] hover:shadow-purple border border-gray-700/30 group hover:bg-gray-800/50">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg p-4 mb-6 w-16 group-hover:scale-110 transition-transform duration-500">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg transform -rotate-12"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                Rare Gems Await
              </h3>
              <p className="text-gray-300/90 mb-6 leading-relaxed">
                From obscure Japanese exclusives to legendary limited releases - find your holy grail
              </p>
              <a 
                href="#rare-games" 
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium group-hover:translate-x-2 transition-transform duration-500"
              >
                View Rare Games
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-500 hover:translate-y-[-8px] hover:shadow-purple border border-gray-700/30 group hover:bg-gray-800/50">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg p-4 mb-6 w-16 group-hover:scale-110 transition-transform duration-500">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg transform rotate-45"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                New Arrivals
              </h3>
              <p className="text-gray-300/90 mb-6 leading-relaxed">
                Fresh additions to our catalog - classic titles restored and ready for your collection
              </p>
              <a 
                href="#new-arrivals" 
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium group-hover:translate-x-2 transition-transform duration-500"
              >
                Browse New Games
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-500 hover:translate-y-[-8px] hover:shadow-purple border border-gray-700/30 group hover:bg-gray-800/50">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg p-4 mb-6 w-16 group-hover:scale-110 transition-transform duration-500">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg transform rotate-12"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                Complete Your Collection
              </h3>
              <p className="text-gray-300/90 mb-6 leading-relaxed">
                Premium quality reproduction manuals and boxes to perfect your retro gaming shrine
              </p>
              <a 
                href="#manuals" 
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium group-hover:translate-x-2 transition-transform duration-500"
              >
                Browse Manuals
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;