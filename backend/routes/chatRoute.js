const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addMember, removeMember } = require('../controllers/chatController');

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/add').put(protect, addMember);
router.route('/remove').put(protect, removeMember);

module.exports = router;