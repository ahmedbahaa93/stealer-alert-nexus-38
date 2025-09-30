"use client";

import { MotionDiv } from "@/components/ui/motion";
import React from "react";

interface SectionAnimationProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
    duration?: number;
    stagger?: boolean;
    staggerDelay?: number;
}

const SectionAnimation = ({
    children,
    className = "",
    delay = 0,
    direction = 'up',
    duration = 0.6,
    stagger = false,
    staggerDelay = 0.1
}: SectionAnimationProps) => {

    const getInitialVariant = () => {
        switch (direction) {
            case 'up':
                return { opacity: 0, y: 50 };
            case 'down':
                return { opacity: 0, y: -50 };
            case 'left':
                return { opacity: 0, x: -50 };
            case 'right':
                return { opacity: 0, x: 50 };
            case 'fade':
                return { opacity: 0 };
            default:
                return { opacity: 0, y: 50 };
        }
    };

    const getAnimateVariant = () => {
        switch (direction) {
            case 'up':
                return { opacity: 1, y: 0 };
            case 'down':
                return { opacity: 1, y: 0 };
            case 'left':
                return { opacity: 1, x: 0 };
            case 'right':
                return { opacity: 1, x: 0 };
            case 'fade':
                return { opacity: 1 };
            default:
                return { opacity: 1, y: 0 };
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: delay,
                staggerChildren: stagger ? staggerDelay : 0,
            },
        },
    };

    const itemVariants = {
        hidden: getInitialVariant(),
        visible: {
            ...getAnimateVariant(),
            transition: {
                duration,
                ease: [0.25, 0.1, 0.25, 1] as const,
            },
        },
    };

    if (stagger) {
        return (
            <MotionDiv
                className={className}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {React.Children.map(children, (child, index) => (
                    <MotionDiv key={index} variants={itemVariants}>
                        {child}
                    </MotionDiv>
                ))}
            </MotionDiv>
        );
    }

    return (
        <MotionDiv
            className={className}
            initial={getInitialVariant()}
            whileInView={getAnimateVariant()}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                duration,
                ease: [0.25, 0.1, 0.25, 1] as const,
                delay,
            }}
        >
            {children}
        </MotionDiv>
    );
};

export default SectionAnimation;
