import GrowAnimation from '../GrowAnimation';
import Border from './Border';

interface LargeCardProps {
  children: React.ReactNode;
}

function Card({ children }: LargeCardProps) {
  return (
    <GrowAnimation scale={1.03}>
      <Border>
        <div className="bg-primary-foreground rounded-md p-3 py-5">
          {children}
        </div>
      </Border>
    </GrowAnimation>
  );
}

export default Card;
