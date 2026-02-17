import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LessonView = () => {
    const { courseId, chapterId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get(`http://localhost:5000/api/learning/courses/${courseId}`, config);
                
                setCourse(res.data);
                
                // Find the specific chapter
                let foundChapter = null;
                res.data.sections.forEach(section => {
                    const c = section.chapters.find(ch => ch.chapterId === chapterId);
                    if (c) foundChapter = c;
                });
                
                if (foundChapter) {
                    setChapter(foundChapter);
                } else {
                    setError("Chapter not found.");
                }
            } catch (err) {
                console.error("Error fetching lesson", err);
                setError("Failed to load lesson content.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, chapterId]);

    const markComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post('http://localhost:5000/api/learning/progress', { courseId, chapterId }, config);
            
            // Go back to course detail or show success
            navigate(`/courses/${courseId}`);
        } catch (err) {
            console.error("Error updating progress", err);
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-text opacity-50">Loading lesson...</div>;
    if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
    if (!chapter) return <div className="p-12 text-center text-text">Lesson content not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <button 
                onClick={() => navigate(`/courses/${courseId}`)}
                className="flex items-center text-primary font-bold hover:underline"
            >
                <span className="mr-2">←</span> Back to Course Curriculum
            </button>

            <div className="bg-surface rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10 relative overflow-hidden">
                {/* Progress bar at top */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-background">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '100%' }}></div>
                </div>

                <header className="mb-10 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-primary opacity-60">
                            {course?.language} • {chapter.chapterId.split('_')[1].toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-text opacity-40">Lesson Complete</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-text mb-4 tracking-tight leading-tight">
                        {chapter.title}
                    </h1>
                </header>

                <div className="space-y-10">
                    <section className="bg-background/50 p-8 rounded-2xl border border-text/5">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">
                            Lesson Content
                        </label>
                        <p className="text-3xl md:text-4xl font-medium text-text leading-tight">
                            {chapter.content}
                        </p>
                        {chapter.transliteration && (
                            <p className="mt-4 text-text opacity-50 italic text-xl">
                                "{chapter.transliteration}"
                            </p>
                        )}
                    </section>

                    {chapter.subtitles && (
                        <section>
                            <label className="text-xs font-bold uppercase tracking-widest text-text opacity-40 mb-3 block">
                                Translation
                            </label>
                            <p className="text-2xl font-semibold text-text">
                                {chapter.subtitles}
                            </p>
                        </section>
                    )}

                    {chapter.examples && chapter.examples.length > 0 && (
                        <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <span>📝</span> Key Examples
                            </h3>
                            <ul className="space-y-3">
                                {chapter.examples.map((ex, i) => (
                                    <li key={i} className="text-text font-medium flex gap-3">
                                        <span className="text-primary opacity-50">•</span>
                                        {ex}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {chapter.grammarTips && (
                        <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
                            <h3 className="flex items-center gap-2 text-orange-600 font-bold mb-3">
                                <span>💡</span> Grammar Focus
                            </h3>
                            <p className="text-orange-900 leading-relaxed font-medium">
                                {chapter.grammarTips}
                            </p>
                        </div>
                    )}

                    {chapter.exercises && chapter.exercises.length > 0 && (
                        <div className="pt-10 border-t border-text/5">
                            <h3 className="text-2xl font-black text-text mb-6">Test Your Knowledge</h3>
                            <div className="space-y-8">
                                {chapter.exercises.map((ex, i) => (
                                    <div key={i} className="bg-surface p-6 rounded-2xl border border-text/5 shadow-sm">
                                        <p className="text-lg font-bold text-text mb-4">{i + 1}. {ex.question}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {ex.options.map((opt, oi) => (
                                                <button 
                                                    key={oi}
                                                    onClick={() => {
                                                        if (opt === ex.correctAnswer) alert("Correct! 🎉");
                                                        else alert(`Try again! The correct answer is ${ex.correctAnswer}`);
                                                    }}
                                                    className="p-4 border border-text/10 rounded-xl text-left hover:border-primary hover:bg-primary/5 transition font-medium"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-text/5 flex justify-center">
                        <button 
                            onClick={markComplete}
                            className="bg-primary text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Complete & Return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonView;
