import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Star, Plus, UserPlus, Search, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [view, setView] = useState('users');
  const [filter, setFilter] = useState(""); 
  const [roleFilter, setRoleFilter] = useState("all");
  
 
  const [showModal, setShowModal] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', address: '', ownerEmail: '' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

 
  const fetchData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { headers });
      const usersRes = await axios.get('http://localhost:5000/api/admin/users', { headers }); 
      const storesRes = await axios.get('http://localhost:5000/api/admin/stores', { headers }); 
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

 
  const filteredUsers = users.filter(u => {
    const matchesText = 
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.address?.toLowerCase().includes(filter.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesText && matchesRole;
  });

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.email.toLowerCase().includes(filter.toLowerCase()) || 
    s.address.toLowerCase().includes(filter.toLowerCase())
  );


  const createStore = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/api/admin/store', newStore, { headers });
        alert("Store Created!");
        setShowModal(false);
        fetchData(); 
    } catch(err) { alert(err.response?.data?.msg || "Error creating store"); }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Navbar title="Admin Portal" role="System Admin" />
      
      <div className="max-w-7xl mx-auto p-6">
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Users />} title="Total Users" value={stats.users} color="bg-blue-600" />
          <StatCard icon={<ShoppingBag />} title="Total Stores" value={stats.stores} color="bg-emerald-600" />
          <StatCard icon={<Star />} title="Total Ratings" value={stats.ratings} color="bg-purple-600" />
        </div>

      
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          
          
          <div className="bg-slate-800 p-1 rounded-lg inline-flex">
            <button 
              onClick={() => setView('users')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${view === 'users' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              User Management
            </button>
            <button 
              onClick={() => setView('stores')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${view === 'stores' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Store Listings
            </button>
          </div>

       
          <div className="flex gap-2">
            <button onClick={() => navigate('/register')} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition">
              <UserPlus size={16} /> Register User
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition">
              <Plus size={16} /> Add Store
            </button>
          </div>
        </div>

        
        <div className="bg-slate-800/50 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 border border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={`Filter ${view} by Name, Email, Address...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          {view === 'users' && (
            <div className="relative w-full md:w-48">
              <Filter className="absolute left-3 top-3 text-slate-500" size={18} />
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">Normal User</option>
                <option value="owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
        </div>

    
        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-white/10">
          
          
          {view === 'users' && (
            <table className="w-full text-left">
              <thead className="bg-black/30 text-slate-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Address</th>
                  <th className="p-4 text-center">Store Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                        u.role === 'owner' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 truncate max-w-37.5">{u.address || "-"}</td>
                    <td className="p-4 text-center">
                      
                      {u.role === 'owner' ? (
                         <span className="text-yellow-400 font-bold">★ {u.ownerRating}</span>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

         
          {view === 'stores' && (
            <table className="w-full text-left">
              <thead className="bg-black/30 text-slate-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Store Name</th>
                  <th className="p-4">Owner Email</th> 
                  <th className="p-4">Address</th>
                  <th className="p-4 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStores.map(s => (
                  <tr key={s.id} className="hover:bg-white/5 transition">
                    <td className="p-4 font-bold text-white">{s.name}</td>
                    <td className="p-4 text-slate-400">{s.email}</td>
                    <td className="p-4 text-sm text-slate-500">{s.address}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        Number(s.rating) >= 4 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {s.rating} / 5
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={createStore} className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Add New Store</h3>
            <input className="w-full mb-3 bg-slate-900 border border-slate-600 p-3 rounded text-white" 
              placeholder="Store Name" required onChange={e => setNewStore({...newStore, name: e.target.value})} />
            <input className="w-full mb-3 bg-slate-900 border border-slate-600 p-3 rounded text-white" 
              placeholder="Address" required onChange={e => setNewStore({...newStore, address: e.target.value})} />
            <input className="w-full mb-6 bg-slate-900 border border-slate-600 p-3 rounded text-white" 
              type="email" placeholder="Owner Email" required onChange={e => setNewStore({...newStore, ownerEmail: e.target.value})} />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400">Cancel</button>
              <button className="bg-blue-600 px-4 py-2 rounded text-white font-bold">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


const StatCard = ({ icon, title, value, color }) => (
  <motion.div whileHover={{ y: -5 }} className={`${color} p-6 rounded-2xl shadow-lg relative overflow-hidden`}>
    <div className="relative z-10">
      <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-4xl font-extrabold text-white">{value}</p>
    </div>
    <div className="absolute right-4 bottom-4 opacity-20 bg-black p-2 rounded-lg">{icon}</div>
  </motion.div>
);