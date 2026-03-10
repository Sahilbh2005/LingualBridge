const data = require('./server/data/curriculumData');

const marathi = data.contentMap['Marathi'];
const hindi = data.contentMap['Hindi'];

const marathiSections = Object.keys(marathi);
console.log('Marathi Sections:', marathiSections);

const hindiSections = Object.keys(hindi);
console.log('Hindi Sections:', hindiSections);

marathiSections.forEach(section => {
    const mVocab = marathi[section].vocabulary || [];
    const hVocab = (hindi[section] && hindi[section].vocabulary) || [];
    console.log(`Section: ${section} | Marathi items: ${mVocab.length} | Hindi items: ${hVocab.length}`);
});
