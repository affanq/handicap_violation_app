import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldAlert, Car, LayoutDashboard, Settings, X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export default function Layout() {
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('google_api_key');
        if (stored) setApiKey(stored);
    }, []);

    const saveApiKey = () => {
        localStorage.setItem('google_api_key', apiKey);
        setShowSettings(false);
        alert('API Key saved!');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            <header className="bg-blue-900 text-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <ShieldAlert className="w-8 h-8" />
                        <span>Fairpark</span>
                    </Link>
                    <nav className="flex gap-4 items-center">
                        <Link to="/" className="flex items-center gap-1 hover:text-blue-200 transition">
                            <Car className="w-5 h-5" /> Analyze
                        </Link>
                        <Link to="/admin" className="flex items-center gap-1 hover:text-blue-200 transition">
                            <LayoutDashboard className="w-5 h-5" /> Admin
                        </Link>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="flex items-center gap-1 hover:text-blue-200 transition ml-2 opacity-80 hover:opacity-100"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm">
                &copy; {new Date().getFullYear()} Fairpark. Internal Use Only.
            </footer>

            {showSettings && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6 space-y-4 relative">
                        <button
                            onClick={() => setShowSettings(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Google API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIza..."
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-500">
                                Required for image analysis using Gemini. Stored locally in your browser.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="secondary" onClick={() => setShowSettings(false)}>Cancel</Button>
                            <Button onClick={saveApiKey}>Save Key</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
