const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const utils = require('../utils/misc');
const db = require('../models');
const sentenceBank = require('../sb.json');
const moduleGeneration = require('../utils/moduleGeneration');
const cache = require('../utils/cache');

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
		const { id, lang } = req.params;

		if (!(lang === 'en' || lang === 'ko')) {
			res.status(400).send('Invalid lang. Must be "en" or "ko" ');
			return;
		}

		if (id.length !== 11) {
			res.status(400).send({ message: 'ID is not 11 characters' });
			return;
		}

		let result = cache.myCache.get(`${id}-${lang}`);
		if (!result) {
			let subtitles;
			try {
				subtitles = await utils.getSubtitles(id, lang);
			} catch (error) {
				res.status(404).send('Could not find subtitles');
				return;
			}
			const { events } = subtitles;
			const captionString = events.reduce(
				(acc, { segs }) => `${acc}${segs[0].utf8} `,
				''
			);
			const uniqueArr = Array.from(
				new Set(utils.cleanKoreanText(captionString))
			);
			if (uniqueArr.length === 0) {
				res.status(204).send({ message: 'No qualifying captions found' });
				return;
			}

			result = moduleGeneration.searchDatabase(sentenceBank, uniqueArr, lang);
			cache.myCache.set(`${id}-${lang}`, result);
		}
		const ankiDeck = await moduleGeneration.generateAnkiDeck(result, id);

		fs.writeFileSync(
			// eslint-disable-next-line no-undef
			path.resolve(__dirname, '../output.apkg'),
			ankiDeck,
			'binary'
		);
		res.setHeader('Content-Disposition', 'filename=' + 'download.apkg');
		res.download(path.resolve('output.apkg'), `Sip-anki-${id}.apkg`, () => {
			// eslint-disable-next-line no-undef
			fs.unlinkSync(path.resolve(__dirname, '../output.apkg'));
		});
		return;
	},
};
