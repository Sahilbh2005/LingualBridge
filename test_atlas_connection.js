const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function testConnection() {
    const mongoUri = process.env.MONGO_URI;
    console.log('--- MongoDB Connectivity Test ---');
    console.log('Target URI:', mongoUri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

    try {
        console.log('Attempting to connect...');
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        console.log('✅ Success! Connected to MongoDB Atlas.');

        // Try a simple ping or list databases
        const admin = mongoose.connection.db.admin();
        const info = await admin.serverStatus();
        console.log('Cluster Version:', info.version);

        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed!');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);

        if (err.message.includes('ReplicaSetNoPrimary') || err.message.includes('whitelist')) {
            console.log('\n--- Troubleshooting Tip ---');
            console.log('This error usually means your current IP address is not whitelisted in MongoDB Atlas.');
            console.log('1. Go to https://cloud.mongodb.com/');
            console.log('2. Navigate to "Network Access" in the left sidebar.');
            console.log('3. Click "+ Add IP Address".');
            console.log('4. Click "Add Current IP Address" and then "Confirm".');
            console.log('5. Wait a minute for the changes to apply, then run this test again.');
        }

        process.exit(1);
    }
}

testConnection();
