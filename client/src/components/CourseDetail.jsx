import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle, faPlay } from '@fortawesome/free-solid-svg-icons';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { 'x-auth-token': token }
                };
                const res = await axios.get(`http://localhost:5000/api/learning/courses/${courseId}`, config);
                console.log("DEBUG: Course Data Received:", res.data);
                setCourse(res.data);
            } catch (err) {
                console.error("Error fetching course details", err);
                setError("Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleEnroll = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`http://localhost:5000/api/learning/enroll/${courseId}`, {}, config);
            
            // Redirect to dedicated course page after successful enrollment
            navigate(`/courses/${courseId}`);
        } catch (err) {
            console.error("Error enrolling", err);
            setError("Enrollment failed. Please try again.");
        }
    };

    if (loading) return <div className="p-8 text-center text-text animate-pulse">Loading course details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!course) return <div className="p-8 text-center text-text">Course not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4">
            {/* Header section */}
            <div className="bg-surface rounded-3xl p-8 shadow-xl border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                
                <button 
                    onClick={() => navigate('/learning')}
                    className="mb-6 flex items-center text-primary font-bold hover:underline transition"
                >
                    <span className="mr-2">←</span> Back to Learning Center
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold inline-block mb-4">
                            {course.level}
                        </div>
                        <h1 className="text-4xl font-extrabold text-text mb-2 tracking-tight">{course.title}</h1>
                        <p className="text-text opacity-70 text-lg max-w-xl">{course.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-center bg-background/50 p-6 rounded-2xl border border-text/5 min-w-[200px]">
                        {course.isEnrolled ? (
                            <div className="text-center w-full">
                                <div className="flex justify-between text-sm font-bold mb-2 px-1">
                                    <span className="text-text opacity-60">Progress</span>
                                    <span className="text-primary font-black">{course.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-text/5 mb-6">
                                    <div 
                                        className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" 
                                        style={{ width: `${course.progress || 0}%` }}
                                    ></div>
                                </div>
                                <button 
                                    onClick={async () => {
                                        // Find first incomplete chapter
                                        let firstIncomplete = null;
                                        for (const section of course.sections) {
                                            for (const chapter of section.chapters) {
                                                if (!course.completedChapters?.includes(chapter.chapterId)) {
                                                    firstIncomplete = { section, chapter };
                                                    break;
                                                }
                                            }
                                            if (firstIncomplete) break;
                                        }
                                        
                                        if (firstIncomplete) {
                                            try {
                                                const token = localStorage.getItem('token');
                                                const config = { headers: { 'x-auth-token': token } };
                                                const res = await axios.post('http://localhost:5000/api/learning/generate-lesson', {
                                                    language: course.language,
                                                    level: firstIncomplete.section.title,
                                                    chapterTitle: firstIncomplete.chapter.title,
                                                    chapterId: firstIncomplete.chapter.chapterId
                                                }, config);
                                                navigate(`/lesson/${res.data._id}`);
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }
                                    }}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPlay} className="text-xs" />
                                    {course.progress > 0 ? 'Continue' : 'Start Now'}
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleEnroll}
                                className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:brightness-110 transition scale-hover"
                            >
                                Enroll Now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Lessons section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-3xl font-black text-text tracking-tight">Structured Curriculum</h2>
                </div>

                <div className="grid gap-8">
                    {course.sections && course.sections.length > 0 ? (
                        course.sections.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-4">
                                <div className="flex items-center gap-4 px-2">
                                    <div className="h-px flex-grow bg-text opacity-10"></div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary opacity-70">
                                        {section.title} Level
                                    </h3>
                                    <div className="h-px flex-grow bg-text opacity-10"></div>
                                </div>

                                <div className="grid gap-3">
                                    {section.chapters.map((chapter, cIdx) => {
                                        const isCompleted = course.completedChapters?.includes(chapter.chapterId);
                                        const prevChapter = cIdx > 0 ? section.chapters[cIdx - 1] : null;
                                        const isLocked = prevChapter && !course.completedChapters?.includes(prevChapter.chapterId);

                                        return (
                                            <div 
                                                key={cIdx} 
                                                className={`group relative bg-surface p-5 rounded-2xl border border-text/5 transition-all duration-300 ${
                                                    isLocked ? 'opacity-40 grayscale pointer-events-none' : 
                                                    course.isEnrolled ? 'hover:border-primary/40 cursor-pointer hover:shadow-lg' : 
                                                    'opacity-60 grayscale-[0.5]'
                                                } ${isCompleted ? 'bg-green-50/30' : ''}`}
                                                onClick={async () => {
                                                    if (course.isEnrolled && !isLocked) {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const config = { headers: { 'x-auth-token': token } };
                                                            const res = await axios.post('http://localhost:5000/api/learning/generate-lesson', {
                                                                language: course.language,
                                                                level: section.title,
                                                                chapterTitle: chapter.title,
                                                                chapterId: chapter.chapterId
                                                            }, config);
                                                            
                                                            navigate(`/lesson/${res.data._id}`);
                                                        } catch (err) {
                                                            console.error("Error generating lesson", err);
                                                            navigate(`/courses/${courseId}/chapter/${chapter.chapterId}`);
                                                        }
                                                    }
                                                }
                                            }>
                                                {isLocked && (
                                                    <div className="absolute top-2 right-2 text-text/20">
                                                        <FontAwesomeIcon icon={faLock} />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-5">
                                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${isCompleted ? 'bg-green-100 text-green-600 border-green-200' : 'bg-background text-primary border-primary/10'}`}>
                                                        {isCompleted ? '✓' : cIdx + 1}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-text group-hover:text-primary transition-colors">{chapter.title}</h4>
                                                                {isCompleted && (
                                                                    <div className="flex items-center gap-3 mt-1 text-xs font-bold text-text/50">
                                                                        <div className="flex text-yellow-500">
                                                                            {[...Array(3)].map((_, i) => (
                                                                                <span key={i} className={i < ((course.chapterProgress?.find(cp => cp.chapterId === chapter.chapterId)?.stars) || 0) ? "opacity-100" : "opacity-20"}>★</span>
                                                                            ))}
                                                                        </div>
                                                                        <span>{course.chapterProgress?.find(cp => cp.chapterId === chapter.chapterId)?.score || 0} XP</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {!course.isEnrolled ? (
                                                                <span className="text-sm opacity-30">🔒</span>
                                                            ) : (
                                                                <span className="text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    {isCompleted ? 'Retake' : 'Start'} →
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-surface p-12 rounded-3xl text-center border border-dashed border-text/20">
                            <p className="text-text opacity-50">Curriculum is being prepared for this course.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Enrollment prompt if not enrolled */}
            {!course.isEnrolled && (
                <div className="bg-primary/10 p-8 rounded-3xl border border-primary/20 text-center">
                    <h3 className="text-2xl font-bold text-text mb-2">Ready to start journey?</h3>
                    <p className="text-text opacity-70 mb-6">Unlock all lessons, interactive quizzes, and track your progress.</p>
                    <button 
                        onClick={handleEnroll}
                        className="bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:brightness-110 transition"
                    >
                        Enroll in this Course
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
