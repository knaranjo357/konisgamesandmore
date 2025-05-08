import React, { useState } from 'react';

const consoleOptions = [
  'Select Console',
  'NES',
  'Super Nintendo',
  'Nintendo 64',
  'GameCube',
  'PlayStation',
  'PlayStation 2',
  'Sega Genesis',
  'Sega Saturn',
  'Sega CD',
  'Dreamcast',
  'Atari Jaguar',
  'Turbo Grafx',
  'Gameboy Color'
];

const RequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gameTitle: '',
    console: consoleOptions[0],
    additionalInfo: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        gameTitle: '',
        console: consoleOptions[0],
        additionalInfo: ''
      });
      
      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <section id="suggestion" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Request A Game or Manual</h2>
            <p className="text-gray-300 mb-8 text-center">
              Can't find what you're looking for? Let us know what game or manual you need!
            </p>
            
            {submitted ? (
              <div className="bg-green-500/20 text-green-200 p-4 rounded-lg text-center animate-fadeIn">
                Thank you for your request! We'll review it and get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="gameTitle"
                    placeholder="Game/Manual Title"
                    required
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.gameTitle}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <select
                    name="console"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.console}
                    onChange={handleChange}
                  >
                    {consoleOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <textarea
                    name="additionalInfo"
                    placeholder="Additional Information"
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors ${
                      submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestForm;