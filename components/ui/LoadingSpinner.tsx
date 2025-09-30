"use client";

import { MotionDiv } from "@/components/ui/motion";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function LoadingSpinner({
    size = "md",
    className = ""
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    return (
        <MotionDiv
            className={`${sizeClasses[size]} ${className}`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <div className="w-full h-full border-2 border-current border-t-transparent rounded-full" />
        </MotionDiv>
    );
}
