import { DynamicIcon } from '../DynamicIcon';
import Heading from './Heading';

interface LargeCardProps {
  title: string;
  src: string;
  alt: string;
  children: React.ReactNode;
}

function Card({ title, src, alt, children }: LargeCardProps) {
  return (
    <div className="w-full h-full rounded-lg bg-gradient-to-r from-blue-600 to-green-600 p-[2.5px] drop-shadow-lg hover:from-green-600 hover:to-blue-600 hover:scale-[1.03] transition-all duration-500 ease-in-out transform-gpu">
      <div className="bg-primary-foreground rounded-md p-3 py-5 h-full flex flex-col">
        <div className="mb-4 flex items-center gap-3">
          <DynamicIcon src={`/icons/contact/${src}.svg`} alt={alt} width={30} />
          <Heading data={title} />
        </div>
        <div className="flex-grow flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Card;
