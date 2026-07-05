import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Medal, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTopVolunteers } from '../../services/gamificationService';

// Helper function to safely slice arrays
const safeSlice = (arr, limit) => {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, limit);
};

const LeaderboardPreviewV2 = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await getTopVolunteers(5);
        const leadersArray = res?.success && Array.isArray(res.data) ? res.data : [];
        setLeaders(leadersArray);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setLeaders([]);
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-dfi-white border-y border-dfi-border">
        <div className="max-w-[1280px] mx-auto px-6 flex justify-center">
          <div className="w-16 h-16 border-4 border-dfi-coral border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (!leaders || leaders.length < 3) {
    return null;
  }

  const podiumData = [
    { ...leaders[1], rank: 2, height: 'h-48', color: 'bg-dfi-sage', text: 'text-white', icon: <Medal size={24} className="text-white" /> },
    { ...leaders[0], rank: 1, height: 'h-64', color: 'bg-dfi-coral', text: 'text-white', icon: <Trophy size={32} className="text-white" /> },
    { ...leaders[2], rank: 3, height: 'h-40', color: 'bg-dfi-dark', text: 'text-white', icon: <Award size={24} className="text-white" /> }
  ];

  const remainingLeaders = safeSlice(leaders, 3);

  return (
    <section className="py-24 bg-dfi-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <span className="font-dfi-script text-dfi-coral text-2xl md:text-3xl block mb-2">
              Hall of Fame
            </span>
            <h2 className="font-dfi-heading font-extrabold text-4xl md:text-5xl text-dfi-dark mb-6">
              Our Top Volunteers
            </h2>
            <p className="font-dfi-body text-lg text-dfi-gray mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              Meet the most dedicated changemakers in the country. Our gamified platform rewards consistency, impact, and dedication.
            </p>
            <Link to="/leaderboard" className="inline-flex items-center gap-2 px-8 py-4 bg-dfi-dark hover:bg-dfi-coral text-white rounded-xl font-dfi-heading font-bold transition-all shadow-lg hover:-translate-y-1 group">
              View Full Leaderboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-10 items-center justify-center lg:justify-end">
            
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
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-xl bg-dfi-soft flex items-center justify-center text-dfi-dark font-dfi-heading font-bold text-xl">
                        {user.name ? user.name.charAt(0) : '?'}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      {user.icon}
                    </div>
                  </div>
                  
                  <div className={`w-24 md:w-32 ${user.height} ${user.color} rounded-t-3xl shadow-inner flex flex-col items-center pt-4 relative overflow-hidden transition-all duration-300`}>
                    <span className={`font-dfi-heading text-3xl font-bold ${user.text}`}>{user.rank}</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                  
                  <div className="text-center mt-4 w-24 md:w-32">
                    <p className="font-dfi-heading font-bold text-dfi-dark text-sm line-clamp-1">{user.name || 'Anonymous'}</p>
                    <p className="font-dfi-body text-xs text-dfi-coral font-bold mt-0.5">{(user.points ?? 0)} pts</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {remainingLeaders.length > 0 && (
              <div className="w-full md:w-64 flex flex-col gap-3">
                <h4 className="font-dfi-heading font-bold text-dfi-gray uppercase tracking-widest text-xs mb-2">Rising Stars</h4>
                {remainingLeaders.map((user, idx) => (
                  <motion.div 
                    key={user.id || idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    className="flex items-center gap-4 bg-dfi-soft p-3 rounded-2xl border border-dfi-border hover:border-dfi-coral/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-dfi-heading font-bold text-dfi-gray text-sm shadow-sm">
                      {idx + 4}
                    </div>
                    <div className="flex-1">
                      <p className="font-dfi-heading font-bold text-dfi-dark text-sm line-clamp-1">{user.name || 'Anonymous'}</p>
                      <p className="font-dfi-body text-xs text-dfi-gray flex items-center gap-1 mt-0.5">
                        <Star size={10} className="text-dfi-coral fill-dfi-coral" /> {(user.points ?? 0)} pts
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

export default LeaderboardPreviewV2;
