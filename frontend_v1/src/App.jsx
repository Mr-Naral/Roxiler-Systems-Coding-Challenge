import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard'; 
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard'; 


const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        
        <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
            </PrivateRoute>
        } />
        
       
        <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['user']}>
                <UserDashboard />
            </PrivateRoute>
        } />
        
        
        <Route path="/owner" element={
            <PrivateRoute allowedRoles={['owner']}>
                <OwnerDashboard />
            </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}