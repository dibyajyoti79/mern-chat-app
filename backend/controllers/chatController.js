const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log('No user id provided');
        return res.status(400).json({ message: 'No user id provided' });
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate('users', '-password').populate("latestMessage");

    isChat = await User.populate(isChat, { path: "latestMessage.sender", select: "name pic email" });

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        try {
            const newChat = await Chat.create({
                chatName: "sender",
                users: [req.user._id, userId],
                isGroupChat: false
            });

            const fullChat = await Chat.findOne({ _id: newChat._id }).populate('users', '-password');

            res.status(200).send(fullChat);


        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }

    }
});



const fetchChats = asyncHandler(async (req, res) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate('users', '-password')
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const fullChats = await User.populate(chats, { path: "latestMessage.sender", select: "name pic email" });

        res.status(200).send(fullChats);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "No users or name provided" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json({ message: "Not enough users" });
    }

    users.push(req.user);

    try {
        const newChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            groupAdmin: req.user,
            isGroupChat: true
        });

        const fullChat = await Chat.findOne({ _id: newChat._id }).populate('users', '-password').populate("groupAdmin", "-password");

        res.status(200).json(fullChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});


const renameGroup = asyncHandler(async (req, res) => {

    const { chatId, chatName } = req.body;

    try {
        const updateChat = await Chat.findByIdAndUpdate({
            _id: chatId
        }, {
            chatName
        }, { new: true })
            .populate('users', '-password')
            .populate("groupAdmin", "-password");

        res.status(200).json(updateChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const addMember = asyncHandler(async (req, res) => {

    const { chatId, userId } = req.body;

    try {
        const updateChat = await Chat.findByIdAndUpdate({
            _id: chatId
        }, {
            $push: { users: userId }
        }, { new: true })
            .populate('users', '-password')
            .populate("groupAdmin", "-password");

        res.status(200).json(updateChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const removeMember = asyncHandler(async (req, res) => {

    const { chatId, userId } = req.body;

    try {
        const updateChat = await Chat.findByIdAndUpdate({
            _id: chatId
        }, {
            $pull: { users: userId }
        }, { new: true })
            .populate('users', '-password')
            .populate("groupAdmin", "-password");

        res.status(200).json(updateChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});





module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addMember, removeMember };