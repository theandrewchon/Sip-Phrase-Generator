const router = require('express').Router();
const generateController = require('../../controllers/generateController');

router.route('/').get(generateController.generate);

router.route('/:id/:lang').get(generateController.generateModuleFromCaption);

module.exports = router;
