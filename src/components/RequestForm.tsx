import React, { useState } from 'react';

const consoleOptions = [
  'Select Console', 'NES', 'Super Nintendo', 'Nintendo 64', 'GameCube', 'PlayStation',
  'PlayStation 2', 'Sega Genesis', 'Sega Saturn', 'Sega CD', 'Dreamcast',
  'Atari Jaguar', 'Turbo Grafx', 'Gameboy Color'
];

const RequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', gameTitle: '', console: consoleOptions[0], additionalInfo: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (formData: any) => {
    try {
      const response = await fetch('https://n8n.alliasoft.com/webhook/konisgamesandmore/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           to: 'jfpcontracting00@gmail.com',
           subject: `New Game Request: ${formData.gameTitle}`,
           message: `Name: ${formData.name}\nEmail: ${formData.email}\nGame: ${formData.gameTitle}\nConsole: ${formData.console}\nInfo: ${formData.additionalInfo}`
        }),
      });
      if (!response.ok) throw new Error('Failed');
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendEmail(formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', gameTitle: '', console: consoleOptions[0], additionalInfo: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) { console.error(error); } finally { setSubmitting(false); }
  };

  const inputClass = "w-full bg-gray-900/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500";

  return (
    <section id="suggestion" className="py-24 bg-gray-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Request A Game or Manual</h2>
              <p className="text-gray-400">
                Can't find a classic? We specialize in hunting down the rare ones.
              </p>
            </div>
            
            {submitted ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-xl text-center animate-fade-in flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Request Received!</h3>
                <p>We'll look into it and email you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">Your Name</label>
                    <input type="text" name="name" required className={inputClass} value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div>
                     <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">Email Address</label>
                    <input type="email" name="email" required className={inputClass} value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">Game / Manual Title</label>
                    <input type="text" name="gameTitle" required className={inputClass} value={formData.gameTitle} onChange={handleChange} placeholder="e.g. Earthbound" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">System</label>
                    <select name="console" className={inputClass} value={formData.console} onChange={handleChange}>
                      {consoleOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                   <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">Extra Details</label>
                  <textarea name="additionalInfo" rows={4} className={inputClass} value={formData.additionalInfo} onChange={handleChange} placeholder="Any specific version or region?"></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 transform hover:-translate-y-0.5 ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Sending Request...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestForm;