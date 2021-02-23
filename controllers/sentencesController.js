const db = require('../models');
const cache = require('../utils/cache');

// Defining methods for the booksController
module.exports = {
	findAll: function (req, res) {
		let cachedDb = cache.myCache.get(cache.DB_KEY);
		if (!cachedDb) {
			db.Sentences.find({})
				.sort({})
				.then((dbModel) => {
					cache.myCache.set(cache.myCache.DB_KEY, dbModel, 86400);
					res.json(dbModel);
				})
				.catch((err) => res.status(422).json(err));
		} else {
			res.json(cachedDb);
		}
	},
	findById: function (req, res) {
		db.Sentences.findById(req.params.id)
			.then((dbModel) => res.json(dbModel))
			.catch((err) => res.status(422).json(err));
	},
	create: function (req, res) {
		db.Sentences.insertMany(req.body)
			.then((dbModel) => res.json(dbModel))
			.catch((err) => res.status(422).json(err));
	},
	update: function (req, res) {
		db.Sentences.findOneAndUpdate({ _id: req.params.id }, req.body)
			.then((dbModel) => res.json(dbModel))
			.catch((err) => res.status(422).json(err));
	},
	remove: function (req, res) {
		db.Sentences.findById({ _id: req.params.id })
			.then((dbModel) => dbModel.remove())
			.then((dbModel) => res.json(dbModel))
			.catch((err) => res.status(422).json(err));
	},
};
