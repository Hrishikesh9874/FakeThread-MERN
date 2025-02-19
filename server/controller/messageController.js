const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');


const sendMessage = async (req, res) => {
    const {recipientId, message} = req.body;
    const senderId = req.user.id;

    if(recipientId === senderId){
        return res.status(404).json({error: "You can't text yourself!"});
    }

    try {
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, recipientId]}
        });

        if(!conversation){
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
            await conversation.save();
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        })

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
        ])

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user.id;
    if(otherUserId === userId){
        return res.status(404).json({error: "Please Search your conversation with another user"});
    }
    try {
        const conversation = await Conversation.findOne({
            participants: {$all: [userId, otherUserId]}
        });

        if(!conversation){
            return res.status(404).json({error: 'Conversation not found!'});
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({createdAt: 1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getConversations = async (req, res) => {
    const userId = req.user.id;
    try {
        const conversations = await Conversation.find({participants: userId}).populate({
            path: 'participants',
            select: "username profilePic"
        });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}




module.exports = {sendMessage, getMessages, getConversations};