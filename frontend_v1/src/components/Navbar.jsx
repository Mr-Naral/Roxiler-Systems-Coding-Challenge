import { useNavigate } from 'react-router-dom';
import { LogOut, User, Key } from 'lucide-react';

export default function Navbar({ title, role }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleChangePassword = () => {
    const newPass = prompt("Enter new password (must be strong):");
    if(newPass) {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/auth/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ newPassword: newPass })
        }).then(res => {
            if(res.ok) alert("Password Updated");
            else alert("Failed: Password must be strong (8-16 chars, 1 Upper, 1 Special)");
        });
    }
  };

  return (
    <nav className="bg-slate-800/50 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
            <User className="text-white" size={20} />
        </div>
        <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest">{role}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-slate-300 font-medium hidden sm:block">Hello, {user?.name}</span>
        
        <button onClick={handleChangePassword} title="Change Password" 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition">
            <Key size={20} />
        </button>
        
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition font-medium">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}