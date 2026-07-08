import React, { useState, useEffect } from 'react';
import { safeSlice } from '../../utils/safeSlice';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Medal, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTopVolunteers } from '../../services/gamificationService';

const LeaderboardPreview = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await getTopVolunteers(5);
        // Extract the array from the API response
        const leadersArray = res?.success && Array.isArray(res.data) ? res.data : [];
        setLeaders(leadersArray);
        setLoading(false);
      } catch (err) {
        // Gracefully hide the section on error
        console.error('Failed to fetch leaderboard:', err);
        setLeaders([]);
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl flex justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  // Handle empty state gracefully
  if (!leaders || leaders.length < 3) {
    return null; // Hide section if not enough data for podium
  }

  // Rearrange for Podium: [2nd, 1st, 3rd]
  const podiumData = [
    { ...leaders[1], rank: 2, height: 'h-48', color: 'bg-gray-200', text: 'text-gray-600', icon: <Medal size={24} className="text-gray-500" /> },
    { ...leaders[0], rank: 1, height: 'h-64', color: 'bg-accent', text: 'text-white', icon: <Trophy size={32} className="text-white" /> },
    { ...leaders[2], rank: 3, height: 'h-40', color: 'bg-orange-200', text: 'text-orange-800', icon: <Award size={24} className="text-orange-700" /> }
  ];

  const remainingLeaders = safeSlice(leaders, 3);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Info */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-heading mb-4">
              Hall of Fame
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto lg:mx-0 mb-6 rounded-full"></div>
            <p className="text-lg text-body mb-8 leading-relaxed">
              Meet the most dedicated changemakers in the country. Our gamified platform rewards consistency, impact, and dedication.
            </p>
            <Link to="/leaderboard" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group">
              View Full Leaderboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Side: Podium + List */}
          <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-10 items-center justify-center lg:justify-end">
            
            {/* Podium */}
            <div className="flex items-end justify-center gap-4 h-80 pt-10">
              {podiumData.map((user, idx) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="relative mb-4 z-10 group-hover:-translate-y-2 transition-transform">
                    {user?.avatar ? (
                      <img src={user?.avatar} alt={user?.name || 'User'} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center text-heading font-bold text-xl">
                        {user?.name ? user.name.charAt(0) : '?'}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      {user.icon}
                    </div>
                  </div>
                  
                  <div className={`w-24 md:w-32 ${user.height} ${user.color} rounded-t-2xl shadow-inner flex flex-col items-center pt-4 relative overflow-hidden transition-all duration-300 group-hover:brightness-105`}>
                    <span className={`font-heading text-3xl font-bold ${user.text}`}>{user.rank}</span>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                  
                  <div className="text-center mt-4 w-24 md:w-32">
                    <p className="font-bold text-heading text-sm line-clamp-1">{user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-primary font-bold">{(user.points ?? 0)} pts</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Remaining List (4th & 5th) */}
            {remainingLeaders.length > 0 && (
              <div className="w-full md:w-64 flex flex-col gap-3">
                <h4 className="font-heading font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">Rising Stars</h4>
                {remainingLeaders.map((user, idx) => (
                  <motion.div 
                    key={user.id || idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    className="flex items-center gap-4 bg-brandBg p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-gray-500 text-sm shadow-sm">
                      {idx + 4}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-heading text-sm line-clamp-1">{user?.name || 'Anonymous'}</p>
                      <p className="text-xs text-body flex items-center gap-1">
                        <Star size={10} className="text-accent fill-accent" /> {(user.points ?? 0)} pts
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPreview;