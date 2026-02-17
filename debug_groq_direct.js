require('dotenv').config({ path: 'server/.env' });
const Groq = require('groq-sdk');

async function testGroq() {
    console.log('Testing Groq Direct...');
    console.log('API Key Present:', !!process.env.GROQ_API_KEY);
    console.log('Key length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: 'Say hello' }
            ],
            model: 'mixtral-8x7b-32768',
        });

        console.log('Success:', chatCompletion.choices[0]?.message?.content);
    } catch (err) {
        console.error('Groq Error:', err);
    }
}

testGroq();
