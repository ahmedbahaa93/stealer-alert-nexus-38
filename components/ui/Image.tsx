import type { ImgHTMLAttributes } from "react";
import NextImage from 'next/image';

interface Iprops extends ImgHTMLAttributes<HTMLImageElement> {
    src: string | any;  // Allow for imported images
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

const Image = ({ src, alt, className, width, height, ...rest }: Iprops) => {
    // Use Next.js Image if src is a string URL
    if (typeof src === 'string' && (src.startsWith('http') || src.startsWith('/'))) {
        return (
            <NextImage
                src={src}
                alt={alt}
                className={className}
                width={width || 500}
                height={height || 500}
                {...rest}
            />
        );
    }

    // Fallback for imported static images
    return (
        <img src={src.src || src} alt={alt} className={className} {...rest} />
    );
}

export default Image
