import GrowAnimation from '../GrowAnimation';

interface LargeCardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '' }: LargeCardProps) {
  return (
    <GrowAnimation scale={1.02}>
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-green-600 px-[1px] py-1 hover:from-green-600 hover:to-blue-600 hover:scale-[1.03] transition-all duration-300 ease-out transform-gpu">
        <div className={`bg-primary-foreground rounded-md p-2 ${className}`}>
          {children}
        </div>
      </div>
    </GrowAnimation>
  );
}

export default Card;
