import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const authContext = useContext(AuthContext);
    const { login, error, clearErrors, isAuthenticated } = authContext;
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const { email, password } = user;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }

        if (error) {
            // Show alert or toast (simple alert for now)
            alert(error);
            clearErrors();
        }
    }, [error, isAuthenticated, navigate, clearErrors]);

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (email === '' || password === '') {
            alert('Please fill in all fields');
        } else {
            login({ email, password });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md transition-colors duration-300 border border-primary/5"
            >
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="Logo" className="w-32 h-32 mb-6" />
                    <h2 className="text-3xl font-black text-center text-primary tracking-tight">LingualBridge</h2>
                    <p className="text-text opacity-50 text-sm font-bold mt-1">Connect. Learn, Grow</p>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-text opacity-80 font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-lg border border-text/20 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-text opacity-80 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-lg border border-text/20 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-text opacity-70">
                    Don't have an account? <Link to="/register" className="text-primary font-bold">Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
