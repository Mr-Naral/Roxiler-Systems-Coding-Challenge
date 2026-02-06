const { User, Store, Rating } = require('../models');

exports.getStats = async (req, res) => {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.json({ users, stores, ratings });
};

exports.createStore = async (req, res) => {
    const { name, address, ownerEmail } = req.body;
    try {
        const owner = await User.findOne({ where: { email: ownerEmail, role: 'owner' } });
        if (!owner) return res.status(404).json({ msg: "User not found or not an Owner role" });

        await Store.create({ name, address, ownerId: owner.id });
        res.json({ msg: "Store created successfully" });
    } catch (err) { res.status(500).json({ msg: err.message }); }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Store,
                attributes: ['id'],
                include: [{
                    model: Rating,
                    attributes: ['rating']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        const processedUsers = users.map(user => {
            let ownerRating = "N/A";
            
            if (user.role === 'owner' && user.Stores.length > 0) {
                const ratings = user.Stores[0].Ratings || [];
                if (ratings.length > 0) {
                    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
                    ownerRating = (total / ratings.length).toFixed(1);
                } else {
                    ownerRating = "No Ratings";
                }
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
                ownerRating 
            };
        });

        res.json(processedUsers);
    } catch (err) { res.status(500).json({ msg: err.message }); }
};


exports.getStores = async (req, res) => {
    try {
        const stores = await Store.findAll({
            include: [
                { model: User, as: 'owner', attributes: ['email'] }, 
                { model: Rating, attributes: ['rating'] }
            ]
        });

        const processedStores = stores.map(store => {
            const ratings = store.Ratings || [];
            const avgRating = ratings.length > 0 
                ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(1) 
                : 0;

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                email: store.owner ? store.owner.email : "N/A", 
                rating: avgRating 
            };
        });

        res.json(processedStores);
    } catch (err) { res.status(500).json({ msg: err.message }); }
};

