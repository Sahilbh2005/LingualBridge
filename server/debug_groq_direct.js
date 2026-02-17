require('dotenv').config({ path: '.env' });
const Groq = require('groq-sdk');

async function testGroq() {
    console.log('Testing Groq Direct (from server dir)...');
    console.log('API Key Present:', !!process.env.GROQ_API_KEY);

    if (!process.env.GROQ_API_KEY) {
        console.error('API Key Missing!');
        return;
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: 'Say hello' }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        console.log('Success:', chatCompletion.choices[0]?.message?.content);
    } catch (err) {
        console.error('Groq Error:', err);
    }
}

testGroq();
