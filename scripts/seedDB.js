const mongoose = require('mongoose');
const db = require('../models');
require('dotenv').config();

// This file empties the Books collection and inserts the books below
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const sentenceSeed = [
	{
		english: 'Can you give me the water bottle?',
		korean: '물병 좀 줄래?',
	},
];

db.Sentences.deleteMany({})
	.then(() => db.Sentences.collection.insertMany(sentenceSeed))
	.then((data) => {
		console.log(data.result.n + ' records inserted!');
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
