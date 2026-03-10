require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/lingualbridge');
        console.log('Connected');
    } catch (err) {
        console.error(err);
    }
    process.exit();
};
connectDB();
