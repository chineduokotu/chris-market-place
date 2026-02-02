import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { MessageCircle, X, ArrowLeft, Send, Check, CheckCheck } from 'lucide-react';

export default function ChatWidget() {
    const {
        conversations,
        activeConversation,
        messages,
        isOpen,
        isLoading,
        unreadTotal,
        connectionStatus,
        fetchMessages,
        sendMessage,
        openChat,
        closeChat,
        backToList,
    } = useChat();
    const { user } = useAuth();

    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when conversation opens
    useEffect(() => {
        if (activeConversation) {
            inputRef.current?.focus();
        }
    }, [activeConversation]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendMessage(newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString();
    };

    const statusMeta = {
        connected: { label: 'Live', className: 'text-emerald-100 bg-emerald-500/20 border-emerald-300/30' },
        connecting: { label: 'Connecting', className: 'text-blue-100 bg-blue-500/20 border-blue-300/30' },
        disconnected: { label: 'Offline', className: 'text-amber-100 bg-amber-500/20 border-amber-300/30' },
        unavailable: { label: 'Offline', className: 'text-amber-100 bg-amber-500/20 border-amber-300/30' },
        error: { label: 'Error', className: 'text-red-100 bg-red-500/20 border-red-300/30' },
        unknown: { label: 'Unknown', className: 'text-slate-100 bg-slate-500/20 border-slate-300/30' },
    };
    const statusInfo = statusMeta[connectionStatus] || statusMeta.unknown;

    const currentUserId = user?.id;

    if (!user) return null;

    if (!isOpen) {
        return (
            <button
                onClick={() => openChat()}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center z-50"
            >
                <MessageCircle size={24} />
                {unreadTotal > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
                {activeConversation && (
                    <button onClick={backToList} className="hover:bg-blue-700 p-1 rounded">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="flex-1">
                    <h3 className="font-semibold">
                        {activeConversation ? activeConversation.other_user?.name : 'Messages'}
                    </h3>
                    {!activeConversation && (
                        <p className="text-blue-200 text-xs">{conversations.length} conversations</p>
                    )}
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider border rounded-full px-2 py-0.5 ${statusInfo.className}`}> {/* CHANGED */}
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {statusInfo.label}
                </span>
                <button onClick={closeChat} className="hover:bg-blue-700 p-1 rounded">
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-600"></div>
                    </div>
                ) : activeConversation ? (
                    /* Messages View */
                    <div className="p-4 space-y-3">
                        {messages.length === 0 ? (
                            <p className="text-center text-slate-400 text-sm py-8">
                                No messages yet. Start the conversation!
                            </p>
                        ) : (
                            messages.map((msg, idx) => {
                                const isOwn = msg.sender?.id === currentUserId;
                                const showDate = idx === 0 || 
                                    formatDate(messages[idx - 1].created_at) !== formatDate(msg.created_at);

                                return (
                                    <div key={msg.id}>
                                        {showDate && (
                                            <div className="text-center text-xs text-slate-400 my-3">
                                                {formatDate(msg.created_at)}
                                            </div>
                                        )}
                                        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                                                    isOwn
                                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                                                }`}
                                            >
                                                <p className="text-sm break-words">{msg.body}</p>
                                                <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                                                    <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {formatTime(msg.created_at)}
                                                    </span>
                                                    {isOwn && (
                                                        msg.read_at ? (
                                                            <CheckCheck size={14} className="text-blue-200" />
                                                        ) : (
                                                            <Check size={14} className="text-blue-300" />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    /* Conversation List */
                    <div className="divide-y divide-slate-100">
                        {conversations.length === 0 ? (
                            <p className="text-center text-slate-400 text-sm py-8">
                                No conversations yet
                            </p>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => fetchMessages(conv.id)}
                                    className="w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-start gap-3"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold shrink-0">
                                        {conv.other_user?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900 truncate">
                                                {conv.other_user?.name}
                                            </span>
                                            {conv.last_message && (
                                                <span className="text-xs text-slate-400">
                                                    {formatTime(conv.last_message.created_at)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-slate-500 truncate">
                                                {conv.last_message?.body || 'No messages yet'}
                                            </p>
                                            {conv.unread_count > 0 && (
                                                <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 ml-2">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Message Input (only when in conversation) */}
            {activeConversation && (
                <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSending}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || isSending}
                            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
