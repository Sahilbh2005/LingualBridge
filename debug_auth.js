const axios = require('axios');

async function testRegister() {
    try {
        console.log('Attempting registration...');
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            username: `debug_${Date.now()}`,
            email: `debug_${Date.now()}@example.com`,
            password: 'password123',
            nativeLanguage: 'English'
        });
        console.log('Registration Success:', res.status);
        const token = res.data.token;
        console.log('Token received:', token ? 'Yes' : 'No');

        if (token) {
            console.log('Attempting to access /api/auth/me...');
            const meRes = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { 'x-auth-token': token }
            });
            console.log('Get Me Success:', meRes.status, meRes.data);
        }
    } catch (err) {
        console.error('Test Failed:', err.message);
        if (err.response) {
            const fs = require('fs');
            fs.writeFileSync('auth_error.log', JSON.stringify(err.response.data, null, 2));
            console.log('Error details written to auth_error.log');
        }
    }
}

testRegister();
