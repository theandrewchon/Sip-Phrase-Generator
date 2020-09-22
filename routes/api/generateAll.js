const router = require('express').Router();
const generateController = require('../../controllers/generateAll');

router.get('/', generateController.generate)

module.exports = router;
