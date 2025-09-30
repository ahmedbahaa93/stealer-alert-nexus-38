'use client';

import { MoveUp } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

function BackToTheTop() {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      // Show button after scrolling down 100px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const positionClass = locale === 'ar' ? 'left-4' : 'right-4';

  return (
    <div
      className={`fixed bottom-4 ${positionClass} z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <MoveUp
        className="text-primary-foreground bg-primary-identity size-10 cursor-pointer rounded-full p-2"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
}

export default BackToTheTop;
