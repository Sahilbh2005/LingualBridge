const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const Vocabulary = require('./models/Vocabulary');
const curriculumData = require('./data/curriculumData');

// Connect to MongoDB
const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB at:', process.env.MONGO_URI || 'mongodb://localhost:27017/linguasetu');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/linguasetu');
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const Language = require('./models/Language');
const SectionTemplate = require('./models/SectionTemplate');

const seedData = async () => {
    await connectDB();

    // 1. Seed Languages
    console.log('-----------------------------------');
    console.log('SEADING: Languages...');
    await Language.deleteMany({});

    // Default languages to seed
    const defaultLanguages = [
        { name: 'Marathi', code: 'MR', nativeName: 'मराठी', flag: '🇮🇳' },
        { name: 'Hindi', code: 'HI', nativeName: 'हिंदी', flag: '🇮🇳' },
        { name: 'English', code: 'EN', nativeName: 'English', flag: '🇺🇸' },
        // Can add more placeholders
    ];
    await Language.insertMany(defaultLanguages);
    console.log(`✅ Seeded ${defaultLanguages.length} Languages.`);


    // 2. Seed Section Templates (Master Structure)
    console.log('-----------------------------------');
    console.log('SEEDING: Section Templates (Master Structure)...');
    await SectionTemplate.deleteMany({});

    const sections = curriculumData.sections || [
        { id: 'greetings', title: 'Greetings & Basics' },
        { id: 'alphabet', title: 'Alphabet & Phonics' },
        { id: 'barakhadi', title: 'Barakhadi (Combinations)' },
        { id: 'numbers', title: 'Numbers (1 - 1M)' },
        { id: 'family', title: 'Family & Relations' },
        { id: 'colors', title: 'Colors & Appearances' }, // Assuming these exist
        { id: 'shapes', title: 'Shapes & geometry' },
        { id: 'fruits', title: 'Fruits' },
        { id: 'vegetables', title: 'Vegetables' }
    ];

    const sectionDocs = sections.map((s, idx) => ({
        templateId: s.id,
        title: s.title,
        order: idx + 1,
        enabled: true
    }));

    await SectionTemplate.insertMany(sectionDocs);
    console.log(`✅ Seeded ${sectionDocs.length} Section Templates.`);


    // 3. Seed Vocabulary
    console.log('-----------------------------------');
    console.log('SEEDING: Vocabulary Content...');
    await Vocabulary.deleteMany({}); // Clear existing to avoid duplicates during dev

    const languages = Object.keys(curriculumData.contentMap);
    let totalDocs = 0;

    for (const lang of languages) {
        const categories = Object.keys(curriculumData.contentMap[lang]);

        for (const cat of categories) {
            const vocabList = curriculumData.contentMap[lang][cat].vocabulary || [];
            if (vocabList.length === 0) continue;

            const docs = vocabList.map((v, index) => ({
                language: lang,
                category: cat,
                word: v.word,
                nativeFigure: v.nativeFigure,
                icon: v.icon,
                transliteration: v.transliteration,
                meaning: v.meaning,
                pronunciation: v.pronunciation,
                example: v.example,
                imagePrompt: v.imagePrompt,
                ttsText: v.ttsText,
                order: index + 1
            }));

            if (docs.length > 0) {
                await Vocabulary.insertMany(docs);
                totalDocs += docs.length;
            }
        }
    }

    console.log(`✅ Seeded ${totalDocs} vocabulary items.`);
    console.log('-----------------------------------');
    console.log('DB MIGRATION COMPLETE! 🚀');
    process.exit();
};

seedData();
