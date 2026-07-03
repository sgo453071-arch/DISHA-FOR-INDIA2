import React from 'react';
import { motion } from 'framer-motion';
import { FileBadge, Trophy, Gift, Network, Briefcase, Zap } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Verifiable Certificates",
      desc: "Earn blockchain-backed certificates with unique QR codes for your resume and LinkedIn.",
      icon: <FileBadge size={28} className="text-blue-500" />
    },
    {
      title: "National Leaderboard",
      desc: "Compete with peers nationwide. Gain recognition as a top volunteer in your state.",
      icon: <Trophy size={28} className="text-yellow-500" />
    },
    {
      title: "Exclusive Rewards",
      desc: "Unlock badges, merchandise, and special invites to CSR events as you level up.",
      icon: <Gift size={28} className="text-pink-500" />
    },
    {
      title: "Professional Networking",
      desc: "Connect with NGO leaders, corporate CSR heads, and like-minded changemakers.",
      icon: <Network size={28} className="text-indigo-500" />
    },
    {
      title: "Field Experience",
      desc: "Gain hands-on experience in project management, leadership, and community building.",
      icon: <Briefcase size={28} className="text-orange-500" />
    },
    {
      title: "Skill Development",
      desc: "Learn new skills on the ground, from digital literacy to crisis management.",
      icon: <Zap size={28} className="text-green-500" />
    }
  ];

  return (
    <section className="py-24 bg-brandBg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/50 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-heading mb-4">
            Why Volunteer With Us?
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Your time is valuable. We make sure your efforts are recognized, rewarded, and verifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 border border-gray-100 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-heading mb-3">
                {benefit.title}
              </h3>
              <p className="text-body leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Benefits;
