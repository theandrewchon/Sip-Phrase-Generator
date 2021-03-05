const router = require('express').Router();
const generateController = require('../../controllers/generateController');

router.route('/')
  .get(generateController.generate)
  .post(generateController.generateModuleFromCaption);

router.route('/:id').get(generateController.getAnkiFile);

module.exports = router;
