const db = require('../models');
const _ = require('lodash');

const removePunctuation = (string) => {
	let regex = /[!"#$%&*+,./:;<=>?@[\]^_`{|}~]/g;
	return string.replace(regex, '');
};
const fixQuotes = (string) => {
	return string.replace(/[\u2018\u2019]/g, "'");
};

module.exports = {
	generate: async function (req, res) {
		let emptyArray = [];
		let sentencesObj = {};
		const { lang, queries } = req.query;
		if (queries.length === 0) {
			return res.json({ empty: emptyArray, sentences: sentencesObj });
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
					Object.assign(sentencesObj, { [element]: temp });
				} else {
					emptyArray.push(element);
				}
			});
		}
		return res.json({ empty: emptyArray, sentences: sentencesObj });
	},
};
