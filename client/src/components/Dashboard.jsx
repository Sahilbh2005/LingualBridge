import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFire, 
    faWandMagicSparkles, 
    faStar, 
    faGlobe, 
    faBook, 
    faGamepad, 
    faTrophy, 
    faBullseye 
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:5000/api/auth/profile', config);
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text transition-colors duration-300">Dashboard</h2>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary rounded-2xl p-6 text-white shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-medium opacity-90">Daily Streak</h3>
                    <p className="text-4xl font-bold mt-2">
                        <FontAwesomeIcon icon={faFire} className="mr-2 text-orange-300" />
                        {user?.streak?.count || 0} Days
                    </p>
                </div>
                <div className="bg-secondary rounded-2xl p-6 text-white shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-medium opacity-90">Words Learned</h3>
                    <p className="text-4xl font-bold mt-2">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2 text-yellow-300" />
                        42
                    </p>
                </div>
                <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-medium opacity-90">Total XP</h3>
                    <p className="text-4xl font-bold mt-2">
                        <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-300" />
                        {user?.totalXP || 0}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <h3 className="text-xl font-bold text-text pt-4 transition-colors duration-300">Start Learning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/translation" className="group bg-surface p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                        <FontAwesomeIcon icon={faGlobe} />
                    </div>
                    <h4 className="text-xl font-bold text-text group-hover:text-primary transition-colors">Translator</h4>
                    <p className="text-text opacity-60 mt-2">Real-time AI translation for regional languages.</p>
                </Link>

                <Link to="/learning" className="group bg-surface p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-secondary/20">
                    <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-secondary">
                        <FontAwesomeIcon icon={faBook} />
                    </div>
                    <h4 className="text-xl font-bold text-text group-hover:text-secondary transition-colors">Lessons</h4>
                    <p className="text-text opacity-60 mt-2">Structured lessons in Tulu, Konkani, and more.</p>
                </Link>

                <Link to="/games" className="group bg-surface p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                        <FontAwesomeIcon icon={faGamepad} />
                    </div>
                    <h4 className="text-xl font-bold text-text group-hover:text-primary transition-colors">Games & Quizzes</h4>
                    <p className="text-text opacity-60 mt-2">Test your knowledge and earn rewards.</p>
                </Link>
            </div>

            {/* Recent Activity (Placeholder) */}
            <div className="bg-surface rounded-2xl shadow p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-text mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-center p-3 bg-background rounded-lg border border-text/5">
                        <span className="text-2xl mr-4 text-secondary">
                            <FontAwesomeIcon icon={faTrophy} />
                        </span>
                        <div>
                            <p className="font-bold text-text">Completed "Basic Greetings"</p>
                            <p className="text-sm text-text opacity-60">2 hours ago</p>
                        </div>
                        <span className="ml-auto font-bold text-secondary">+50 XP</span>
                    </div>
                    <div className="flex items-center p-3 bg-background rounded-lg border border-text/5">
                        <span className="text-2xl mr-4 text-primary">
                            <FontAwesomeIcon icon={faBullseye} />
                        </span>
                        <div>
                            <p className="font-bold text-text">Scored 80% in "Numbers Quiz"</p>
                            <p className="text-sm text-text opacity-60">Yesterday</p>
                        </div>
                        <span className="ml-auto font-bold text-secondary">+20 XP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
