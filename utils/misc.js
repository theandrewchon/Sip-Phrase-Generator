const _ = require('lodash');
const axios = require('axios');

/**
 * Takes in string and returns a string with Korean letters replaced with a space
 */
const removeIndividualKoreanLetters = (string) => {
	// Unicode range of Hangul Compatibility Jamo
	const koreanRegex = /[\u3130-\u318F]/g;
	return string.replace(koreanRegex, ' ');
};

/**
 * Takes in string and returns a string with Chinese characters replaced with a space
 */
const removeChineseCharacters = (string) => {
	// Unicode range of Chinese characters
	const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dff\uf900-\ufaff]/g;
	return string.replace(chineseRegex, ' ');
};

/**
 * Takes in string and returns a string with symbols replaced with a space
 */
const removeMiscSymbols = (string) => {
	// Unicode range of miscellaneous symbols
	const symbolsRegex = /[\u2600-\u26FF]/g;
	return string.replace(symbolsRegex, ' ');
};

/**
 * Takes in string and returns a string with punctuations replaced with a space
 */
const removeMiscCharacters = (string) => {
	const miscRegex = /[!"$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
	return string.replace(miscRegex, ' ');
};

/**
 * Takes in string and returns a string with punctuations replaced with a space
 */
const removePunctuation = (string) => {
	const punctuationRegex = /[!,.?]/g;
	return string.replace(punctuationRegex, '');
};

/**
 * Filters out strings containing "#" in an array
 */
const removeHashtags = (arr) => arr.filter((word) => !word.includes('#'));

/**
 * Filters out strings containing english words
 */
const removeEnglish = (arr) => {
	const alphabetRegex = /[\u0041-\u005A\u0061-\u007A]/;
	const hangulRegex = /[\uAC00-\uD7AF]/;
	return arr.filter((word) => !alphabetRegex.test(word));
};

/**
 * Filters out strings containing numbers in an array
 */
const removeNumbers = (arr) =>
	arr.filter((word) => !/[a-z]*\d+[a-z]*/gi.test(word));

// Remove symbols and other "messy" data from KOREAN text
const cleanKoreanText = (string) => {
	let cleaned = string.trim().replace(/\n/g, ' ');
	cleaned = removeIndividualKoreanLetters(cleaned);
	cleaned = removeChineseCharacters(cleaned);
	cleaned = removeMiscSymbols(cleaned);
	cleaned = removeMiscCharacters(cleaned);

	let cleanedArray = _.compact(cleaned.split(' '));
	cleanedArray = removeHashtags(cleanedArray);
	cleanedArray = removeEnglish(cleanedArray);
	cleanedArray = removeNumbers(cleanedArray);
	return cleanedArray;
};

/**
 * Parse and return Youtube ID from link
 */
const getYoutubeId = (url) => {
	const id = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	return undefined !== id[2] ? id[2].split(/[^0-9a-z_-]/i)[0] : id[0];
};

const getSubtitles = async (id, lang) => {
	// '' handles user submitted captions, others are 3rd party company names that caption video
	const THIRD_PARTY_NAMES = ['', 'jamake'];

	for (let name of THIRD_PARTY_NAMES) {
		const API = `https://www.youtube.com/api/timedtext?v=${id}&lang=${lang}&name=${name}&fmt=json3`;
		const { data } = await axios
			.get(API)
			.catch(() => console.log('No subtitles'));
		if (data) {
			return data;
		}
	}

	throw new Error();
};

const removeAllPunctuation = (string) => {
	let regex = /[!"#$%&*+,./:;<=>?@[\]^_`{|}~]/g;
	return string.replace(regex, '');
};

const fixQuotes = (string) => {
	return string.replace(/[\u2018\u2019]/g, "'");
};

module.exports = {
	getYoutubeId,
	getSubtitles,
	cleanKoreanText,
	removeAllPunctuation,
	fixQuotes,
};
