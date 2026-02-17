
// Helper for Hindi Extended Data
const hindiWords = [
    { word: 'नमस्ते', translation: 'Hello', transliteration: 'Namaste', category: 'Greetings' },
    { word: 'धन्यवाद', translation: 'Thank you', transliteration: 'Dhanyavaad', category: 'Etiquette' },
    { word: 'पानी', translation: 'Water', transliteration: 'Paani', category: 'Basics' },
    { word: 'दोस्त', translation: 'Friend', transliteration: 'Dost', category: 'Basics' },
    { word: 'खाना', translation: 'Food', transliteration: 'Khana', category: 'Basics' },
    { word: 'घर', translation: 'Home', transliteration: 'Ghar', category: 'Basics' },
    { word: 'किताब', translation: 'Book', transliteration: 'Kitaab', category: 'Objects' },
    { word: 'कलम', translation: 'Pen', transliteration: 'Kalam', category: 'Objects' },
    { word: 'मेज', translation: 'Table', transliteration: 'Mej', category: 'Objects' },
    { word: 'कुर्सी', translation: 'Chair', transliteration: 'Kursi', category: 'Objects' },
    { word: 'सूरज', translation: 'Sun', transliteration: 'Suraj', category: 'Nature' },
    { word: 'चाँद', translation: 'Moon', transliteration: 'Chaand', category: 'Nature' },
    { word: 'पेड़', translation: 'Tree', transliteration: 'Ped', category: 'Nature' },
    { word: 'फूल', translation: 'Flower', transliteration: 'Phool', category: 'Nature' },
    { word: 'नदी', translation: 'River', transliteration: 'Nadi', category: 'Nature' },
    { word: 'पहाड़', translation: 'Mountain', transliteration: 'Pahaad', category: 'Nature' },
    { word: 'शेर', translation: 'Lion', transliteration: 'Sher', category: 'Animals' },
    { word: 'हाथी', translation: 'Elephant', transliteration: 'Haathi', category: 'Animals' },
    { word: 'मोर', translation: 'Peacock', transliteration: 'Mor', category: 'Animals' },
    { word: 'मछली', translation: 'Fish', transliteration: 'Machhli', category: 'Animals' }
];

const hindiSentences = [
    { scrambled: ['मेरा', 'नाम', 'साहिल', 'है'], correct: 'मेरा नाम साहिल है', translation: 'My name is Sahil', transliteration: 'Mera naam Sahil hai' },
    { scrambled: ['आप', 'कैसे', 'हैं', '?'], correct: 'आप कैसे हैं ?', translation: 'How are you?', transliteration: 'Aap kaise hain?' },
    { scrambled: ['मुझे', 'पानी', 'चाहिए'], correct: 'मुझे पानी चाहिए', translation: 'I want water', transliteration: 'Mujhe paani chahiye' },
    { scrambled: ['यह', 'मेरी', 'किताब', 'है'], correct: 'यह मेरी किताब है', translation: 'This is my book', transliteration: 'Yeh meri kitaab hai' },
    { scrambled: ['आज', 'मौसम', 'अच्छा', 'है'], correct: 'आज मौसम अच्छा है', translation: 'The weather is good today', transliteration: 'Aaj mausam achha hai' },
    { scrambled: ['वह', 'मेरा', 'दोस्त', 'है'], correct: 'वह मेरा दोस्त है', translation: 'He is my friend', transliteration: 'Woh mera dost hai' },
    { scrambled: ['मुझे', 'सेब', 'पसंद', 'है'], correct: 'मुझे सेब पसंद है', translation: 'I like apples', transliteration: 'Mujhe seb pasand hai' },
    { scrambled: ['राम', 'स्कूल', 'जाता', 'है'], correct: 'राम स्कूल जाता है', translation: 'Ram goes to school', transliteration: 'Ram school jaata hai' },
    { scrambled: ['भारत', 'महान', 'देश', 'है'], correct: 'भारत महान देश है', translation: 'India is a great country', transliteration: 'Bharat mahaan desh hai' },
    { scrambled: ['तुम', 'कहाँ', 'रहते', 'हो', '?'], correct: 'तुम कहाँ रहते हो ?', translation: 'Where do you live?', transliteration: 'Tum kahaan rehte ho?' },
    { scrambled: ['क्या', 'समय', 'हुआ', 'है', '?'], correct: 'क्या समय हुआ है ?', translation: 'What time is it?', transliteration: 'Kya samay hua hai?' },
    { scrambled: ['मैं', 'हिन्दी', 'सीख', 'रहा', 'हूँ'], correct: 'मैं हिन्दी सीख रहा हूँ', translation: 'I am learning Hindi', transliteration: 'Mein Hindi seekh raha hoon' },
    { scrambled: ['यह', 'बहुत', 'महँगा', 'है'], correct: 'यह बहुत महँगा है', translation: 'This is very expensive', transliteration: 'Yeh bahut mahanga hai' },
    { scrambled: ['कृपया', 'यहाँ', 'आइये'], correct: 'कृपया यहाँ आइये', translation: 'Please come here', transliteration: 'Kripya yahaan aaiye' },
    { scrambled: ['धन्यवाद', 'आपका', 'दिन', 'शुभ हो'], correct: 'धन्यवाद आपका दिन शुभ हो', translation: 'Thank you, have a nice day', transliteration: 'Dhanyavaad, aapka din shubh ho' }
];

export const gameContent = {
    Hindi: {
        wordMatch: hindiWords,
        sentenceBuilder: hindiSentences,
        speedQuiz: hindiWords.map(w => ({
            question: `What is "${w.translation}" in Hindi?`,
            options: [w.transliteration, hindiWords[Math.floor(Math.random() * hindiWords.length)].transliteration, 'Something else'],
            answer: w.transliteration
        })),
        listenPick: hindiWords.map(w => ({
            audioText: w.word,
            translation: w.translation,
            options: [w.word, hindiWords[Math.floor(Math.random() * hindiWords.length)].word, hindiWords[Math.floor(Math.random() * hindiWords.length)].word],
            correct: w.word
        }))
    },
    English: {
        wordMatch: hindiWords.map(w => ({ word: w.translation, translation: w.word, transliteration: w.transliteration })),
        sentenceBuilder: hindiSentences.map(s => ({ scrambled: s.translation.split(' '), correct: s.translation, translation: s.correct })),
        speedQuiz: [
            { question: 'Opposite of "Hot"?', options: ['Cold', 'Warm', 'Ice'], answer: 'Cold' }
        ],
        listenPick: hindiWords.map(w => ({
            audioText: w.translation,
            translation: w.word,
            options: [w.translation, 'No', 'Yes'],
            correct: w.translation
        }))
    }
    // Add other languages fallback via generator
};

export const getGenericContent = (lang) => {
    // Generate at least 15 items for any selected language
    const genericWords = [];
    const genericSentences = [];

    for (let i = 1; i <= 20; i++) {
        genericWords.push({
            word: `${lang} Word ${i} (${lang})`,
            translation: `English Meaning ${i}`,
            transliteration: `Pro-nounce ${i}`
        });
        genericSentences.push({
            scrambled: [`Word${i}`, 'Learning', lang],
            correct: `Word${i} Learning ${lang}`,
            translation: `I am learning ${lang} word ${i}`
        });
    }

    return {
        wordMatch: genericWords,
        sentenceBuilder: genericSentences,
        speedQuiz: genericWords.map(w => ({
            question: `Which is the correct translation for ${w.word}?`,
            options: [w.translation, 'Wrong 1', 'Wrong 2'],
            answer: w.translation
        })),
        listenPick: genericWords.map(w => ({
            audioText: w.word,
            translation: w.translation,
            options: [w.word, 'Other 1', 'Other 2'],
            correct: w.word
        }))
    };
};
