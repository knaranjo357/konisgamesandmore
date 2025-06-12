import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="refund" className="bg-gray-900 py-12 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Konis Games<br/>and More
            </h3>
            <p className="text-gray-400 mb-4">
              Your gateway to timeless classics. We offer high-quality reproduction games for retro consoles at affordable prices.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#shop" className="hover:text-purple-400 transition-colors">Shop</a></li>
              <li><a href="#suggestion" className="hover:text-purple-400 transition-colors">Suggestion Box</a></li>
              <li><a href="#refund" className="hover:text-purple-400 transition-colors">Refund & Returns Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Console Categories</h4>
            <ul className="space-y-2 grid grid-cols-2">
              <li><a href="#" className="hover:text-purple-400 transition-colors">NES</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">SNES</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">N64</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">GameCube</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">PlayStation</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">PlayStation 2</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Sega Genesis</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Sega Saturn</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <address className="not-italic">
              <p className="mb-4">
                <a href="mailto:jfpcontracting00@gmail.com" className="text-purple-400 hover:text-purple-300">
                  jfpcontracting00@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>© 2025 Konis Games and More. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;