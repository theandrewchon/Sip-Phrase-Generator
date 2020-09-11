const router = require('express').Router();
const sentencesRoute = require('./sentences');

// Book routes
router.use('/sentences', sentencesRoute);

module.exports = router;
