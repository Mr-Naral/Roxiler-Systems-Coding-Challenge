import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Star, Users, TrendingUp } from 'lucide-react';

export default function OwnerDashboard() {
  const [data, setData] = useState({ storeName: 'Loading...', avgRating: 0, ratings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/owner/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching owner stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar title="Owner Portal" role="Store Owner" />
      
      <div className="max-w-6xl mx-auto p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            {data.storeName}
          </h1>
          <p className="text-slate-400 mt-2">Manage your store reputation</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
         
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Average Rating</p>
              <div className="flex items-baseline mt-2">
                <span className="text-6xl font-bold text-white">{data.avgRating}</span>
                <span className="text-2xl text-slate-500 ml-2">/ 5</span>
              </div>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-full">
              <Star size={40} className="text-yellow-400" fill="currentColor" />
            </div>
          </motion.div>

         
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Total Feedbacks</p>
              <div className="flex items-baseline mt-2">
                <span className="text-6xl font-bold text-white">{data.ratings.length}</span>
                <span className="text-lg text-slate-500 ml-2">Users</span>
              </div>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-full">
              <Users size={40} className="text-blue-400" />
            </div>
          </motion.div>
        </div>

    
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-2">
            <TrendingUp className="text-emerald-400" />
            <h2 className="text-xl font-bold">Recent Customer Feedback</h2>
          </div>

          <table className="w-full text-left">
            <thead className="bg-black/20 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-5">Customer Name</th>
                <th className="p-5">Email</th>
                <th className="p-5">Rating</th>
                <th className="p-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.ratings.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No ratings yet.</td></tr>
              ) : (
                data.ratings.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="p-5 font-medium">{item.userName}</td>
                    <td className="p-5 text-slate-400">{item.userEmail}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.rating >= 4 ? 'bg-green-500/20 text-green-300' : 
                        item.rating === 3 ? 'bg-yellow-500/20 text-yellow-300' : 
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {item.rating} Stars
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}