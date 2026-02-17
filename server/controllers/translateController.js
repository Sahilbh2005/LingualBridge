const Translation = require('../models/Translation');
const Groq = require('groq-sdk');

// @desc    Translate text
// @route   POST /api/translate
// @access  Private
exports.translateText = async (req, res) => {
    const { sourceText, targetLang, sourceLang } = req.body;

    if (!sourceText || !targetLang) {
        return res.status(400).json({ msg: 'Please provide text and target language' });
    }

    try {
        console.log(`[Translate API] Request: Source="${sourceText}", Target="${targetLang}", KeyAvailable=${!!process.env.GROQ_API_KEY}`);
        let translatedText = '';

        // Check for API Key
        if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

            const systemPrompt = `You are a professional translator fluent in Indian and Global languages.
        Translate the user's text from ${sourceLang || 'English'} to ${targetLang}.
        
        IMPORTANT: Return the response in strictly valid JSON format with the following structure:
        {
            "translation": "The translated text in the target language's native script",
            "transliteration": "The pronunciation guide in English/Roman script"
        }

        Rules:
        1. "translation" must be in the native script (e.g., Devanagari for Hindi).
        2. "transliteration" is mandatory for non-Latin scripts. If the target script is already Latin (e.g., French, Spanish), use the same text or a phonetic guide if helpful.
        3. Do NOT add any markdown formatting like \`\`\`json. Just return the raw JSON string.`;

            console.log('[Translate API] Calling Groq API...');
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: sourceText }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.3,
                max_tokens: 1024,
                response_format: { type: "json_object" } // Enforce JSON mode
            });

            const content = chatCompletion.choices[0]?.message?.content;
            console.log(`[Translate API] Groq Raw Response: "${content}"`);

            try {
                const parsed = JSON.parse(content);
                translatedText = parsed.translation;
                // We'll append transliteration to the text for storage compatibility, 
                // or ideally we should update the model. For now, let's combine them for the string field
                // but we can send structured data back to frontend if we want.
                // To keep it simple with existing DB schema which expects a string:
                // We will store "Translation (Transliteration)" or just return JSON to frontend and store JSON string.
                // Let's store JSON string in DB for future flexibility, code below assumes string.
                // Actually, let's store a combined string for now to avoid breaking schema changes immediately,
                // but send structured data to frontend.
                // Wait, the frontend expects `translatedText` string.
                // Let's modify the response to send both objects.

                // Hack: We'll save the stringified JSON in the DB 'translatedText' field for now 
                // so we don't have to change the Mongoose schema in this step.
                translatedText = JSON.stringify(parsed);

            } catch (e) {
                console.error("Failed to parse JSON", e);
                translatedText = content; // Fallback to raw content
            }

        } else {
            console.log('[Translate API] No valid API Key found. Using fallback.');
            // Fallback
            const mockResponse = {
                translation: `(Mock) ${sourceText}`,
                transliteration: `(Mock Transliteration)`
            };
            if (targetLang === 'Tulu') {
                mockResponse.translation = 'Namaskara';
                mockResponse.transliteration = 'Namaskara';
            }
            translatedText = JSON.stringify(mockResponse);
        }

        const newTranslation = new Translation({
            user: req.user.id,
            sourceText,
            translatedText,
            sourceLang,
            targetLang
        });

        const savedTranslation = await newTranslation.save();
        console.log('[Translate API] Translation saved to DB.');

        res.json(savedTranslation);
    } catch (err) {
        console.error('[Translate API] Error:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Get user translation history
// @route   GET /api/translate/history
// @access  Private
exports.getTranslationHistory = async (req, res) => {
    try {
        const history = await Translation.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
