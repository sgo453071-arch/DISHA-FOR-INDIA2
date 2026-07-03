import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '../../constants/homeData';

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button 
        className="w-full py-8 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className={`font-heading text-xl md:text-2xl font-bold pr-8 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-heading group-hover:text-primary'}`}>
          {faq.question}
        </span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pr-12 text-lg text-body leading-relaxed font-light">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-20">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-heading mb-4">
            Common Questions
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-body">
            Everything you need to know about joining the Disha for India movement.
          </p>
        </div>

        <div className="bg-white">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              faq={faq} 
              isOpen={openIndex === index} 
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
