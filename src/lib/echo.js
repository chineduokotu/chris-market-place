import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
window.Pusher = Pusher;

const prodApiUrl = 'https://chris-market-place-server.onrender.com/api';
const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : prodApiUrl);
const apiBaseUrl = apiUrl.replace(/\/api\/?$/, '');
const apiHost = new URL(apiBaseUrl).hostname;
const apiProtocol = new URL(apiBaseUrl).protocol.replace(':', '');

const scheme = import.meta.env.VITE_REVERB_SCHEME || apiProtocol || 'http';
const isSecure = scheme === 'https';
const resolvedPort = Number(import.meta.env.VITE_REVERB_PORT || (isSecure ? 443 : 80));

// Create and configure Laravel Echo instance
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'servicehub-key',
    wsHost: import.meta.env.VITE_REVERB_HOST || apiHost,
    wsPort: resolvedPort,
    wssPort: resolvedPort,
    forceTLS: isSecure,
    enabledTransports: isSecure ? ['wss'] : ['ws', 'wss'],
    disableStats: true,
    authEndpoint: `${apiBaseUrl}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    },
});

// Update auth headers when token changes
export const updateEchoAuth = (token) => {
    if (!echo?.connector?.options?.auth?.headers) return;
    if (token) {
        echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
        return;
    }
    delete echo.connector.options.auth.headers.Authorization;
};

export default echo;
