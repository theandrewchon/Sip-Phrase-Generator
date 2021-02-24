const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sentencesSchema = new Schema({
	english: { type: String, required: true },
	korean: { type: String, required: true },
});

sentencesSchema.path('korean').index({ text: true });
const Sentences = mongoose.model('Sentences', sentencesSchema);

module.exports = Sentences;
