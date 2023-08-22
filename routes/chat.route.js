const { chat } = require('../controllers/chat.controller');
const router = require('express').Router();

router.get('/', chat);

module.exports = router;