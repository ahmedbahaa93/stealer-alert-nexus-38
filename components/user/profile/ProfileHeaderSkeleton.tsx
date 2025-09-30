'use client';

import React from 'react';
import '@/components/ui/skeleton-loader.css';

const ProfileHeaderSkeleton = () => {
    return (
        <div className="w-full p-5 bg-white rounded-lg shadow-sm mb-8">
            <div className="flex items-center gap-6">
                <div className="skeleton w-24 h-24 rounded-full"></div>
                <div className="flex-1">
                    <div className="skeleton w-48 h-6 mb-3"></div>
                    <div className="skeleton w-40 h-4"></div>
                </div>
                <div className="skeleton w-32 h-10 rounded"></div>
            </div>
        </div>
    );
};

export default ProfileHeaderSkeleton;
