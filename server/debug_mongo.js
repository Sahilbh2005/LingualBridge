const mongoose = require('mongoose');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB at:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB Connection Failed!');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
        process.exit(1);
    });
