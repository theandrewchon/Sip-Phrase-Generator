const NodeCache = require('node-cache');

const DB_KEY = 'SENTENCE_BANK_CACHE_KEY';
const myCache = new NodeCache({
	stdTTL: 86400,
	maxKeys: 10000,
});

module.exports = { DB_KEY, myCache };
