const d = require('../data/curriculumData');
const r = require('../data/regionalCurriculum');
const langs = Object.keys(r);
const cats = ['greetings', 'colors', 'numbers', 'family', 'fruits', 'vegetables', 'directions', 'shapes'];
let mismatches = 0;
langs.forEach(lang => {
    cats.forEach(cat => {
        const marMap = d.contentMap && d.contentMap['Marathi'] && d.contentMap['Marathi'][cat];
        const vocab = marMap && marMap.vocabulary;
        const langMap = r[lang][cat] || {};
        if (!vocab) return;
        vocab.forEach(v => {
            const key = v.word;
            if (!langMap[key]) {
                console.log('[MISSING] ' + lang + '/' + cat + ': "' + key + '"');
                mismatches++;
            }
        });
    });
});
console.log(mismatches === 0 ? 'All keys match!' : 'Total mismatches: ' + mismatches);
