import { useTranslations } from 'next-intl';
import Heading from './Heading';
import { Monitor, Users, Brain, Award } from 'lucide-react';
import LargeCard from './LargeCard';
import { MotionDiv } from '@/components/ui/motion';

function VisionSection() {
  const t = useTranslations('about-page.2nd-section');

  let trainingFields;
  try {
    trainingFields = t.raw('list');
  } catch (error) {
    console.warn('Failed to load training fields list:', error);
    trainingFields = [];
  }

  return (
    <div className="mt-15">
      <MotionDiv
        className="flex items-center justify-center gap-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="p-2 bg-gradient-to-r from-blue-600 to-green-500 rounded-full">
          <Award className="text-white" size={50} />
        </div>
        <Heading data={t('title')} />
      </MotionDiv>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 md:px-10">
        {trainingFields && Array.isArray(trainingFields) && trainingFields.map((field: any, index: number) => {
          let description = '';

          // if (field.items && Array.isArray(field.items)) {
          //   description = field.items.map((item: string) => `• ${item}`).join('\n');
          // }

          // Use appropriate React icons for each field
          const getFieldIcon = (index: number) => {
            switch (index) {
              case 0: // IT
                return <Monitor className="text-blue-600" size={40} />;
              case 1: // Business Training
                return <Users className="text-green-600" size={40} />;
              case 2: // Soft Skills
                return <Brain className="text-purple-600" size={40} />;
              case 3: // Specialized Programs
                return <Award className="text-orange-600" size={40} />;
              default:
                return <Monitor className="text-blue-600" size={40} />;
            }
          };

          return (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <LargeCard
                title={field.title}
                icon={getFieldIcon(index)}
                description={description}
              />
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}

export default VisionSection;
