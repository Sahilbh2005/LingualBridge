const mongoose = require('mongoose');

const SectionTemplateSchema = new mongoose.Schema({
    templateId: {
        type: String, // e.g., 'greetings', 'alphabet'
        required: true,
        unique: true
    },
    title: {
        type: String, // e.g., 'Greetings & Basics'
        required: true
    },
    description: String,
    icon: String, // Emoji or Image URL
    order: {
        type: Number,
        default: 100
    },
    enabled: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('SectionTemplate', SectionTemplateSchema);
