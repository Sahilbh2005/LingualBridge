const axios = require('axios');

async function testTranslation() {
    try {
        console.log('1. Registering/Logging in to get token...');
        const authRes = await axios.post('http://localhost:5000/api/auth/register', {
            username: `json_test_${Date.now()}`,
            email: `json_${Date.now()}@test.com`,
            password: 'password123',
            nativeLanguage: 'English'
        });

        const token = authRes.data.token;
        console.log('   Token received.');

        console.log('2. Sending Translation Request (English -> Kannada)...');
        const payload = {
            sourceText: "Good morning",
            targetLang: "Kannada",
            sourceLang: "English"
        };

        const config = {
            headers: { 'x-auth-token': token }
        };

        const transRes = await axios.post('http://localhost:5000/api/translate', payload, config);

        console.log('   Response received.');
        console.log('   Raw Data:', transRes.data.translatedText);

        try {
            const parsed = JSON.parse(transRes.data.translatedText);
            console.log('   ✅ Parsed Successfully:');
            console.log('   Translation:', parsed.translation);
            console.log('   Transliteration:', parsed.transliteration);
        } catch (e) {
            console.log('   ❌ Failed to parse JSON:', e.message);
        }

    } catch (err) {
        console.error('Test Failed:', err.message);
        if (err.response) {
            console.error('Server Response:', err.response.data);
        }
    }
}

testTranslation();
