import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function BottomNav() {
    const { logout, user } = useAuth();
    const { unreadTotal } = useChat();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Chat', path: '/messages', icon: MessageSquare, badge: unreadTotal },
        { name: 'Profile', path: '/profile', icon: User },
        ...(user ? [{ name: 'Logout', action: () => logout(), icon: LogOut }] : []),
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 px-2 pb-safe">
            <div className="flex justify-between items-center h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const content = (
                        <>
                            <div className={`relative ${item.primary ? 'p-1 bg-[#000000] text-white rounded-lg -mt-1 shadow-lg shadow-slate-100' : ''}`}>
                                <item.icon size={item.primary ? 22 : 24} strokeWidth={isActive(item.path) ? 2.5 : 2} />

                                {!item.primary && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-bold tracking-tight ${isActive(item.path) ? 'text-[#000000]' : 'text-slate-500'}`}>
                                {item.name}
                            </span>
                        </>
                    );

                    if (item.action) {
                        return (
                            <button
                                key={item.name}
                                onClick={item.action}
                                className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative text-slate-500 active:bg-slate-50"
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative ${isActive(item.path) ? 'text-[#3db83a]' : 'text-slate-400 active:bg-slate-50'
                                }`}
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
