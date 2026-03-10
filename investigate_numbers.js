const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function run() {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);

        // Define a minimal schema
        const Vocab = mongoose.model('VocabInvestigate', new mongoose.Schema({
            language: String,
            category: String,
            word: String,
            nativeFigure: String,
            meaning: String,
            order: Number
        }), 'vocabularies');

        const languages = ['Marathi', 'Hindi'];
        for (const lang of languages) {
            console.log(`\n--- ${lang} Numbers ---`);
            const items = await Vocab.find({ language: lang, category: 'numbers' }).sort({ order: 1 });
            console.log(`Total count: ${items.length}`);

            const missingFigure = items.filter(i => !i.nativeFigure);
            const missingWord = items.filter(i => !i.word);
            const zeroOrder = items.filter(i => i.order === 0);

            console.log(`Missing nativeFigure: ${missingFigure.length}`);
            console.log(`Missing word: ${missingWord.length}`);
            console.log(`Order is 0: ${zeroOrder.length}`);

            if (items.length > 0) {
                console.log('Sample (first 5):');
                items.slice(0, 5).forEach(i => console.log(`${i.order}: ${i.word} | ${i.nativeFigure} | ${i.meaning}`));
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

run();
