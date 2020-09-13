import axios from 'axios';

export default {
	getSentences: function () {
		return axios.get('/api/sentences');
	},
	getSentence: function (id) {
		return axios.get('/api/sentences/' + id);
	},
	deleteSentences: function (id) {
		return axios.delete('/api/sentences/' + id);
	},
	saveSentences: function (bookData) {
		return axios.post('/api/sentences', bookData);
	},
};
