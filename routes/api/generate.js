const router = require('express').Router();
const generateController = require('../../controllers/generateController');

router.get('/', generateController.generate)

module.exports = router;
