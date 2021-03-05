const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const utils = require('../utils/misc');
const db = require('../models');
const moduleGeneration = require('../utils/moduleGeneration');

module.exports = {
	generate: async function (req, res) {
		const { lang, queries } = req.query;
		let emptyArray = [];
		let sentenceArray = [];
		if (queries.length === 0) {
			return res.json({ empty: emptyArray, sentences: sentenceArray });
		}
		const database = await db.Sentences.find({});
		const arr = _.compact(
			utils
				.fixQuotes(
					utils.removeAllPunctuationPunctuation(queries.toLowerCase().trim())
				)
				.split(' ')
		);
		if (arr.length) {
			arr.forEach((element) => {
				let temp = database.filter((phrase) => {
					if (lang === 'english') {
						const englishArr = _.compact(
							utils
								.fixQuotes(
									utils.removeAllPunctuationPunctuation(
										phrase.english.toLowerCase()
									)
								)
								.split(' ')
						);
						//Filter english words
						if (englishArr.includes(element)) {
							return true;
						} else {
							return false;
						}
					} else if (lang === 'korean') {
						//Filter Korean words
						let newStr = utils.removeAllPunctuationPunctuation(phrase.korean);
						let arr = newStr.split(' ');
						return arr.includes(element);
					}
					//Filter Korean words
				});
				if (temp.length) {
					sentenceArray.push({
						query: element,
						//Returns shortest string
						sentence: temp.reduce((a, b) =>
							a.english.length <= b.english.length ? a : b
						),
					});
				} else {
					emptyArray.push(element);
				}
			});
		}
		return res.json({ empty: emptyArray, sentences: sentenceArray });
	},

	generateModuleFromCaption: async function (req, res) {
		const { id, wordlist } = req.body;
		const lang = utils.LANG_MAP.korean

		const exists = fs.existsSync(path.resolve(__dirname, `../${id}-csv.txt`));

		if (exists) {
			res.send('exists')
			return
		}

		if (!(lang === utils.LANG_MAP.english || lang === utils.LANG_MAP.korean)) {
			res.status(400).send('Invalid lang. Must be "en" or "ko" ');
			return;
		}

		if (id.length !== 11 || wordlist.length === 0) {
			res.status(400).send({ message: 'Invalid link' });
			return;
		}

		const captionString = wordlist.join(' ')
		const uniqueArr = Array.from(new Set(utils.cleanKoreanText(captionString)));
		if (uniqueArr.length === 0) {
			res.status(204).send({ message: 'No qualifying captions found' });
			return;
		}

		try {
			const result = await moduleGeneration.searchDatabase(uniqueArr, lang);
			const csvFile = await moduleGeneration.generateAnkiDeck(result, id);
			fs.writeFile(`${id}-csv.txt`, csvFile, 'utf8', (err) => {
				if (err) throw err;
				res.sendStatus(200);
			});
			return;
		} catch (error) {
			res.status(500).send('Error during module creation');
		}
	},

	getAnkiFile: function (req, res) {
		const { id } = req.params
		const exists = fs.existsSync(path.resolve(__dirname, `../${id}-csv.txt`));

		if (exists) {
			res.setHeader('Content-Disposition', 'attachment; filename=' + `${id}-csv.txt`);
			res.download(path.resolve(`${id}-csv.txt`), `${id}-csv.txt`, () => {
				// eslint-disable-next-line no-undef
				fs.unlinkSync(path.resolve(__dirname, `../${id}-csv.txt`));
			});
			return;
		} else {
			res.status(404)
		}
	}
};

