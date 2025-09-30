'use client';

import React from 'react';

interface FixedCardContainerProps {
    children: React.ReactNode;
}

// This component ensures that all cards have the same height
export default function FixedCardContainer({ children }: FixedCardContainerProps) {
    return (
        <div className="h-full flex flex-col">
            {children}
        </div>
    );
}
