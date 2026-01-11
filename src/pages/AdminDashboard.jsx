import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Eye, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminDashboard() {
    const [violations, setViolations] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('violations') || '[]');
        setViolations(data);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <span className="text-sm text-gray-500">{violations.length} Reports</span>
            </div>

            <Card className="overflow-hidden">
                {violations.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No violations reported yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium">
                                <tr>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">License Plate</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {violations.map((v) => (
                                    <tr key={v.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <span className={clsx(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                v.isViolation ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                            )}>
                                                {v.isViolation ? "Violation" : "Clear"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(v.timestamp).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-mono font-medium text-gray-900">
                                            {v.licensePlate}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {v.location}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link to={`/admin/violation/${v.id}`} className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                                                <Eye className="w-4 h-4" /> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
