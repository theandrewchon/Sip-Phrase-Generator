const router = require('express').Router();
const sentencesRoutes = require('./sentences');
const generateRoutes = require('./generate')

// Book routes
router.use('/sentences', sentencesRoutes);
router.use('/generate', generateRoutes)

module.exports = router;
