'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
    src: string | null | undefined;
    alt: string;
    width: number;
    height: number;
    className?: string;
    fallbackSrc?: string;
}

export function SafeImage({
    src,
    alt,
    width,
    height,
    className,
    fallbackSrc = '/assets/course/ai.svg'
}: SafeImageProps) {
    // Handle empty src strings by using the fallback immediately
    const initialSrc = src && src.trim() !== '' ? src : fallbackSrc;
    const [currentSrc, setCurrentSrc] = useState(initialSrc);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError && currentSrc !== fallbackSrc) {
            console.warn(`Failed to load image: ${currentSrc}, falling back to: ${fallbackSrc}`);
            setCurrentSrc(fallbackSrc);
            setHasError(true);
        }
    };

    return (
        <Image
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={handleError}
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
    );
}
