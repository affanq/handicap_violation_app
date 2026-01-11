import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ArrowLeft, Calendar, MapPin, AlertOctagon } from 'lucide-react';

export default function ViolationDetail() {
    const { id } = useParams();
    const [violation, setViolation] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('violations') || '[]');
        const found = data.find(v => v.id === id);
        setViolation(found);
    }, [id]);

    if (!violation) {
        return <div className="p-8 text-center">Loading or not found...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/admin">
                <Button variant="secondary" className="gap-2 inline-flex items-center">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Button>
            </Link>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card className="p-6 space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
                            <span className="text-sm text-gray-500">ID: {violation.id}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <AlertOctagon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Analysis Result</div>
                                    <div className={`font-semibold ${violation.isViolation ? 'text-red-600' : 'text-green-600'}`}>
                                        {violation.isViolation ? 'Violation Detected' : 'No Violation'}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{violation.reason}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Date & Time</div>
                                    <div className="font-medium text-gray-900">
                                        {new Date(violation.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Location</div>
                                    <div className="font-medium text-gray-900">{violation.location}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                            <div className="text-sm text-gray-500">Confidence Score</div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${violation.confidence * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-xs mt-1 text-gray-500">{(violation.confidence * 100).toFixed(1)}%</div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="overflow-hidden">
                        <div className="bg-gray-900 text-white text-xs px-4 py-2 opacity-75">Evidence Image</div>
                        <img src={violation.imageUrl} alt="Violation Evidence" className="w-full h-auto object-cover" />
                    </Card>
                </div>
            </div>
        </div>
    );
}
