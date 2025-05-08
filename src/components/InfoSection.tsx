import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">Order Reproduction Games Online</h2>
          <p className="text-gray-300 mb-6">
            Welcome to Konis Games and More, your premier destination for high-quality reproduction games for retro consoles. We offer a wide selection of titles that are otherwise rare, expensive, or hard to find.
          </p>
          
          <p className="text-gray-300 mb-6">
            We offer reproduction games for the following systems:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Atari Jaguar
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Dreamcast
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Game Cube
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              N64
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              NES
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Gameboy Color
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              PS1
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              PS2
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Sega CD
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Sega Genesis
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Sega Saturn
            </div>
            <div className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Super Nintendo
            </div>
          </div>
          
          <p className="text-gray-300 mb-8">
            Can't find that game you're looking for? Please checkout our <a href="#suggestion" className="text-purple-400 hover:text-purple-300 underline">suggestion box</a>.
          </p>
          
          <h3 className="text-xl font-bold mb-4 text-white">What are reproduction games?</h3>
          <p className="text-gray-300 mb-6">
            Reproduction games (also known as repro games) are copies of original video games that are either rare, expensive, or hard to find. Our reproduction games are created with high-quality components to ensure durability and performance that closely matches the original games.
          </p>
          
          <p className="text-gray-300 mb-8">
            These games work on original hardware and provide an affordable way to experience rare classics without paying collector prices. All of our reproduction games come with a custom case and label.
          </p>
          
          <h3 className="text-xl font-bold mb-4 text-white">Gaming Manuals</h3>
          <p className="text-gray-300 mb-4">
            We also offer high-quality reproductions of original gaming manuals for many retro consoles. These manuals are professionally printed and bound to match the look and feel of the originals.
          </p>
          
          <p className="text-gray-300">
            Available for the same systems as our games, our manual reproductions are perfect for collectors or gamers who want the complete package for their favorite retro titles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;