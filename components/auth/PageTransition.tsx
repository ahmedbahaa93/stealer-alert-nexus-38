"use client";

import { MotionDiv, AnimatePresence } from '@/components/ui/motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        x: 50,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeInOut" as const,
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        x: -50,
        scale: 0.98,
        transition: {
            duration: 0.4,
            ease: "easeInOut" as const,
        },
    },
};

const childVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeInOut" as const,
        },
    },
};

export const PageTransition = ({ children }: PageTransitionProps) => {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <MotionDiv
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
            >
                <MotionDiv variants={childVariants}>
                    {children}
                </MotionDiv>
            </MotionDiv>
        </AnimatePresence>
    );
};

export default PageTransition;
