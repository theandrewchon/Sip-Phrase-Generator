const router = require('express').Router();
const sentencesRoutes = require('./sentences');
const generateRoutes = require('./generate')
const generateAllRoutes = require('./generateAll')

// Book routes
router.use('/sentences', sentencesRoutes);
router.use('/generate', generateRoutes)
router.use('/generateall', generateAllRoutes)

module.exports = router;
