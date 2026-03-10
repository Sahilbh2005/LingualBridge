const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    nativeName: String, // e.g. 'मराठी'
    flag: String, // Emoji or Image URL
    enabled: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 100
    }
});

module.exports = mongoose.model('Language', LanguageSchema);
