import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
    return (
        <div className={twMerge("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
}
