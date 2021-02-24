const fs = require('fs');
const path = require('path');
const cache = require('../utils/cache');
const TimSort = require('timsort');
const utils = require('../utils/misc');
const AnkiExport = require('anki-apkg-export').default;

const searchDatabase = (database, queriesArr, lang) => {
	let emptyArray = [];
	let sentenceArray = [];

	TimSort.sort(database, (a, b) => {
		return a.english.length - b.english.length;
	});

	for (let i = 0; i < queriesArr.length; i += 1) {
		let result = cache.myCache.get(queriesArr[i]);
		if (!result) {
			for (let j = 0; j < database.length; j += 1) {
				let sentenceArr;
				if (lang === 'en') {
					sentenceArr = utils.fixQuotes(
						utils.removeAllPunctuation(database[j].english.toLowerCase().trim())
					);
				} else {
					sentenceArr = utils.removeAllPunctuation(database[j].korean).trim();
				}
				if (sentenceArr.includes(queriesArr[i])) {
					const obj = {
						query: queriesArr[i],
						sentence: database[j],
					};
					result = obj;
					cache.myCache.set(queriesArr[i], obj);
					break;
				}
			}
		}
		if (result) {
			sentenceArray.push(result);
		} else {
			emptyArray.push(queriesArr[i]);
		}
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
		'description.png',
		fs.readFileSync(path.resolve(__dirname, '../assets/description.jpg'))
	);

	// Initial card
	apkg.addCard('<img src=description.png />', links);

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
				const string = `${beginning}<span style="border-bottom: 1px black solid; padding-bottom: 2px">${underline}</span>${end}`;
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
