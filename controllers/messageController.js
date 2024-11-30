const Message = require('../model/Message');

const sendMessage = async (req, res) => {
    const { sendId, rId } = req.params;
    const { content } = req.body;
    try {
        const message = new Message({
            sender: sendId,
            receiver: rId,
            content: content
        });
        await message.save();
        res.json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

const getMessages = async (req, res) => {
    const { userId, receiverId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

const deleteMessage = async (req, res) => {
    await Message.findByIdAndDelete(req.params.messageId);
    res.status(200).json({ message: 'Message deleted successfully' });
};

module.exports = { sendMessage, getMessages, deleteMessage };
