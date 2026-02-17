const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    language: { type: String, required: true },
    level: { type: String, required: true },
    description: String,
    sections: [{
        title: { type: String, required: true },
        chapters: [{
            chapterId: { type: String, required: true },
            title: { type: String, required: true },
            content: String,
            subtitles: String,
            transliteration: String,
            grammarTips: String,
            order: Number
        }]
    }],
    orderIndex: { type: Number, default: 100 },
    createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', CourseSchema);

async function seed() {
    try {
        await mongoose.connect('mongodb+srv://sahilbhandari:Sahil02468@cluster0.77dei8m.mongodb.net/');
        console.log('Connected to MongoDB');

        await Course.deleteMany({});
        console.log('Cleared existing courses');

        const languages = [
            // Order specified by user
            { title: 'English', code: 'EN', type: 'foreign' },
            { title: 'Hindi', code: 'HI', type: 'indian' },
            // Indian
            { title: 'Gujarati', code: 'GU', type: 'indian' },
            { title: 'Punjabi', code: 'PA', type: 'indian' },
            { title: 'Kannada', code: 'KN', type: 'indian' },
            { title: 'Telugu', code: 'TE', type: 'indian' },
            { title: 'Tamil', code: 'TA', type: 'indian' },
            { title: 'Malayalam', code: 'ML', type: 'indian' },
            { title: 'Bengali', code: 'BN', type: 'indian' },
            { title: 'Assamese', code: 'AS', type: 'indian' },
            { title: 'Odia', code: 'OR', type: 'indian' },
            { title: 'Urdu', code: 'UR', type: 'indian' },
            { title: 'Sanskrit', code: 'SA', type: 'indian' },
            { title: 'Nepali', code: 'NE', type: 'indian' },
            { title: 'Tulu', code: 'TU', type: 'indian' },
            { title: 'Marathi', code: 'MR', type: 'indian' },
            { title: 'Konkani', code: 'KO', type: 'indian' },
            // Foreign
            { title: 'French', code: 'FR', type: 'foreign' },
            { title: 'German', code: 'DE', type: 'foreign' },
            { title: 'Spanish', code: 'ES', type: 'foreign' },
            { title: 'Italian', code: 'IT', type: 'foreign' },
            { title: 'Portuguese', code: 'PT', type: 'foreign' },
            { title: 'Russian', code: 'RU', type: 'foreign' },
            { title: 'Japanese', code: 'JA', type: 'foreign' },
            { title: 'Korean', code: 'KO-KR', type: 'foreign' },
            { title: 'Chinese (Mandarin)', code: 'ZH', type: 'foreign' },
            { title: 'Arabic', code: 'AR', type: 'foreign' }
        ];

        const mockCourses = languages.map((lang, index) => {
            const sections = [
                {
                    title: 'Beginner',
                    chapters: [
                        { chapterId: `${lang.code.toLowerCase()}_b1`, title: 'Greetings & Etiquette', content: `Master 'Hello', 'Goodbye', and basic politeness in ${lang.title}.`, transliteration: 'Greetings', subtitles: 'Welcome Phrases', order: 1 },
                        { chapterId: `${lang.code.toLowerCase()}_b2`, title: 'The Script & Core Sounds', content: `Learn the ${lang.title} alphabet or script characters and their correct phonics.`, transliteration: 'Letters', subtitles: 'Phonics Guide', order: 2 },
                        { chapterId: `${lang.code.toLowerCase()}_b3`, title: 'Basic Numbers (1-20)', content: 'Counting and identifying small quantities.', transliteration: 'Counting', subtitles: '1 to 20', order: 3 }
                    ]
                },
                {
                    title: 'Intermediate',
                    chapters: [
                        { chapterId: `${lang.code.toLowerCase()}_i1`, title: 'Sentence Formation', content: 'Building simple S-V-O sentences for daily needs.', grammarTips: 'Focus on word order.', order: 1 },
                        { chapterId: `${lang.code.toLowerCase()}_i2`, title: 'Essential Grammar', content: 'Tenses (Present/Past) and primary pronoun usage.', grammarTips: 'Verb endings vary by subject.', order: 2 },
                        { chapterId: `${lang.code.toLowerCase()}_i3`, title: 'Shopping & Dining Out', content: 'Practical conversation for ordering food and asking prices.', order: 3 }
                    ]
                },
                {
                    title: 'Advanced',
                    chapters: [
                        { chapterId: `${lang.code.toLowerCase()}_a1`, title: 'Native Expressions', content: 'Learning local idioms and commonly used slang.', order: 1 },
                        { chapterId: `${lang.code.toLowerCase()}_a2`, title: 'Professional Writing', content: 'Drafting emails and formal letters in a work context.', order: 2 },
                        { chapterId: `${lang.code.toLowerCase()}_a3`, title: 'Cultural Mastery', content: 'Advanced nuances of history, traditions, and dialects.', order: 3 }
                    ]
                }
            ];

            return {
                title: `${lang.title} Mastery`,
                language: lang.title,
                level: 'All Levels',
                description: `A complete structured path to master ${lang.title} language. From your first 'Hello' to full native-like fluency.`,
                sections: sections,
                orderIndex: index
            };
        });

        const docs = await Course.insertMany(mockCourses);
        console.log(`Successfully seeded ${docs.length} courses!`);

    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seed();
