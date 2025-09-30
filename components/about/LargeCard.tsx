'use client';

import { ReactNode } from 'react';
import GrowAnimation from '../GrowAnimation';
import Heading from './Heading';
import Paragraph from './Paragraph';

interface LargeCardProps {
  title: string;
  icon: ReactNode;
  description: string;
}

function LargeCard({ title, icon, description }: LargeCardProps) {
  return (
    <GrowAnimation scale={1.02}>
      <div className="rounded-lg bg-gradient-to-b from-blue-600 to-green-600 pl-1 drop-shadow-lg hover:from-green-600 hover:to-blue-600">
        <div className="bg-primary-foreground rounded-md p-3 py-5">
          <div className="flex gap-5 items-center">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
              {icon}
            </div>
            <Heading data={title} />
          </div>
          <Paragraph data={description} className="mt-3" />
        </div>
      </div>
    </GrowAnimation>
  );
}

export default LargeCard;
