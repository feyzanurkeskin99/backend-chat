const express=require('express');
const router=express.Router();
const loginController = require('../controllers/loginController');

router.get('/',loginController.index);
router.post('/',loginController.post);
router.delete('/',loginController.delete);

module.exports = router;