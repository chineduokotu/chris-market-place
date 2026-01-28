import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/client';
import echo, { updateEchoAuth } from '../lib/echo';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState('unknown');
    const [typingUsers, setTypingUsers] = useState({});
    const messageIdsRef = useRef(new Set());
    const typingTimeoutsRef = useRef(new Map());

    const getCurrentUserId = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser).id;
        } catch (error) {
            return null;
        }
    };

    const setMessagesWithIds = useCallback((nextMessages) => {
        messageIdsRef.current = new Set(nextMessages.map((message) => message.id));
        setMessages(nextMessages);
    }, []);

    const addMessage = useCallback((message) => {
        if (!message?.id) return;
        if (messageIdsRef.current.has(message.id)) return;
        messageIdsRef.current.add(message.id);
        setMessages((prev) => [...prev, message]);
    }, []);

    const setUserTyping = useCallback((userId) => {
        if (!userId) return;
        setTypingUsers((prev) => ({ ...prev, [userId]: true }));

        const existingTimeout = typingTimeoutsRef.current.get(userId);
        if (existingTimeout) clearTimeout(existingTimeout);

        const timeoutId = setTimeout(() => {
            setTypingUsers((prev) => {
                const next = { ...prev };
                delete next[userId];
                return next;
            });
            typingTimeoutsRef.current.delete(userId);
        }, 2500);

        typingTimeoutsRef.current.set(userId, timeoutId);
    }, []);

    // Fetch all conversations
    const fetchConversations = useCallback(async () => {
        try {
            const response = await api.get('/conversations');
            setConversations(response.data);
            const total = response.data.reduce((sum, c) => sum + (c.unread_count || 0), 0);
            setUnreadTotal(total);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    }, []);

    // Fetch messages for a conversation
    const fetchMessages = useCallback(async (conversationId) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/conversations/${conversationId}`);
            setMessagesWithIds(response.data.messages || []);
            setActiveConversation(response.data);
            // Update unread count
            fetchConversations();
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchConversations]);

    // Start or get existing conversation with a user
    const startConversation = useCallback(async (userId, bookingId = null) => {
        try {
            const response = await api.post('/conversations', { 
                user_id: userId,
                booking_id: bookingId 
            });
            await fetchConversations();
            await fetchMessages(response.data.id);
            setIsOpen(true);
            return response.data;
        } catch (error) {
            console.error('Failed to start conversation:', error);
            throw error;
        }
    }, [fetchConversations, fetchMessages]);

    // Send a message
    const sendMessage = useCallback(async (body, type = 'text') => {
        if (!activeConversation) return;
        
        try {
            const response = await api.post(`/conversations/${activeConversation.id}/messages`, {
                body,
                type,
            });
            addMessage(response.data);
            fetchConversations(); // Update last message preview
            return response.data;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }, [activeConversation, fetchConversations]);

    const sendTyping = useCallback((conversationId) => {
        const channel = echo.private(`conversation.${conversationId}`);
        channel.whisper('typing', {
            user_id: getCurrentUserId(),
            conversation_id: conversationId,
            at: new Date().toISOString(),
        });
    }, []);

    // Mark message as read
    const markAsRead = useCallback(async (messageId) => {
        try {
            await api.post(`/messages/${messageId}/read`);
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    }, []);

    // Open chat widget
    const openChat = useCallback((conversationId = null) => {
        setIsOpen(true);
        if (conversationId) {
            fetchMessages(conversationId);
        }
    }, [fetchMessages]);

    // Close chat widget
    const closeChat = useCallback(() => {
        setIsOpen(false);
        setActiveConversation(null);
        setMessagesWithIds([]);
        setTypingUsers({});
        typingTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        typingTimeoutsRef.current.clear();
    }, []);

    // Go back to conversation list
    const backToList = useCallback(() => {
        setActiveConversation(null);
        setMessagesWithIds([]);
        setTypingUsers({});
        typingTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        typingTimeoutsRef.current.clear();
    }, []);

    // Subscribe to real-time updates when conversation is active
    useEffect(() => {
        if (!activeConversation) return;

        const channel = echo.private(`conversation.${activeConversation.id}`);

        channel.listen('.message.sent', (event) => {
            addMessage(event);
            fetchConversations();
        });

        channel.listen('.message.read', (event) => {
            setMessages((prev) => prev.map((msg) =>
                msg.id === event.message_id
                    ? { ...msg, read_at: event.read_at }
                    : msg
            ));
        });

        channel.listenForWhisper('typing', (event) => {
            const currentUserId = getCurrentUserId();
            if (event?.user_id && event.user_id !== currentUserId) {
                setUserTyping(event.user_id);
            }
        });

        return () => {
            echo.leave(`conversation.${activeConversation.id}`);
            setTypingUsers({});
            typingTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
            typingTimeoutsRef.current.clear();
        };
    }, [activeConversation, addMessage, fetchConversations, setUserTyping]);

    // Track connection state and refresh data on reconnect
    useEffect(() => {
        const connection = echo.connector?.pusher?.connection;
        if (!connection?.bind) return;

        const handleConnected = () => {
            setConnectionStatus('connected');
            fetchConversations();
            if (activeConversation?.id) {
                fetchMessages(activeConversation.id);
            }
        };

        const handleDisconnected = () => setConnectionStatus('disconnected');
        const handleUnavailable = () => setConnectionStatus('unavailable');
        const handleError = () => setConnectionStatus('error');
        const handleStateChange = (states) => {
            if (states?.current) setConnectionStatus(states.current);
        };

        connection.bind('connected', handleConnected);
        connection.bind('disconnected', handleDisconnected);
        connection.bind('unavailable', handleUnavailable);
        connection.bind('error', handleError);
        connection.bind('state_change', handleStateChange);

        return () => {
            connection.unbind('connected', handleConnected);
            connection.unbind('disconnected', handleDisconnected);
            connection.unbind('unavailable', handleUnavailable);
            connection.unbind('error', handleError);
            connection.unbind('state_change', handleStateChange);
        };
    }, [activeConversation, fetchConversations, fetchMessages]);

    // Update Echo auth when token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            updateEchoAuth(token);
            fetchConversations();
        }
    }, [fetchConversations]);

    const value = {
        conversations,
        activeConversation,
        messages,
        isOpen,
        isLoading,
        unreadTotal,
        connectionStatus,
        typingUsers,
        fetchConversations,
        fetchMessages,
        startConversation,
        sendMessage,
        sendTyping,
        markAsRead,
        openChat,
        closeChat,
        backToList,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}

export default ChatContext;
