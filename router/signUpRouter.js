const express=require('express');
const router=express.Router();
const ctrlSignUpController = require('../controllers/signUpController');

router.get('/',ctrlSignUpController.index);
router.post('/',ctrlSignUpController.post);
router.put('/',ctrlSignUpController.put);

module.exports = router;