const db = require('../models');
const TimSort = require('timsort');
const utils = require('../utils/misc');

const sentencesToCSV = (data) => {
	return data.map(({ sentence, query }) => {
		const cleanedSentence = utils.removeAllPunctuation(sentence.korean).trim();
		const indx = cleanedSentence.indexOf(query);
		let row;
		if (indx !== -1) {
			const beginning = cleanedSentence.slice(0, indx);
			const underline = cleanedSentence.slice(indx, indx + query.length);
			const end = cleanedSentence.slice(indx + query.length);
			row = `"${beginning}<b>${underline}</b>${end}","${sentence.english}"`;
		} else {
			row = `"${sentence.korean}","${sentence.english}"`;
		}
		return row;
	});
};

const emptyToCSV = (data) => {
	return data.map((word) => {
		const link = `https://en.dict.naver.com/#/search?query=${word}`;
		const row = `"${word}","${link}"`;
		return row;
	});
};

const searchDatabase = async (queriesArr, lang) => {
	let emptyArray = [];
	let sentenceArray = [];

	for (let query of queriesArr) {
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
				const results = { query, sentence: db[0] };
				sentenceArray.push(results);
			} else {
				emptyArray.push(query);
			}
		});
	}

	return { empty: emptyArray, sentences: sentenceArray };
};

const generateAnkiDeck = async (sentenceObj, id) => {
	const { empty, sentences } = sentenceObj;

	const discord = 'https://discord.gg/Zq6Zrkh';
	const reddit = 'https://www.reddit.com/r/siplanguage/';
	const email = 'sip@siplanguage.com';
	const feedback = 'https://forms.gle/BhrotqApoJoKDVea7';

	const startFront = `"<p>This deck is designed to help you enjoy Korean YouTube videos. We extract individual words from the video and find example sentences from various resources to teach you the relevant vocabulary and grammar.</p><p><div>We use simple example sentences to help you:</div><div>• See how the word is used in a variety of ways </div><div>• Prevent you from memorizing dialogue</div><div>• Develop your intuition for the grammar</div></p><p><div>Depending on the quality of the captions, your module experience will vary:</div><div>• Some words may not have matched sentences </div><div>• Some sentences may be difficult</div></p><p>After you complete the deck, you should be able to understand enough of the video to enjoy with Korean subtitles.</p>"`;

	const startBack = `"<p>Message us on discord, reddit, or email  if you have any questions!</p><div style="padding: 12px"><a href="${discord}">Discord</a></div><div style="padding: 12px"><a href="${reddit}">Reddit</a></div><div style="padding: 12px"><a href="${email}">${email}</a></div>`;

	const endFront = `"<div style="padding: 12px"><a href="https://www.youtube.com/watch?v=${id}">YouTube Link</a></div>`;
	const endBack = `"<div style="padding: 12px"><a href="${feedback}">Leave us some feedback</a></div>,`;
	const sentencesArr = sentencesToCSV(sentences);
	const emptyArr = emptyToCSV(empty);
	const csvArr = [...sentencesArr, ...emptyArr];
	csvArr.unshift([startFront, startBack]);
	csvArr.push([endFront, endBack]);
	return `${csvArr.join(',\n')}`;
};

module.exports = {
	searchDatabase,
	generateAnkiDeck,
};
