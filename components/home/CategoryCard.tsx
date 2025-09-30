import Paragraph from '../about/Paragraph';
import { DynamicIcon } from '../DynamicIcon';
import Border from './Border';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

function CategoryCard({
  title,
  icon,
  courseCount,
  id,
  image
}: {
  title: string;
  icon: string;
  courseCount: string;
  id: string;
  image?: string;
}) {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = () => {
    router.push(`/${locale}/categories/${id}`);
  };

  return (
    <div className="card-container">
      <Border padding="pl-[2px] pb-[2px]">
        <div
          className="bg-card h-55 rounded-lg text-center cursor-pointer flex flex-col items-center justify-center gap-10"
          onClick={handleClick}
          role="button"
          aria-label={`View ${title} category`}
        >
          <div className="pt-15 flex justify-center items-center h-16">
            {image ? (
              // Use actual category image if available
              <div className="w-16 h-16 flex items-center justify-center">
                <Image
                  src={image}
                  width={64}
                  height={64}
                  alt={title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.currentTarget;
                    if (target) {
                      target.style.display = 'none';
                      const fallbackEl = document.getElementById(`fallback-icon-${id}`);
                      if (fallbackEl) {
                        fallbackEl.style.display = 'block';
                      }
                    }
                  }}
                />
                <div id={`fallback-icon-${id}`} className="mx-auto hidden">
                  <DynamicIcon
                    src={`/assets/home/${icon}.svg`}
                    width={32}
                    alt={title}
                    className="mx-auto"
                  />
                </div>
              </div>
            ) : (
              // Fallback to icon if no image
              <DynamicIcon
                src={`/assets/home/${icon}.svg`}
                width={32}
                alt={title}
                className="mx-auto"
              />
            )}
          </div>
          <div className="px-2 w-full overflow-hidden">
            <h2 className="text-primary-identity text-2xl font-bold mt-3 truncate max-w-full">{title}</h2>
            <Paragraph data={`${courseCount}`} />
          </div>
        </div>
      </Border>
    </div>
  );
}

export default CategoryCard;
