import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheck, 
    faWandMagicSparkles 
} from '@fortawesome/free-solid-svg-icons';

const Learning = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { 'x-auth-token': token }
                };
                const res = await axios.get('http://localhost:5000/api/learning/courses', config);
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleEnroll = async (e, courseId) => {
        e.stopPropagation(); // Prevent card navigation
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`http://localhost:5000/api/learning/enroll/${courseId}`, {}, config);
            
            // Update local state to reflect enrollment
            setCourses(courses.map(course => 
                course._id === courseId ? { ...course, isEnrolled: true } : course
            ));
        } catch (err) {
            console.error("Error enrolling", err);
        }
    };

    const openCourse = (courseId) => {
        navigate(`/learning/${courseId}`);
    };

    if (loading) return <div className="p-8 text-center text-text animate-pulse">Loading amazing courses...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-text transition-colors duration-300">Learning Center</h2>
                    <p className="text-text opacity-60">Master Indian and Global languages at your own pace.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <div 
                        key={course._id} 
                        onClick={() => openCourse(course._id)}
                        className={`bg-surface rounded-2xl p-6 shadow-md transition-all duration-300 flex flex-col group border border-transparent cursor-pointer ${course.isEnrolled ? 'border-primary/20 bg-primary/5 shadow-primary/5' : 'hover:shadow-xl hover:border-primary/20'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                                course.level === 'Beginner' ? 'bg-green-100 text-green-600' : 
                                course.level === 'Intermediate' ? 'bg-orange-100 text-orange-600' : 
                                'bg-purple-100 text-purple-600'
                            }`}>
                                {course.level}
                            </div>
                            {course.isEnrolled && (
                                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                    <span>Enrolled</span>
                                </div>
                            )}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-1 text-text group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-text opacity-50 text-xs mb-4 uppercase tracking-wider font-bold">{course.language}</p>
                        
                        <p className="text-text opacity-60 text-sm mb-6 line-clamp-2">{course.description || `Start your ${course.language} journey today.`}</p>

                        <div className="mt-auto">
                            {course.isEnrolled ? (
                                <>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-text opacity-50">Progress</span>
                                        <span className="text-primary">{course.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-background rounded-full h-1.5 overflow-hidden mb-4 border border-text/5">
                                        <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${course.progress || 0}%` }}></div>
                                    </div>
                                    <button 
                                        className="w-full bg-primary text-white py-2.5 rounded-xl hover:brightness-110 transition font-bold shadow-lg shadow-primary/10"
                                    >
                                        Continue Learning
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={(e) => handleEnroll(e, course._id)}
                                    className="w-full mt-2 bg-surface border-2 border-primary text-primary py-2.5 rounded-xl hover:bg-primary hover:text-white transition font-bold"
                                >
                                    Enroll Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Explore More Placeholder */}
                <div className="bg-background rounded-2xl p-6 border-2 border-dashed border-text/20 flex flex-col items-center justify-center text-center cursor-default min-h-[250px] opacity-60">
                    <div className="h-12 w-12 bg-surface rounded-full flex items-center justify-center text-text opacity-30 text-2xl mb-3">
                        <FontAwesomeIcon icon={faWandMagicSparkles} />
                    </div>
                    <h3 className="font-bold text-text">More Languages Coming Soon</h3>
                    <p className="text-xs text-text opacity-50 mt-1">We're constantly adding new courses.</p>
                </div>
            </div>
        </div>
    );
};

export default Learning;
