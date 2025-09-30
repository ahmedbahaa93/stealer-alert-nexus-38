/**
 * Enhanced Avatar component with Google image support and error handling
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface EnhancedAvatarProps {
    src?: string;
    alt?: string;
    fallbackText?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 min-w-[2rem] min-h-[2rem] text-sm',
    md: 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] text-base',
    lg: 'w-12 h-12 min-w-[3rem] min-h-[3rem] text-lg',
    xl: 'w-16 h-16 min-w-[4rem] min-h-[4rem] text-xl'
};

export const EnhancedAvatar: React.FC<EnhancedAvatarProps> = ({
    src,
    alt = 'Avatar',
    fallbackText = '?',
    size = 'md',
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Reset error state when src changes
    useEffect(() => {
        setImageError(false);
        setImageLoaded(false);
    }, [src]);

    const sizeClass = sizeClasses[size];
    const shouldShowImage = src && !imageError;

    return (
        <div className={`relative ${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
            {shouldShowImage ? (
                <>
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 32px, 40px"
                        onError={() => {
                            console.warn('❌ Avatar image failed to load:', src);
                            setImageError(true);
                        }}
                        onLoad={() => {
                            console.log('✅ Avatar image loaded successfully:', src);
                            setImageLoaded(true);
                        }}
                        priority={false}
                    />
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold">
                    {fallbackText}
                </div>
            )}
        </div>
    );
};
