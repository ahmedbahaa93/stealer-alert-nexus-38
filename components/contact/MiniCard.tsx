import { DynamicIcon } from '../DynamicIcon';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import Border from './Border';
import Map from './Map';
import Paragraph from './Paragraph';

interface Props {
  icon: string;
  title: string;
  description: string;
  type?: string;
}

function MiniCard({ icon, title, description, type }: Props) {
  // Check if this is the map card
  const isMapCard = type === 'map';

  // Function to get the appropriate icon
  const getIcon = () => {
    switch (icon) {
      case 'email':
        return <Mail className="text-primary-identity" size={30} />;
      case 'website':
        return <Globe className="text-primary-identity" size={30} />;
      case 'phone':
        return <Phone className="text-primary-identity" size={30} />;
      case 'map':
        return <MapPin className="text-primary-identity" size={30} />;
      default:
        return (
          <DynamicIcon
            src={`/icons/contact/${icon}.svg`}
            alt={`${icon}-icon`}
            width={30}
          />
        );
    }
  };

  return (
    <Border>
      <div className="bg-secondary flex gap-3 rounded-md p-2">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-primary-identity font-medium">{title}</p>
          {!isMapCard ? <Paragraph data={description} /> : <Map />}
        </div>
      </div>
    </Border>
  );
}

export default MiniCard;
