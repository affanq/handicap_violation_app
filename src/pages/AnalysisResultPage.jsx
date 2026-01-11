import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle, AlertTriangle, ChevronRight, XCircle, ArrowLeft, Save, Edit2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function AnalysisResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialResult = location.state?.result;

    // State for user editing
    const [isViolation, setIsViolation] = useState(initialResult?.isViolation || false);
    const [reason, setReason] = useState(initialResult?.reason || "");
    const [licensePlate, setLicensePlate] = useState(initialResult?.licensePlate || "");
    const [showRawText, setShowRawText] = useState(false);

    if (!initialResult) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No analysis result found.</p>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back home</Link>
            </div>
        );
    }

    const handleSubmit = () => {
        if (isViolation) {
            const finalResult = {
                ...initialResult,
                // Ensure we capture the edited state
                isViolation,
                reason,
                licensePlate,
                verifiedBy: "User"
            };

            const existing = JSON.parse(localStorage.getItem('violations') || '[]');
            localStorage.setItem('violations', JSON.stringify([finalResult, ...existing]));
        }

        // Navigate based on status - if violation, go to dashboard logic? 
        // Or just go back to home/start.
        // Let's go to Admin dashboard to see it added (or not added if cleared).
        navigate('/admin');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link to="/" className="flex items-center text-gray-500 hover:text-gray-900 transition mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analyze
            </Link>

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Review Analysis</h1>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">Verify AI Guess</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4 overflow-hidden">
                    <img
                        src={initialResult.imageUrl}
                        alt="Analyzed Parking"
                        className="w-full h-auto rounded-lg object-contain bg-gray-100"
                    />
                    <div className="mt-4 text-xs text-gray-500">
                        <button
                            onClick={() => setShowRawText(!showRawText)}
                            className="text-blue-600 hover:underline"
                        >
                            {showRawText ? "Hide Evidence" : "Show AI Evidence (Debug)"}
                        </button>
                        {showRawText && (
                            <div className="mt-2 p-2 bg-gray-100 rounded border font-mono whitespace-pre-wrap h-32 overflow-y-auto">
                                <strong>Detected Text:</strong> {initialResult.rawText || "None"}
                            </div>
                        )}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className={clsx("p-6 border-l-8 transition-colors", isViolation ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50")}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    {isViolation ? (
                                        <>
                                            <AlertTriangle className="text-red-600" />
                                            <span className="text-red-800">Violation Detected</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="text-green-600" />
                                            <span className="text-green-800">No Violation Detected</span>
                                        </>
                                    )}
                                </h2>
                                <p className="text-sm opacity-80 mt-1">AI Confidence: {(initialResult.confidence * 100).toFixed(0)}%</p>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                onClick={() => setIsViolation(!isViolation)}
                                className="text-xs border border-gray-300 bg-white px-3 py-1 rounded hover:bg-gray-50 shadow-sm"
                            >
                                Change Status
                            </button>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Edit2 className="w-4 h-4" /> Edit Details
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                            <input
                                type="text"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <div className="p-2 bg-gray-50 border rounded-md text-sm text-gray-600">
                                {initialResult.location}
                            </div>
                        </div>
                    </Card>

                    <Button onClick={handleSubmit} className="w-full py-3 text-lg shadow-lg">
                        <Save className="w-5 h-5 mr-2" /> Confirm & Submit Report
                    </Button>
                </div>
            </div>
        </div>
    );
}
