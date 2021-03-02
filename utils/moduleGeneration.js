const db = require('../models');
const TimSort = require('timsort');
const utils = require('../utils/misc');

const sentencesToCSV = (data) => {
	return data.map(({ sentence, query }) => {
		const regex = /"/g;
		const cleanedSentence = utils
			.removeAllPunctuation(sentence[0].korean.replace(regex, '""'))
			.trim()
			.split(' ');
		const exampleSentences = sentence.slice(1)

		for (let i = 0; i < cleanedSentence.length; i += 1) {
			const link = `https://en.dict.naver.com/#/search?query=${cleanedSentence[i]}`;
			const indx = cleanedSentence[i].indexOf(query);

			if (indx !== -1) {
				const beginning = cleanedSentence[i].slice(0, indx);
				const underline = cleanedSentence[i].slice(indx, indx + query.length);
				const end = cleanedSentence[i].slice(indx + query.length);
				cleanedSentence[i] = `${beginning}<b>${underline}</b>${end}`;
			}

			cleanedSentence[
				i
			] = `<a style=text-decoration:none href=${link}>${cleanedSentence[i]}</a>`;
		}


		let back = `<div>${sentence[0].english.replace(regex, '""')}</div>`

		if (exampleSentences.length) {
			back += `<p>Additional example sentences:</p>`
			exampleSentences.forEach(({ korean, english }) => {
				back += `<p><div>English: ${english.replace(regex, '""')}</div><div>Korean: ${korean.replace(regex, '""')}</div></p>`
			})
		}

		return `"${cleanedSentence.join(' ')}","${back}"`;
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
				const results = { query, sentence: db.splice(0, 4) };
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
	const website = 'https://anki.siplanguage.com';

	const startFront = `"<p>This deck is designed to help you understand YouTube videos.</p><p>It provides a simple example sentence for each word that’s used in the drama (with conjugations and particles attached). For example: the card for the word, “해야겠지” contains the example sentence “선택을 해야겠지”</p><p><div>Why example sentences?</div><div>1) To see how the word is used in a variety of ways</div><div>2) Prevent you from memorizing dialogue</div><div>3) Develop your intuition for the grammar</div><p>Note: sentences are taken from a variety of sources so you may need to edit cards if the sentences are too hard or if the translations are off.</p></p><div>Good resources to use:</div><p><a href="https://dict.naver.com">https://dict.naver.com</a></p><p><a href="https://mirinae.io/">https://mirinae.io/</a></p><p><a href="https://grammar.siplanguage.com/">https://grammar.siplanguage.com/</a></p><p><a href="https://papago.naver.com/">https://papago.naver.com/</a></p>`;
	const startBack = `"<p>Message us on discord, reddit, or email  if you have any questions!</p><div style="padding: 12px"><a href="${discord}">Discord</a></div><div style="padding: 12px"><a href="${reddit}">Reddit</a></div><div style="padding: 12px"><a href="${email}">${email}</a></div>`;

	const endFront = `"<div style="padding: 12px"><a href="https://www.youtube.com/watch?v=${id}">YouTube Link</a></div>`;
	const endBack = `"<div style="padding: 12px"><a href="${feedback}">Leave us some feedback</a></div><div style="padding: 12px"><a href="${website}">Generate more Anki decks</a></div>,`;
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
