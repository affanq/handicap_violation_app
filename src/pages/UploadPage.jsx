import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Upload, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../services/ai';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
    };

    const handleAnalyze = async () => {
        if (!file) return;

        const apiKey = localStorage.getItem('google_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            alert('Please set your Google API Key in the Settings, or ensure the demo environment has a valid VITE_GEMINI_API_KEY configured.');
            return;
        }

        setIsAnalyzing(true);

        try {
            const aiResult = await analyzeImage(file, apiKey);

            const result = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                imageUrl: preview,
                isViolation: aiResult.isViolation,
                confidence: aiResult.confidence,
                licensePlate: aiResult.licensePlate || "Unknown",
                location: aiResult.location || "Unknown Location",
                reason: aiResult.reason,
                rawText: aiResult.rawText
            };

            // Don't save yet - let user confirm in next screen
            // const existing = JSON.parse(localStorage.getItem('violations') || '[]');
            // localStorage.setItem('violations', JSON.stringify([result, ...existing]));

            navigate('/result', { state: { result } });
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Analyze Parking Permit</h1>

            <Card className="p-8">
                {!preview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm text-gray-600 justify-center">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                            >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                ) : (
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                        <img src={preview} alt="Preview" className="w-full h-auto max-h-[500px] object-contain" />
                        <button
                            onClick={clearFile}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <Button
                        disabled={!file || isAnalyzing}
                        onClick={handleAnalyze}
                        className="w-full sm:w-auto min-w-[150px] flex justify-center items-center gap-2"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            "Analyze Photo"
                        )}
                    </Button>
                </div>
            </Card>

            {isAnalyzing && (
                <div className="text-center text-sm text-gray-500 animate-pulse">
                    AI is scanning (Gemini) for permits and license plates...
                </div>
            )}
        </div>
    );
}
