import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaImage, FaSmile } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';
import { format } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ chat, user }) => {
    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('receiveMessage', (message) => {
            if (chat?._id === message.chatId) {
                chat.messages.push(message);
                scrollToBottom();
            }
        });

        socket.on('userTyping', ({ chatId, isTyping: typing }) => {
            if (chat?._id === chatId) {
                setIsTyping(typing);
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('userTyping');
        };
    }, [socket, chat?._id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        socket.emit('sendMessage', {
            chatId: chat._id,
            content: message,
            sender: user._id
        });

        setMessage('');
        setShowEmoji(false);
    };

    const onEmojiClick = (event, emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 backdrop-blur-lg">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                        {chat?.participants[0]?.name[0]}
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">
                            {chat?.participants.find(p => p._id !== user?._id)?.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {isTyping ? 'Typing...' : 'Online'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat?.messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] ${
                            msg.sender._id === user?._id 
                                ? 'bg-gradient-to-r from-blue-500 to-emerald-500' 
                                : 'bg-white/10'
                        } rounded-xl px-4 py-2`}>
                            <p className="text-white">{msg.content}</p>
                            <p className="text-xs text-gray-300 mt-1">
                                {format(new Date(msg.createdAt), 'HH:mm')}
                            </p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 backdrop-blur-lg">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="p-2 rounded-full hover:bg-white/5"
                    >
                        <FaSmile className="text-gray-400" />
                    </button>
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-white/5"
                    >
                        <FaImage className="text-gray-400" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                    >
                        <FaPaperPlane />
                    </button>
                </form>
                {showEmoji && (
                    <div className="absolute bottom-20 right-4">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWindow; 