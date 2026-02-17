import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { gameContent, getGenericContent } from '../data/gameContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPuzzlePiece, 
    faEarListen, 
    faBuilding, 
    faStopwatch, 
    faFlagCheckered, 
    faTrophy, 
    faRocket, 
    faXmark, 
    faArrowRight 
} from '@fortawesome/free-solid-svg-icons';

// Import game type components
import WordMatch from './games/WordMatch';
import SentenceBuilder from './games/SentenceBuilder';
import SpeedQuiz from './games/SpeedQuiz';
import ListenPick from './games/ListenPick';

const Games = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [activeGame, setActiveGame] = useState(null); // { type, id }
    const [leaderboard, setLeaderboard] = useState([]);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const config = { headers: { 'x-auth-token': token } };
                
                const res = await axios.get('http://localhost:5000/api/learning/courses', config);
                const langs = [...new Set(res.data.map(c => c.language))];
                setAvailableLanguages(langs);
                
                if (langs.includes('Hindi')) setSelectedLanguage('Hindi');
                else if (langs.length > 0) setSelectedLanguage(langs[0]);

                const lbRes = await axios.get('http://localhost:5000/api/games/leaderboard/Word Match', config);
                setLeaderboard(lbRes.data);
            } catch (err) {
                console.error("Error fetching initial game data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const games = [
        { type: 'wordMatch', title: 'Word Match', desc: 'Match regional script with English meaning.', icon: faPuzzlePiece, color: 'bg-blue-500' },
        { type: 'listenPick', title: 'Listen & Pick', desc: 'Listen to native audio and select the word.', icon: faEarListen, color: 'bg-purple-500' },
        { type: 'sentenceBuilder', title: 'Sentence Builder', desc: 'Arrange words into native sentences.', icon: faBuilding, color: 'bg-green-500' },
        { type: 'speedQuiz', title: 'Speed Quiz', desc: 'Answer rapid-fire questions in 60s.', icon: faStopwatch, color: 'bg-orange-500' },
    ];

    const getActiveLanguageData = () => {
        const rawData = gameContent[selectedLanguage] || getGenericContent(selectedLanguage);
        const start = (selectedLevel - 1) * 2;
        
        return {
            wordMatch: rawData.wordMatch.slice(start, start + 5),
            sentenceBuilder: rawData.sentenceBuilder.slice(selectedLevel - 1, selectedLevel + 1),
            speedQuiz: rawData.speedQuiz.slice(start, start + 10),
            listenPick: rawData.listenPick.slice(start, start + 5)
        };
    };

    const handleGameComplete = async (score) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const config = { headers: { 'x-auth-token': token } };
                await axios.post('http://localhost:5000/api/games/score', {
                    gameType: activeGame.title,
                    score: score,
                    language: selectedLanguage
                }, config);
                
                const lbRes = await axios.get(`http://localhost:5000/api/games/leaderboard/${activeGame.title}`, config);
                setLeaderboard(lbRes.data);
            }
        } catch (err) {
            console.error("Error saving score", err);
        }
        
        setActiveGame(null);
        if (selectedLevel < 15) setSelectedLevel(selectedLevel + 1);
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-text opacity-50">Preparing games...</div>;

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-text tracking-tight mb-2">
                        {selectedLanguage === 'Hindi' ? 'हिन्दी पाठशाला' : 'Practice Playground'}
                    </h2>
                    <p className="text-text opacity-60 font-bold">
                        {selectedLanguage === 'Hindi' ? 'अभ्यास करें और अपनी भाषा सुधारें' : `Master ${selectedLanguage} through 15 levels of challenges`}
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-surface p-2 rounded-2xl border border-text/5 shadow-sm">
                        <span className="text-xs font-bold uppercase tracking-widest text-text opacity-40 ml-4">Language:</span>
                        <select 
                            value={selectedLanguage}
                            onChange={(e) => {
                                setSelectedLanguage(e.target.value);
                                setSelectedLevel(1);
                            }}
                            className="bg-background text-text font-bold px-4 py-2 rounded-xl outline-none"
                        >
                            {availableLanguages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-surface p-2 rounded-2xl border border-text/5 shadow-sm">
                        <span className="text-xs font-bold uppercase tracking-widest text-text opacity-40 ml-4">Level:</span>
                        <select 
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                            className="bg-background text-primary font-black px-4 py-2 rounded-xl outline-none"
                        >
                            {[...Array(15)].map((_, i) => (
                                <option key={i+1} value={i+1}>Level {i+1}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!activeGame ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {games.map((game) => (
                                <button 
                                    key={game.type} 
                                    onClick={() => setActiveGame(game)}
                                    className="bg-surface rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left group border border-text/5 relative overflow-hidden flex flex-col items-start h-full"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-primary/10 ${game.color} text-white group-hover:rotate-12 transition-all`}>
                                        <FontAwesomeIcon icon={game.icon} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 text-text tracking-tight">{game.title}</h3>
                                    <p className="text-text opacity-50 text-base leading-relaxed mb-6 font-medium">{game.desc}</p>
                                    <span className="mt-auto text-primary font-bold text-sm flex items-center gap-2">
                                        Play Now <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Leaderboard Section */}
                        <div className="bg-surface rounded-[2.5rem] p-10 shadow-xl border border-text/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <FontAwesomeIcon icon={faTrophy} className="text-9xl" />
                            </div>
                            <h3 className="text-2xl font-black text-text mb-8 flex items-center gap-3">
                                <FontAwesomeIcon icon={faFlagCheckered} className="text-3xl" /> Recent Champions
                            </h3>
                            {leaderboard.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {leaderboard.map((entry, index) => (
                                        <div key={index} className="flex justify-between items-center p-5 bg-background/50 rounded-2xl border border-text/5 hover:border-primary/20 transition-all">
                                            <div className="flex items-center gap-4">
                                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-orange-400 text-white' : 'bg-text/5 text-text/50'}`}>
                                                    {index + 1}
                                                </span>
                                                <span className="font-bold text-text text-lg">{entry.user?.username || 'Language Learner'}</span>
                                            </div>
                                            <span className="text-primary font-black bg-primary/10 px-4 py-1.5 rounded-full">{entry.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-12 text-center">
                                    <FontAwesomeIcon icon={faRocket} className="text-6xl mb-4 text-primary opacity-30" />
                                    <p className="text-xl font-bold text-text opacity-40">Be the first to set a high score in {selectedLanguage}!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface rounded-[3rem] p-6 md:p-12 shadow-2xl border border-primary/10 relative overflow-hidden min-h-[600px] flex flex-col"
                    >
                        <button 
                            onClick={() => setActiveGame(null)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-background flex items-center justify-center font-black text-text/50 hover:bg-red-50 hover:text-red-500 transition-all z-20"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        
                        <div className="flex-grow flex items-center justify-center">
                            {activeGame.type === 'wordMatch' && <WordMatch data={getActiveLanguageData().wordMatch} onComplete={handleGameComplete} />}
                            {activeGame.type === 'sentenceBuilder' && <SentenceBuilder data={getActiveLanguageData().sentenceBuilder} onComplete={handleGameComplete} />}
                            {activeGame.type === 'speedQuiz' && <SpeedQuiz data={getActiveLanguageData().speedQuiz} onComplete={handleGameComplete} />}
                            {activeGame.type === 'listenPick' && <ListenPick data={getActiveLanguageData().listenPick} onComplete={handleGameComplete} />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Games;
