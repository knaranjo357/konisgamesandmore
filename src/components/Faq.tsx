import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How long does it take to add a suggested game?',
    answer: 'We typically review game suggestions within 1-2 weeks. If we decide to add the game to our collection, it may take an additional 2-4 weeks to create and test the reproduction.'
  },
  {
    question: 'Will I be notified if my suggestion is added?',
    answer: 'Yes! If you provide your email address, we\'ll notify you when the game becomes available in our shop.'
  },
  {
    question: 'Are there any games you can\'t reproduce?',
    answer: 'Some games with specialized hardware or complex protection mechanisms may be difficult to reproduce. Additionally, we focus on older retro games and may not be able to reproduce more modern titles.'
  },
  {
    question: 'Can I suggest manuals for games?',
    answer: 'Absolutely! We\'re happy to reproduce manuals as well. Just specify in your request that you\'re looking for a manual.'
  }
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'shadow-md shadow-purple-500/20' : ''
              }`}
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-purple-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-400" />
                )}
              </button>
              
              <div 
                className={`px-6 pb-4 text-gray-300 transition-all duration-300 ${
                  openIndex === index ? 'block opacity-100' : 'hidden opacity-0'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;