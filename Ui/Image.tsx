"use client";

import type { ImgHTMLAttributes } from "react";

interface Iprops extends ImgHTMLAttributes<HTMLImageElement> {
    imageurl?: string;
    alt: string;
    className?: string;
}

const Image = ({ imageurl, alt, className, ...rest }: Iprops) => {
    // Add width and height attributes if only one is provided to maintain aspect ratio
    const imgProps: any = { ...rest };
    
    // If either width or height is defined but not both, set the other to auto
    if (imgProps.width !== undefined && imgProps.height === undefined) {
        imgProps.style = { ...(imgProps.style || {}), height: "auto" };
    } else if (imgProps.height !== undefined && imgProps.width === undefined) {
        imgProps.style = { ...(imgProps.style || {}), width: "auto" };
    }

    return (
        <img
            src={imageurl}
            alt={alt}
            className={className}
            loading="lazy"
            {...imgProps}
        />
    )
}

export default Image