import { useTranslations } from 'next-intl';
import { DynamicIcon } from '../DynamicIcon';
import NumberCounter from '../ui/NumberCounter';

function SuccessMetrics() {
  const t = useTranslations('HomePage');

  const metrics = [
    {
      value: 10000,
      suffix: '+',
      label: 'trainees',
      key: 'trainees'
    },
    {
      value: 50,
      suffix: '+',
      label: 'companies',
      key: 'companies'
    },
    {
      value: 300,
      suffix: '+',
      label: 'courses',
      key: 'courses'
    }
  ];

  return (
    <div className="mb-10 bg-gradient-to-r from-blue-100 to-white px-5 py-5 pb-20">
      <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
        <DynamicIcon
          src="/assets/home/Group (1).svg"
          alt="celebrate"
          width={60}
        />
        <h2 className="text-primary-identity text-4xl font-bold">
          {t('achievementsHighlights')}
        </h2>
      </div>
      <div className="w-full items-center justify-evenly max-xl:space-y-5 xl:flex">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-green-500 pb-[2px] pl-[2px] hover:from-green-500 hover:to-blue-500 hover:scale-[1.03] transition-all duration-500 ease-in-out transform-gpu"
          >
            <div className="bg-card flex items-center justify-center rounded-lg px-20 py-8">
              <div className="flex flex-col items-center text-center">
                <p className="text-primary-identity text-4xl font-bold mb-2">
                  <NumberCounter
                    endValue={metric.value}
                    suffix={metric.suffix}
                    duration={2500}
                    className="inline"
                  />
                </p>
                <p className="text-gray-600 text-lg font-medium">{metric.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuccessMetrics;
