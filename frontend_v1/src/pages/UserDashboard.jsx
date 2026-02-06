import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Star, MapPin, Search } from 'lucide-react';

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stores?search=${debouncedSearch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores");
    }
  };

  const rateStore = async (id, val) => {
    try {
      await axios.post('http://localhost:5000/api/rating', { storeId: id, rating: val }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStores(); 
    } catch (err) {
      alert("Failed to submit rating");
    }
  };

  
  useEffect(() => { fetchStores(); }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar title="Marketplace" role="User" />
      <div className="max-w-6xl mx-auto p-6">
        
       
        <div className="relative mb-8">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              className="w-full bg-slate-800 border border-slate-700 p-4 pl-12 rounded-xl text-lg outline-none focus:ring-2 ring-blue-500 text-white placeholder-slate-500 transition shadow-lg"
              placeholder="Search stores by name or address..."
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, i) => (
            <motion.div 
              key={store.id} 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-800 transition duration-300 shadow-xl"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">{store.name}</h3>
                <div className="flex items-center text-slate-400 mb-6">
                  <MapPin size={16} className="mr-2 text-blue-400" />
                  <p className="text-sm">{store.address}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Avg: {Number(store.avgRating).toFixed(1)}
                    </span>
                    <Star size={14} className="text-yellow-400 fill-current" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Your Rating</span>
                </div>
                
                <div className="flex justify-between gap-1 bg-black/20 p-2 rounded-lg">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => rateStore(store.id, star)}
                      className="group p-1 focus:outline-none transition transform active:scale-90"
                    >
                      <Star 
                        size={24} 
                        className={`transition-colors duration-200 ${store.myRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 group-hover:text-slate-500'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {stores.length === 0 && (
            <div className="text-center text-slate-500 mt-10">No stores found matching "{search}"</div>
        )}
      </div>
    </div>
  );
}