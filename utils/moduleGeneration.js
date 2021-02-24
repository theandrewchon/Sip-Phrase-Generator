const fs = require('fs');
const path = require('path');
const cache = require('../utils/cache');
const db = require('../models');
const TimSort = require('timsort');
const utils = require('../utils/misc');
const AnkiExport = require('anki-apkg-export').default;

const searchDatabase = async (queriesArr, lang) => {
	let emptyArray = [];
	let sentenceArray = [];

	for (let query of queriesArr) {
		let result = cache.myCache.get(query);
		if (!result) {
			await db.Sentences.find({ $text: { $search: query } }).then((db) => {
				if (db.length) {
					if (lang === utils.LANG_MAP.korean) {
						TimSort.sort(db, (a, b) => {
							return a.korean.split(' ').length - b.korean.split(' ').length;
						});
					} else {
						TimSort.sort(db, (a, b) => {
							return a.english.split(' ').length - b.english.split(' ').length;
						});
					}
					result = { query, sentence: db[0] };
					cache.myCache.set(query, result);
				} else {
					emptyArray.push(query);
				}
			});
		}
		sentenceArray.push(result);
	}
	return { empty: emptyArray, sentences: sentenceArray };
};

const generateAnkiDeck = async (sentenceObj, id) => {
	const { empty, sentences } = sentenceObj;
	const apkg = new AnkiExport(`Sip-Anki-${id}`);

	const discord = 'https://discord.gg/Zq6Zrkh';
	const reddit = 'https://www.reddit.com/r/siplanguage/';
	const email = 'sip@siplanguage.com';
	const feedback = 'https://forms.gle/BhrotqApoJoKDVea7';

	const links = `
		<p>Message us on discord, reddit, or email  if you have any questions!</p>
		<div style="padding: 12px"><a href="${discord}">Discord</a></div>
		<div style="padding: 12px"><a href="${reddit}">Reddit</a></div>
		<div style="padding: 12px"><a href="${email}">${email}</a></div>
	`;

	const end = `
	<div style="padding: 12px"><a href="https://www.youtube.com/watch?v=${id}">YouTube Link</a></div>
	<div style="padding: 12px"><a href="${feedback}">Leave us some feedback</a></div>

	`;
	apkg.addMedia(
		'anki-description.png',
		fs.readFileSync(path.resolve(__dirname, '../assets/anki-description.png'))
	);

	// Initial card
	apkg.addCard('<img src=anki-description.png />', links);

	if (sentences.length) {
		sentences.forEach(({ query, sentence }) => {
			const cleanedSentence = utils
				.removeAllPunctuation(sentence.korean)
				.trim();

			const indx = cleanedSentence.indexOf(query);
			const beginning = cleanedSentence.slice(0, indx);
			const underline = cleanedSentence.slice(indx, indx + query.length);
			const end = cleanedSentence.slice(indx + query.length);

			if (indx !== -1) {
				const string = `${beginning}<u>${underline}</u>${end}`;
				apkg.addCard(string, sentence.english);
			} else {
				apkg.addCard(cleanedSentence, sentence.english);
			}
		});
	}

	if (empty.length) {
		empty.forEach((word) => {
			const link = `https://en.dict.naver.com/#/search?query=${word}`;
			apkg.addCard(word, `<a href=${link}>${link}</a>`);
		});
	}

	apkg.addCard(end);

	const deck = await apkg.save();
	return deck;
};

module.exports = {
	searchDatabase,
	generateAnkiDeck,
};
