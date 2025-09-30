'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface NumberCounterProps {
    endValue: number;
    duration?: number;
    startValue?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

function NumberCounter({
    endValue,
    duration = 2000,
    startValue = 0,
    suffix = '',
    prefix = '',
    className = ''
}: NumberCounterProps) {
    const [currentValue, setCurrentValue] = useState(startValue);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    useEffect(() => {
        if (inView && !hasAnimated) {
            setHasAnimated(true);

            const startTime = Date.now();
            const difference = endValue - startValue;

            const updateValue = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = startValue + (difference * easeOutCubic);

                setCurrentValue(Math.floor(current));

                if (progress < 1) {
                    requestAnimationFrame(updateValue);
                } else {
                    setCurrentValue(endValue);
                }
            };

            requestAnimationFrame(updateValue);
        }
    }, [inView, hasAnimated, endValue, startValue, duration]);

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    return (
        <span ref={ref} className={className}>
            {prefix}{formatNumber(currentValue)}{suffix}
        </span>
    );
}

export default NumberCounter;
