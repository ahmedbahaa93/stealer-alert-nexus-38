import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { DynamicIcon } from '../DynamicIcon';

function AcquireCourse() {
  const t = useTranslations('HomePage');

  return (
    <div className="mb-10 bg-[#0e43b4] px-5 pt-3 pb-12 overflow-hidden relative">
      <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
        <DynamicIcon
          src="/assets/home/up-down.svg"
          alt="celebrate"
          width={60}
        />
        <h2 className="text-3xl font-bold text-white">
          {t('acquire')}
        </h2>
      </div>
      
      


      <Image
        src="/assets/home/Topology-1.svg"
        alt="shape-for-bg"
        width={150}
        height={150}
        className="absolute -bottom-12 -left-12 z-0"
      />
      <Image
        src="/assets/home/Topology-1.svg"
        alt="shape-for-bg"
        width={150}
        height={150}
        className="rotate-180 absolute -top-12 -right-12 z-0"
      />
    </div>
  );
}

export default AcquireCourse;
