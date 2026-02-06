const { Store, Rating, User } = require('../models');

exports.getOwnerDashboard = async (req, res) => {
    try {
        const store = await Store.findOne({ where: { ownerId: req.user.id } });
        
        if (!store) {
            return res.json({ 
                storeName: "No Store Assigned", 
                avgRating: 0, 
                ratings: [] 
            });
        }

        const ratings = await Rating.findAll({
            where: { StoreId: store.id },
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        const total = ratings.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = ratings.length > 0 ? (total / ratings.length).toFixed(1) : 0;

        res.json({
            storeName: store.name,
            avgRating,
            ratings: ratings.map(r => ({
                id: r.id,
                userName: r.User.name,
                userEmail: r.User.email,
                rating: r.rating,
                date: r.createdAt
            }))
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};