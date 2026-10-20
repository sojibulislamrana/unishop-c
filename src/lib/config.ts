export const getApiUrl = () => {
    // 1. Prioritize Environment Variable (Set in Vercel Dashboard / .env.local)
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    }

    // 2. Production Default fallback
    if (process.env.NODE_ENV === 'production') {
        return 'https://unishop-server.vercel.app';
    }

    // 3. Default for Local Development
    return 'http://localhost:5001';
};
