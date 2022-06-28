const express=require('express');
const router=express.Router();
const contactsController = require('../controllers/contactsController');

router.get('/',contactsController.index);
router.post('/',contactsController.post);
router.put('/',contactsController.put);

module.exports = router;