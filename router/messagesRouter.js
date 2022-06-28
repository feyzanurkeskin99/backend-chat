const express=require('express');
const router=express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/',messagesController.index);
router.delete('/',messagesController.delete);
// router.post('/',messagesController.post);

module.exports = router;