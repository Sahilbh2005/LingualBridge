import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ThemeSelector from './ThemeSelector';

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text transition-colors duration-300">User Profile</h2>

            <div className="bg-surface rounded-2xl shadow-lg p-8 transition-colors duration-300">
                <div className="flex items-center space-x-6 mb-8">
                    <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-text">{user?.username}</h3>
                        <p className="text-text opacity-60">{user?.email}</p>
                        <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            Native: {user?.nativeLanguage}
                        </div>
                    </div>
                </div>

                <div className="border-t pt-8">
                    <h4 className="text-xl font-bold mb-6">Settings</h4>

                    <div className="space-y-4 max-w-lg">
                        <div className="flex flex-col p-4 bg-background rounded-lg transition-colors duration-300">
                            <span className="font-medium mb-2 text-text">App Theme</span>
                            <ThemeSelector />
                        </div>
                        <div className="flex justify-between items-center p-4 bg-background rounded-lg transition-colors duration-300">
                            <span className="font-medium text-text">Voice Preference</span>
                            <select className="bg-surface text-text border border-gray-200 rounded px-2 py-1">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-background rounded-lg transition-colors duration-300">
                            <span className="font-medium text-red-500">Danger Zone</span>
                            <button className="text-red-500 text-sm hover:underline">Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
