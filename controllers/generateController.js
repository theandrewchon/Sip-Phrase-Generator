const db = require('../models');
const _ = require('lodash');
const getSubtitles = require('youtube-captions-scraper').getSubtitles;
const cleanKoreanText = require('../utils/misc');
const TimSort = require('timsort');
const NodeCache = require('node-cache');

const DB_KEY = 'SENTENCE_BANK_CACHE_KEY';
const myCache = new NodeCache({
	stdTTL: 3600,
	maxKeys: 10000,
});

const removePunctuation = (string) => {
	let regex = /[!"#$%&*+,./:;<=>?@[\]^_`{|}~]/g;
	return string.replace(regex, '');
};

const fixQuotes = (string) => {
	return string.replace(/[\u2018\u2019]/g, "'");
};

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
			fixQuotes(removePunctuation(queries.toLowerCase().trim())).split(' ')
		);
		if (arr.length) {
			arr.forEach((element) => {
				let temp = database.filter((phrase) => {
					if (lang === 'english') {
						const englishArr = _.compact(
							fixQuotes(removePunctuation(phrase.english.toLowerCase())).split(
								' '
							)
						);
						//Filter english words
						if (englishArr.includes(element)) {
							return true;
						} else {
							return false;
						}
					} else if (lang === 'korean') {
						//Filter Korean words
						let newStr = removePunctuation(phrase.korean);
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

		const cachedValue = myCache.get(id);
		if (cachedValue) {
			return res.json(cachedValue);
		}

		if (!(lang === 'en' || lang === 'ko')) {
			return res
				.status(400)
				.send({ message: 'Invalid lang. Must be "en" or "ko" ' });
		}

		let emptyArray = [];
		let sentenceArray = [];

		if (id.length !== 11) {
			return res.status(400).send({ message: 'ID is not 11 characters' });
		}

		let subtitles;
		try {
			subtitles = await getSubtitles({
				videoID: id,
				lang: lang,
			});
		} catch (error) {
			res.status(400).send({ message: 'Could not get subtitles' });
		}
		const captionString = subtitles.reduce((acc, { text }) => acc + text, '');
		const uniqueArr = Array.from(new Set(cleanKoreanText(captionString)));
		if (uniqueArr.length === 0) {
			return res.status(400).send({ message: 'No qualifying captions found' });
		}
		let database = myCache.get(DB_KEY, 86400);

		if (!database) {
			database = await db.Sentences.find({});
		}

		TimSort.sort(database, (a, b) => {
			return a.english.length - b.english.length;
		});

		for (let i = 0; i < uniqueArr.length; i += 1) {
			let result = myCache.get(uniqueArr[i]);
			if (!result) {
				for (let j = 0; j < database.length; j += 1) {
					let sentenceArr;
					if (lang === 'en') {
						sentenceArr = _.compact(
							fixQuotes(
								removePunctuation(database[j].english.toLowerCase())
							).split(' ')
						);
					} else {
						sentenceArr = removePunctuation(database[j].korean).split(' ');
					}
					if (sentenceArr.includes(uniqueArr[i])) {
						const obj = {
							query: uniqueArr[i],
							sentence: database[j],
						};
						result = obj;
						myCache.set(uniqueArr[i], obj);
						break;
					}
				}
			}
			if (result) {
				sentenceArray.push(result);
			} else {
				emptyArray.push(uniqueArr[i]);
			}
		}
		const result = { empty: emptyArray, sentences: sentenceArray };
		myCache.set(id, result);
		return res.json(result);
	},
};
