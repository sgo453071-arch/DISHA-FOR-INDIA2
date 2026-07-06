import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '../../constants/homeData';
import './FAQ.css';

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className={`faq-card ${isOpen ? 'is-open' : ''}`}>
      <button 
        className="faq-trigger"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="faq-question">
          {faq.question}
        </span>
        <div className="faq-icon-wrap">
          <ChevronDown size={24} />
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="faq-answer-wrap">
              <p className="faq-answer">
                {faq.answer}
              </p>
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
    <section className="faq-section" aria-labelledby="faq-heading">
      
      {/* Decorative background elements */}
      <div className="faq-deco-blob" aria-hidden="true" />
      <div className="faq-deco-dots" aria-hidden="true">
         <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
           <defs>
             <pattern id="faqDotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="2" fill="#000000" />
             </pattern>
           </defs>
           <rect width="150" height="150" fill="url(#faqDotPattern)" />
         </svg>
      </div>

      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-accent">Need Help?</span>
          <h2 id="faq-heading" className="faq-title">
            Common Questions
          </h2>
          <p className="faq-desc">
            Everything you need to know before joining Disha for India.
          </p>
        </div>

        <div className="faq-frame">
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
