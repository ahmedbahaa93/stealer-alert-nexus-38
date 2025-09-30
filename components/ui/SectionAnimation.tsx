'use client';

import { useEffect, useRef, useState } from 'react';
import { MotionSection, useInView, useAnimation } from '@/components/ui/motion';

interface SectionAnimationProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export default function SectionAnimation({
    children,
    delay = 0,
    duration = 0.5,
    className = ''
}: SectionAnimationProps) {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            controls.start({
                y: 0,
                opacity: 1,
                transition: {
                    type: 'spring',
                    damping: 20,
                    stiffness: 100,
                    duration: duration,
                    delay: delay,
                },
            });
            setHasAnimated(true);
        }
    }, [isInView, controls, delay, duration, hasAnimated]);

    return (
        <MotionSection
            ref={ref}
            className={className}
            initial={{ y: 40, opacity: 0 }}
            animate={controls}
        >
            {children}
        </MotionSection>
    );
}
