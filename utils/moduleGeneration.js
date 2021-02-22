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
					sentenceArr = _.compact(
						utils
							.fixQuotes(
								utils.removeAllPunctuation(database[j].english.toLowerCase())
							)
							.split(' ')
					);
				} else {
					sentenceArr = utils
						.removeAllPunctuation(database[j].korean)
						.split(' ');
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
	if (sentences.length) {
		sentences.forEach(({ query, sentence }) => {
			const arr = utils.removeAllPunctuation(sentence.korean).split(' ');
			const indx = arr.indexOf(query);

			if (indx !== -1) {
				arr[
					indx
				] = `<span style="border-bottom: 1px black solid; padding-bottom: 2px">${arr[indx]}</span>`;
			}
			apkg.addCard(arr.join(' '), sentence.english);
		});
	}

	if (empty.length) {
		empty.forEach((word) => {
			const link = `https://en.dict.naver.com/#/search?query=${word}`;
			apkg.addCard(word, link);
		});
	}

	const deck = await apkg.save();
	return deck;
};

module.exports = {
	searchDatabase,
	generateAnkiDeck,
};
