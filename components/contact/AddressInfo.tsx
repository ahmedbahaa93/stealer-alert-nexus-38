'use client';

import { useTranslations } from 'next-intl';
import { Building2, MapPin } from 'lucide-react';
import Card from './Card';
import MiniCard from './MiniCard';
import GrowAnimation from '../GrowAnimation';
import { MotionDiv } from '@/components/ui/motion';

function AddressInfo() {
  const t = useTranslations('contact-page.contact-info');

  // Use our updated contact information
  const contactCards = [
    {
      icon: "email",
      title: t('cards.0.title'),
      data: "Contact@raiseuplearn.com"
    },
    {
      icon: "website",
      title: t('cards.1.title'),
      data: "www.raiseuplearn.com"
    },
    {
      icon: "phone",
      title: t('cards.2.title'),
      data: t('cards.2.data')
    }
  ];

  const branchesData = t.raw('branches');
  const mapData = {
    icon: "map",
    title: t('map.title')
  };

  return (
    <Card title={t('title')} src="info" alt="info-icon">
      <GrowAnimation scale={1.02}>
        <div className="flex flex-col gap-4 h-full">
          <div className="space-y-4">
            {contactCards.map((card, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <MiniCard
                  icon={card.icon}
                  title={card.title}
                  description={card.data}
                />
              </MotionDiv>
            ))}
          </div>

          {/* Branch Information Section */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800"
          >
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="text-primary-identity" size={20} />
              <h3 className="text-primary-identity font-semibold text-sm">
                {branchesData.title}
              </h3>
            </div>
            <div className="space-y-2">
              {branchesData.list.map((branch: any, index: number) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between bg-white/70 dark:bg-gray-800/50 rounded-md p-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-600 dark:text-gray-400" size={16} />
                    <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {branch.location}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${branch.type === 'Headquarters' || branch.type === 'المقر الرئيسي'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                    {branch.type}
                  </span>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            className="mt-auto pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <MiniCard
              icon={mapData.icon}
              title={mapData.title}
              description=""
              type="map"
            />
          </MotionDiv>
        </div>
      </GrowAnimation>
    </Card>
  );
}

export default AddressInfo;
