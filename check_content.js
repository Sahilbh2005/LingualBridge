const data = require('./server/data/curriculumData');

const marathi = data.contentMap['Marathi'];
const hindi = data.contentMap['Hindi'];

const missingSections = [];
for (const section in marathi) {
    if (!hindi[section]) {
        missingSections.push(section);
    }
}

console.log('Missing sections in Hindi:', missingSections);

for (const section in marathi) {
    if (hindi[section]) {
        console.log(`Checking items in section: ${section}`);
        const mItems = marathi[section].vocabulary || [];
        const hItems = hindi[section].vocabulary || [];
        console.log(`Marathi: ${mItems.length}, Hindi: ${hItems.length}`);
    }
}
