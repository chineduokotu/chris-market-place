import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Search, Send, Check, CheckCheck, MessageSquare, Filter, MoreVertical, Shield, ArrowLeft } from 'lucide-react';

export default function Messages() {
    const navigate = useNavigate();
    const {
        conversations,
        activeConversation,
        messages,
        isLoading,
        connectionStatus,
        fetchMessages,
        sendMessage,
        backToList,
    } = useChat();
    const { user } = useAuth();

    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, unread
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
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
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.other_user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.last_message?.body?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || (filterType === 'unread' && conv.unread_count > 0);
        return matchesSearch && matchesFilter;
    });

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white text-center px-4">
            <Shield size={48} className="text-slate-200 mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Please sign in</h2>
            <p className="text-slate-500 mt-2">You need to be logged in to view your messages.</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex overflow-hidden">

                {/* Conversations Sidebar */}
                <aside className={`${activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-slate-100 bg-slate-50/30`}>
                    <div className="p-4 border-b border-slate-100 bg-white">
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">My messages</h1>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search messages..."
                                className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#000000]/20 outline-none placeholder:text-slate-500 font-medium"
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${filterType === 'all' ? 'bg-[#000000] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('unread')}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${filterType === 'unread' ? 'bg-[#000000] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                Unread
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                        {filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <MessageSquare className="text-slate-200 mb-3" size={32} />
                                <p className="text-sm font-medium text-slate-500">No messages found</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => fetchMessages(conv.id)}
                                    className={`w-full p-4 text-left transition-all flex items-start gap-3 border-l-4 ${activeConversation?.id === conv.id
                                        ? 'bg-slate-100/50 border-[#000000]'
                                        : 'hover:bg-white border-transparent'
                                        }`}
                                >
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0 text-lg uppercase">
                                        {conv.other_user?.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-slate-900 truncate text-sm">
                                                {conv.other_user?.name}
                                            </span>
                                            {conv.last_message && (
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {formatDate(conv.last_message.created_at)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                                                {conv.last_message?.body || 'No messages yet'}
                                            </p>
                                            {conv.unread_count > 0 && (
                                                <span className="w-5 h-5 bg-[#000000] text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 ml-2 shadow-sm shadow-slate-100">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* Chat Pane */}
                <main className={`${!activeConversation ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white relative`}>
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <header className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shadow-sm shadow-slate-50">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={backToList}
                                        className="md:hidden p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-800 transition-colors"
                                        aria-label="Back to messages"
                                    >
                                        <ArrowLeft size={24} />
                                    </button>
                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-slate-200 uppercase">
                                        {activeConversation.other_user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-900 leading-none">
                                            {activeConversation.other_user?.name}
                                        </h2>
                                        <p className="text-[10px] font-bold text-[#000000] uppercase tracking-widest mt-1">Online</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
                                    <MoreVertical size={20} />
                                </button>
                            </header>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                                {messages.map((msg, idx) => {
                                    const isOwn = msg.sender?.id === user.id;
                                    const showDate = idx === 0 ||
                                        formatDate(messages[idx - 1].created_at) !== formatDate(msg.created_at);

                                    return (
                                        <div key={msg.id} className="space-y-2">
                                            {showDate && (
                                                <div className="flex justify-center my-6">
                                                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 shadow-sm">
                                                        {formatDate(msg.created_at)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                                                    <div
                                                        className={`px-4 py-3 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${isOwn
                                                            ? 'bg-[#000000] text-white rounded-br-none'
                                                            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                                                            }`}
                                                    >
                                                        {msg.body}
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 mt-1 px-1`}>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                            {formatTime(msg.created_at)}
                                                        </span>
                                                        {isOwn && (
                                                            msg.read_at ? (
                                                                <CheckCheck size={14} className="text-[#000000]" />
                                                            ) : (
                                                                <Check size={14} className="text-slate-300" />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <footer className="p-6 border-t border-slate-100 bg-white">
                                <form onSubmit={handleSend} className="flex items-center gap-4">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#000000]/20 outline-none placeholder:text-slate-500"
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || isSending}
                                        className="w-12 h-12 bg-[#000000] text-white rounded-2xl flex items-center justify-center hover:bg-[#1a1a1a] active:scale-95 transition-all shadow-lg shadow-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={20} className="translate-x-0.5 -translate-y-0.5" />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm">
                                <MessageSquare size={40} className="text-[#000000]" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">My messages</h3>
                            <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                                Select a chat from the sidebar to start messaging.
                                Keep your conversations safe and within the platform.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
