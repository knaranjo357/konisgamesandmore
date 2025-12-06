import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How long does it take to add a suggested game?',
    answer: 'We typically review game suggestions within 1-2 weeks. If we decide to add the game to our collection, it may take an additional 2-4 weeks to create and test the reproduction ensuring top quality.'
  },
  {
    question: 'Will I be notified if my suggestion is added?',
    answer: 'Yes! If you provide your email address, we\'ll notify you immediately when the game becomes available in our shop so you don\'t miss out.'
  },
  {
    question: 'Are there any games you can\'t reproduce?',
    answer: 'Some games with specialized hardware (like solar sensors) or complex protection mechanisms may be difficult to reproduce. Additionally, we focus on older retro games and typically do not reproduce modern titles.'
  },
  {
    question: 'Can I suggest manuals for games?',
    answer: 'Absolutely! We\'re happy to reproduce manuals as well to complete your collection. Just specify in your request that you\'re looking for a manual.'
  }
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about our reproduction games and shipping policies.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-gray-800/80 border-purple-500/50 shadow-lg shadow-purple-900/20' 
                    : 'bg-gray-800/40 border-white/5 hover:border-purple-500/30 hover:bg-gray-800/60'
                }`}
              >
                <button
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${
                    isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`ml-4 p-2 rounded-full transition-all duration-300 ${
                    isOpen ? 'bg-purple-600 text-white rotate-180' : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
                
                <div 
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                      <div className="pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;