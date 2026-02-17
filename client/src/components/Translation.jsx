import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMicrophone, 
    faVolumeHigh, 
    faClipboard 
} from '@fortawesome/free-solid-svg-icons';

const Translation = () => {
    const [sourceText, setSourceText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Hindi');
    const [result, setResult] = useState({ translation: '', transliteration: '' });
    const [loading, setLoading] = useState(false);

    const languages = [
        // Indian Languages
        { code: 'Hindi', name: 'Hindi (हिंदी)' },
        { code: 'Kannada', name: 'Kannada (ಕನ್ನಡ)' },
        { code: 'Tulu', name: 'Tulu (ತುಳು)' },
        { code: 'Konkani', name: 'Konkani (कोंकणी)' },
        { code: 'Tamil', name: 'Tamil (தமிழ்)' },
        { code: 'Telugu', name: 'Telugu (తెలుగు)' },
        { code: 'Malayalam', name: 'Malayalam (മലയാളം)' },
        { code: 'Marathi', name: 'Marathi (ಮರಾठी)' },
        { code: 'Bengali', name: 'Bengali (বাংলা)' },
        { code: 'Gujarati', name: 'Gujarati (ગુજરાતી)' },
        { code: 'Punjabi', name: 'Punjabi (ਪੰਜਾਬੀ)' },
        { code: 'Urdu', name: 'Urdu (اردو)' },
        // Global Languages
        { code: 'Spanish', name: 'Spanish (Español)' },
        { code: 'French', name: 'French (Français)' },
        { code: 'German', name: 'German (Deutsch)' },
        { code: 'Italian', name: 'Italian (Italiano)' },
        { code: 'Portuguese', name: 'Portuguese (Português)' },
        { code: 'Russian', name: 'Russian (Русский)' },
        { code: 'Chinese', name: 'Chinese (中文)' },
        { code: 'Japanese', name: 'Japanese (日本語)' },
        { code: 'Korean', name: 'Korean (한국어)' },
        { code: 'Arabic', name: 'Arabic (العربية)' },
    ];

    const handleTranslate = async () => {
        if (!sourceText) return;
        setLoading(true);
        setResult({ translation: '', transliteration: '' });

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            const payload = {
                sourceText,
                targetLang: targetLanguage,
                sourceLang: 'English'
            };

            const res = await axios.post('http://localhost:5000/api/translate', payload, config);
            
            // Backend now returns a stringified JSON in translatedText
            try {
                const parsed = JSON.parse(res.data.translatedText);
                setResult(parsed);
            } catch (e) {
                // Fallback for backward compatibility or errors
                setResult({ translation: res.data.translatedText, transliteration: '' });
            }
        } catch (err) {
            console.error('[Frontend] Translation Error:', err);
            setResult({ translation: 'Error translating text.', transliteration: 'Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text transition-colors duration-300">AI Translator</h2>

            <div className="bg-surface p-6 rounded-2xl shadow-lg transition-colors duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Source */}
                    <div className="space-y-4">
                        <label className="block text-text font-bold opacity-80">English (Source)</label>
                        <textarea
                            className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none bg-background text-text transition-colors duration-300"
                            placeholder="Type text to translate..."
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                        />
                        <div className="flex justify-between items-center text-gray-500 text-sm">
                            <span>{sourceText.length} chars</span>
                            <button className="text-primary hover:underline flex items-center gap-2">
                                <FontAwesomeIcon icon={faMicrophone} />
                                User Voice Input
                            </button>
                        </div>
                    </div>

                    {/* Target */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-text font-bold opacity-80">Target Language</label>
                            <select
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-primary max-w-[200px] bg-background text-text"
                            >
                                {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full h-40 p-4 border rounded-xl bg-background flex flex-col justify-center items-center text-center overflow-auto relative transition-colors duration-300">
                            {loading ? (
                                <div className="flex flex-col items-center space-y-2 text-primary">
                                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                                    <span>Translating...</span>
                                </div>
                            ) : (
                                <>
                                    {result.translation ? (
                                        <>
                                            <p className="text-2xl font-bold text-text mb-2 transition-colors duration-300">{result.translation}</p>
                                            {result.transliteration && (
                                                <p className="text-md text-primary font-medium opacity-80">{result.transliteration}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-text opacity-50">Translation will appear here...</p>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex justify-end items-center space-x-4">
                            <button className="text-primary hover:underline flex items-center gap-2" onClick={() => alert('Playing Audio (TTS Placeholder)...')}>
                                <FontAwesomeIcon icon={faVolumeHigh} />
                                Listen
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 flex items-center gap-2" onClick={() => { navigator.clipboard.writeText(result.translation) }}>
                                <FontAwesomeIcon icon={faClipboard} />
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleTranslate}
                        disabled={loading || !sourceText}
                        className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition transform active:scale-95 ${loading || !sourceText ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Translating...' : 'Translate Now'}
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2">💡 Did you know?</h4>
                <p className="text-blue-700 text-sm">We now support over 20 languages including regional Indian dialects and major global languages!</p>
            </div>
        </div>
    );
};

export default Translation;
