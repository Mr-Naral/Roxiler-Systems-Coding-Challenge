import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      navigate(role === 'admin' ? '/admin' : role === 'owner' ? '/owner' : '/dashboard');
    } catch (err) { alert("Invalid Credentials"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <Input label="Email" type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
          <Input label="Password" type="password" value={data.password} onChange={e => setData({...data, password: e.target.value})} />
          <button className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg mt-4 transition transform hover:scale-[1.02]">
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400">
          New here? <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}