const { Store, Rating } = require('../models');
const { Op } = require('sequelize');


exports.getStores = async (req, res) => {
    try {
        const { search } = req.query; 

        const whereClause = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        const stores = await Store.findAll({
            where: whereClause,
            include: [{ model: Rating }]
        });

        const processed = stores.map(store => {
            const ratings = store.Ratings || [];

            const total = ratings.reduce((acc, r) => acc + r.rating, 0);
            const avg = ratings.length > 0 ? (total / ratings.length) : 0;

            const myRatingObj = ratings.find(r => r.UserId === req.user.id);
            
            return {
                id: store.id,
                name: store.name,
                address: store.address,
                avgRating: avg.toFixed(1),
                myRating: myRatingObj ? myRatingObj.rating : 0
            };
        });

        res.json(processed);
    } catch (err) { 
        console.error("Error fetching stores:", err);
        res.status(500).json({ msg: "Failed to load stores" }); 
    }
};


exports.submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;

        const [rateObj, created] = await Rating.findOrCreate({
            where: { UserId: userId, StoreId: storeId },
            defaults: { rating }
        });

        if (!created) {
            rateObj.rating = rating;
            await rateObj.save();
        }
        
        res.json({ msg: "Rating submitted" });
    } catch (err) { 
        console.error("Error rating store:", err);
        res.status(500).json({ msg: "Failed to submit rating" }); 
    }
};