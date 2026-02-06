import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

 
  const validate = () => {
    if (form.name.length < 20 || form.name.length > 60) return "Name must be 20-60 characters long.";

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passRegex.test(form.password)) return "Password: 8-16 chars, 1 Uppercase, 1 Special character required.";
    if (form.address.length > 400) return "Address max 400 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert("Registration Successful! Please login.");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm border border-red-500/50">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm">Full Name (20-60 chars)</label>
            <input 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Email</label>
            <input 
              type="email"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Password (Strong)</label>
            <input 
              type="password"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Role</label>
              <select 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.role} onChange={e => setForm({...form, role: e.target.value})}
              >
                <option value="user">Normal User</option>
                <option value="owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Address</label>
              <input 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.address} onChange={e => setForm({...form, address: e.target.value})}
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all mt-4">
            Sign Up
          </button>
        </form>
        
        <p className="text-center mt-6 text-slate-400">
          Already have an account? <Link to="/" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}