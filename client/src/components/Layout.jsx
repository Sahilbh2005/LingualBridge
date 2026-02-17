import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHouse, 
    faGlobe, 
    faBook, 
    faGamepad, 
    faUser, 
    faRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';

const Layout = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: faHouse },
        { name: 'Translation', path: '/translation', icon: faGlobe },
        { name: 'Learning', path: '/learning', icon: faBook },
        { name: 'Games', path: '/games', icon: faGamepad },
        { name: 'Profile', path: '/profile', icon: faUser },
    ];

    return (
        <div className="min-h-screen bg-background flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-surface shadow-xl hidden md:flex flex-col transition-colors duration-300">
                <div className="p-6 border-b border-text/10 overflow-visible">
                    <div className="flex flex-col items-center gap-4 mb-2">
                        <h1 className="text-xl font-black text-primary tracking-tight">LingualBridge</h1>
                    </div>
                    <p className="text-[10px] text-center text-text opacity-40 font-bold uppercase tracking-wider">Welcome, {user?.username}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-xl transition duration-200 ${location.pathname === item.path
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-text opacity-70 hover:bg-background hover:text-primary hover:opacity-100'
                                }`}
                        >
                            <span className="mr-3 text-xl">
                                <FontAwesomeIcon icon={item.icon} />
                            </span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-text/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                        <span className="mr-3">
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-surface shadow-sm md:hidden p-4 flex justify-between items-center transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <img src="/logo-v2.png" alt="Logo" className="w-20 h-20 object-contain scale-110" />
                        <h1 className="text-xl font-black text-primary tracking-tight">LingualBridge</h1>
                    </div>
                    <button onClick={handleLogout} className="text-red-500 font-bold text-sm">Logout</button>
                </header>

                {/* Helper for mobile nav - simplifying for now */}
                <div className="md:hidden flex overflow-x-auto bg-surface p-2 space-x-2 border-b transition-colors duration-300">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${location.pathname === item.path
                                    ? 'bg-primary text-white'
                                    : 'text-text opacity-70 bg-background'
                                }`}
                        >
                            <FontAwesomeIcon icon={item.icon} className="text-xs" />
                            {item.name}
                        </Link>
                    ))}
                </div>

                <main className="flex-1 p-6 overflow-y-auto">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
