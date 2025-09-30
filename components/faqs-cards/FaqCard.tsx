import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { MotionDiv, AnimatePresence } from "@/components/ui/motion";
import Border from '../courses/Border';

interface FaqCardProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClick: () => void;
}

function FaqCard({ title, description, isOpen, onClick }: FaqCardProps) {
  return (
    <div className="mb-8 relative z-0">
      <div className="relative z-10">
        <Border padding={isOpen ? 'p-1' : 'px-[3px] py-[2px]'}>
          <button
            className={`${isOpen ? 'bg-primary-identity text-primary-foreground rounded-t-md' : 'bg-primary-foreground text-primary-identity rounded-lg'} flex w-full cursor-pointer items-center justify-between p-4 text-left font-semibold transition-colors duration-300 hover:bg-opacity-95`}
            onClick={onClick}
          >
            <span className="flex items-center gap-2">{title}</span>
            {!isOpen ? (
              <EyeOff size={20} className="text-primary-identity" />
            ) : (
              <Eye size={20} className="text-primary-foreground" />
            )}
          </button>
        </Border>
      </div>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-faqs-card-open text-secondary-foreground mt-2 px-6 py-6 rounded-b-lg shadow-md"
          >
            <p>{description}</p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FaqCard;
