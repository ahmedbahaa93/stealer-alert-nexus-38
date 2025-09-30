'use client';

import GrowAnimation from '../GrowAnimation';
import Image from 'next/image';

interface MiniCardProps {
  title: string;
  code: string;
  address?: string;
}

function MiniCard({ title, code, address }: MiniCardProps) {
  // Get appropriate partner logo based on location code
  const getPartnerLogo = (code: string) => {
    switch (code) {
      case 'eg':
        return '/Raiseup success partners logos/Education For Employment-Egypt.png';
      case 'ksa':
        return '/Raiseup success partners logos/Ministry of Communications and Information Technology of Saudi Arabia.png';
      case 'uae':
        return '/assets/about/uae-flag.svg';
      default:
        return `/icons/about/${code}.svg`;
    }
  };

  return (
    <GrowAnimation scale={1.04}>
      <div className="rounded-lg bg-gradient-to-r from-green-500 to-blue-500 p-[1px] hover:from-blue-500 hover:to-green-500">
        <div className="bg-primary-foreground h-56 flex flex-col items-center justify-center gap-3 rounded-md p-5">
          <div className="w-[160px] h-[100px] bg-white rounded-lg p-2 flex items-center justify-center">
            <Image
              src={getPartnerLogo(code)}
              alt={`${title}-logo`}
              width={140}
              height={80}
              className="object-contain"
            />
          </div>
          <p className="text-center text-lg font-semibold text-primary-identity">{title}</p>
          {address && (
            <p className="text-center text-sm text-gray-600 mt-1">{address}</p>
          )}
        </div>
      </div>
    </GrowAnimation>
  );
}

export default MiniCard;
