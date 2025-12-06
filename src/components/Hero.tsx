import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex items-center justify-center bg-gray-900 overflow-hidden"
    >
      {/* Background with better overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://external-preview.redd.it/-tdsH0dYAyxmliFvvlrqfSQ-9i_Nqsqobi9c7Zwgznc.jpg?auto=webp&s=5dc0d71cdcd8dcca22d9eeee3ce500f45a66403c')] bg-cover bg-center scale-105 blur-[2px] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-purple-900/30"></div>
        {/* Animated grid overlay effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
          
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
            <span className="text-purple-300 text-sm font-semibold tracking-wider uppercase">High Quality Reproductions</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-white tracking-tight leading-tight drop-shadow-2xl">
            Retro Gaming <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient bg-300%">
              Paradise
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl font-light mb-10 text-gray-300 max-w-2xl leading-relaxed drop-shadow-md">
            Welcome! Note that we’re updating prices. Need a specific title or need help? 
            <span className="text-white font-medium"> Tap the chat bubble</span> — we are here to preserve the classics.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <a 
              href="#shop" 
              className="px-8 py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg shadow-white/10"
            >
              Start Shopping
            </a>
            <a 
              href="#suggestion" 
              className="group relative overflow-hidden px-8 py-4 rounded-xl bg-purple-600 text-white font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Contact Us
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;