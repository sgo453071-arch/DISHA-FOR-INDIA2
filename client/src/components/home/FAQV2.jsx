import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../../constants/homeData';

const FAQItem = ({ question, answer, isOpen, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className={`border border-dfi-border rounded-[20px] overflow-hidden transition-shadow duration-300 ${
      isOpen ? 'shadow-soft' : 'hover:shadow-soft'
    }`}
  >
    <button
      className="w-full flex justify-between items-center text-left px-6 py-5 bg-white hover:bg-dfi-soft/50 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dfi-coral"
      onClick={onClick}
      aria-expanded={isOpen}
    >
      <span className="font-dfi-heading font-semibold text-base md:text-lg text-dfi-dark pr-4">
        {question}
      </span>
      <ChevronDown
        className={`shrink-0 w-5 h-5 text-dfi-coral transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
        aria-hidden="true"
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-5 pt-1 font-dfi-body text-dfi-gray leading-relaxed text-sm md:text-base bg-white border-t border-dfi-border/50">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQV2 = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <section className="py-24 md:py-32 bg-dfi-soft">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block font-dfi-body text-sm font-semibold tracking-widest uppercase text-dfi-coral mb-4">
            Help Center
          </span>
          <h2 className="font-dfi-heading font-extrabold text-4xl md:text-5xl text-dfi-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-dfi-body text-dfi-gray text-lg max-w-xl mx-auto">
            Everything you need to know about volunteering, donations, and partnering with Disha for India.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((item, idx) => (
            <FAQItem
              key={idx}
              index={idx}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === idx}
              onClick={() => toggle(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQV2;
