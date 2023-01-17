const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');


const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content } = req.body;
    const { _id: userId } = req.user;
    if (!chatId || !content) {
        console.log('No chatId or content');
        res.status(400);
    }
    var newMessage = {
        sender: userId,
        content: content,
        chat: chatId
    }
    try {

        var message = await Message.create(newMessage);

        message = await message.populate('sender', 'name pic');

        message = await message.populate('chat');
        console.log(message);

        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.status(201).json(message);

    } catch (err) {
        res.status(400);
        throw new Error('Error sending message');
    }

});


const allMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    if (!chatId) {
        console.log('No chatId');
        res.status(400);
    }
    try {
        const messages = await Message.find({ chat: chatId }).populate('sender', 'name pic email').populate('chat');
        res.status(200).json(messages);
    } catch (err) {
        res.status(400);
        throw new Error('Error getting messages');
    }


})

module.exports = { sendMessage, allMessages };