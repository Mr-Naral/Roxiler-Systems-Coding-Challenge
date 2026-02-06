require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { verifyToken, checkRole } = require('./middleware/authMiddleware');


const { register, login, updatePassword } = require('./controllers/authController');
const adminController = require('./controllers/adminController');
const ownerController = require('./controllers/ownerController');
const userController = require('./controllers/userController');

const app = express();


app.use(cors());
app.use(express.json());


connectDB();




app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.put('/api/auth/password', verifyToken, updatePassword);


app.get('/api/admin/stats', verifyToken, checkRole(['admin']), adminController.getStats);
app.get('/api/admin/users', verifyToken, checkRole(['admin']), adminController.getUsers);
app.post('/api/admin/store', verifyToken, checkRole(['admin']), adminController.createStore);
app.get('/api/admin/stores', verifyToken, checkRole(['admin']), adminController.getStores);


app.get('/api/owner/dashboard', verifyToken, checkRole(['owner']), ownerController.getOwnerDashboard);


app.get('/api/stores', verifyToken, userController.getStores); 
app.post('/api/rating', verifyToken, checkRole(['user']), userController.submitRating);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));