import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="relative pt-32 pb-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800"
    >
      <div className="absolute inset-0 bg-[url('https://external-preview.redd.it/-tdsH0dYAyxmliFvvlrqfSQ-9i_Nqsqobi9c7Zwgznc.jpg?auto=webp&s=5dc0d71cdcd8dcca22d9eeee3ce500f45a66403c')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/90"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col justify-center items-center text-center py-24">
          
          <h1 className="text-5xl md:text-7xl font-bold mb-12 text-white animate-gradient">
            Retro Gaming Paradise
          </h1>
          <p className="text-xl md:text-3xl font-medium mb-12 text-white max-w-2xl leading-relaxed">
      Welcome to our website! Please note that we’re still adjusting prices on
      some of our lower-end games. If you have any questions or need help
      finding a specific title, just tap the chat bubble — we’re here to help!
    </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <a 
              href="#suggestion" 
              className="group relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 text-center min-w-[220px] shadow-lg shadow-purple-500/20"
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
