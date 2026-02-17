/**
 * Image Fetching Service
 * Automates image URL generation using Unsplash Source 
 * based on English vocabulary meanings.
 */

const getStableSeed = (str) => {
    if (!str) return 42;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 1000;
};

const generateImageUrl = (englishMeaning) => {
    if (!englishMeaning || typeof englishMeaning !== 'string') {
        return '/images/default.png';
    }

    const keyword = englishMeaning.trim().toLowerCase();
    const stableSeed = getStableSeed(keyword);
    const prompt = `educational illustration of ${keyword}, clean white background, high quality 3d render style`;

    return `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=512&height=512&seed=${stableSeed}&nologo=true`;
};

module.exports = {
    generateImageUrl
};
