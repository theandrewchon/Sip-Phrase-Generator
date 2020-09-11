const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sentencesSchema = new Schema({
	english: { type: String, required: true },
	korean: { type: String, required: true },
});

const Sentences = mongoose.module('Sentences', sentencesSchema);

module.exports = Sentences;
