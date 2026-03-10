import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { motion } from "framer-motion";
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Translation from './components/Translation';
import Learning from './components/Learning';
import CourseDetail from './components/CourseDetail';
import Games from './components/Games';
import Profile from './components/Profile';
import LessonView from './components/LessonView';
import DuolingoLesson from './components/DuolingoLesson';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-indigo-700 text-white p-6 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center z-10"
      >
        <img src="/logo-v2.png" alt="LingualBridge Logo" className="w-80 h-80 mb-10 drop-shadow-2xl scale-110" />
        <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-md">LingualBridge</h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl font-medium">Connect. Learn, Grow • AI-Powered Language Learning</p>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full -mr-48 -mb-48 blur-3xl"></div>
      <div className="space-x-6">
        <Link to="/login" className="bg-white text-primary px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-100 transition transform hover:scale-105">Start Learning</Link>
        <Link to="/register" className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition transform hover:scale-105">Create Account</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Area */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="translation" element={<Translation />} />
              <Route path="learning" element={<Learning />} />
              <Route path="learning/:courseId" element={<CourseDetail />} />
              <Route path="learn/:courseId" element={<CourseDetail />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="courses/:courseId/chapter/:chapterId" element={<LessonView />} />
              <Route path="lesson/:lessonId" element={<DuolingoLesson />} />
              <Route path="games" element={<Games />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
