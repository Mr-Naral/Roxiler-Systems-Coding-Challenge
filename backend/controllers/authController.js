const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;


        if (name.length < 10 || name.length > 60) return res.status(400).json({ msg: "Name must be 10-60 chars" });
        if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/)) 
            return res.status(400).json({ msg: "Password must be 8-16 chars, 1 Uppercase, 1 Special" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, address, role });
        
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '4h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/)) 
            return res.status(400).json({ msg: "Weak Password" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: req.user.id } });
        res.json({ msg: "Password updated" });
    } catch (err) { res.status(500).json({ msg: err.message }); }
};