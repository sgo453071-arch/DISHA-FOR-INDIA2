import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Handshake } from 'lucide-react';
import Button from '../common/Button';

const helpOptions = [
  {
    id: 'volunteer',
    title: 'Become a Volunteer',
    icon: Users,
    description: 'Join our network of passionate individuals creating real impact on the ground. Your time can change lives.',
    btnText: 'Start Volunteering',
    link: '/register',
    image: 'https://images.unsplash.com/photo-1593113565694-c74c4ed56f26?q=80&w=800&auto=format&fit=crop',
    color: 'text-dfi-coral'
  },
  {
    id: 'donate',
    title: 'Make a Donation',
    icon: Heart,
    description: 'Support our initiatives financially and help us reach more communities in need. Every contribution counts.',
    btnText: 'Donate Now',
    link: '/donate',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop',
    color: 'text-dfi-sage'
  },
  {
    id: 'partner',
    title: 'Partner NGO',
    icon: Handshake,
    description: "Collaborate with us to scale social impact and share valuable resources to build a better future.",
    btnText: 'Partner With Us',
    link: '/contact',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
    color: 'text-dfi-dark'
  }
];

const HelpCard = ({ option, reverse }) => {
  const Icon = option.icon;

  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-[24px] overflow-hidden shadow-sm border border-dfi-border/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}>

      {/* Image Section */}
      <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
        <img
          src={option.image}
          alt={option.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-dfi-soft/30 backdrop-blur-md">
        <div className="w-16 h-16 rounded-[16px] bg-white flex items-center justify-center mb-6 shadow-sm border border-dfi-border">
          <Icon size={32} className={`${option.color}`} />
        </div>

        <h3 className="font-dfi-heading font-bold text-3xl md:text-4xl text-dfi-dark mb-4">
          {option.title}
        </h3>

        <p className="font-dfi-body text-dfi-gray text-lg leading-relaxed mb-8 max-w-md">
          {option.description}
        </p>

        <div>
          <Button variant="primary" to={option.link}>
            {option.btnText}
          </Button>
        </div>
      </div>

    </div>
  );
};

const HowCanYouHelp = () => {
  return (
    <section className="py-24 md:py-32 bg-dfi-soft relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-dfi-heading font-bold text-4xl md:text-5xl text-dfi-dark mb-4"
          >
            How You Can Help
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-dfi-body text-dfi-gray text-lg md:text-xl max-w-2xl mx-auto"
          >
            There are many ways to make a difference. Choose how you want to contribute to the movement.
          </motion.p>
        </div>

        <div className="flex flex-col gap-10">
          {helpOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <HelpCard option={option} reverse={index % 2 !== 0} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowCanYouHelp;
