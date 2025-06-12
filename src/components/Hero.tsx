import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="relative pt-32 pb-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800"
    >
      <div className="absolute inset-0 bg-[url('https://th.bing.com/th/id/OIP.olR48hFBmoMi6F-4Ng551wHaE7?w=237&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/90"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col justify-center items-center text-center py-24">
          
          <h1 className="text-5xl md:text-7xl font-bold mb-12 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Konis Games and More
          </h1>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            
            <a 
              href="#consoles" 
              className="group relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 text-center min-w-[220px] shadow-lg shadow-purple-500/20"
            >
              <span className="relative z-10">Explore Consoles</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </a>

            <a 
              href="#shop" 
              className="group relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 text-center min-w-[220px] shadow-lg shadow-purple-500/20"
            >
              <span className="relative z-10">Explore Games</span>
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
        </div>
      </div>
    </section>
  );
};

export default Hero;