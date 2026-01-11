import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Camera, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="max-w-md mx-auto space-y-8 pt-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
                <p className="text-gray-600">Help keep our parking spaces accessible for everyone.</p>
            </div>

            <div className="grid gap-6">
                <Link to="/upload" className="block">
                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-blue-50/50">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <Camera className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Analyze Parking Permit</h2>
                                <p className="text-gray-500 text-sm mt-1">Take a photo of a vehicle parked illegally</p>
                            </div>
                            <Button className="w-full">Start Analysis</Button>
                        </div>
                    </Card>
                </Link>

                <Link to="/admin" className="block">
                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-gray-100 p-4 rounded-full">
                                <ShieldCheck className="w-8 h-8 text-gray-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
                                <p className="text-gray-500 text-sm mt-1">Review reported violations and history</p>
                            </div>
                            <Button variant="secondary" className="w-full">View Dashboard</Button>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
