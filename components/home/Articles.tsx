'use client';

import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DynamicIcon } from '../DynamicIcon';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import ArticlesCard from './ArticlesCard';
import ArticlesSkeleton from './ArticlesSkeleton';
import ArticlesError from './ArticlesError';
import ArticlesEmpty from './ArticlesEmpty';
import { useCarouselStability } from '@/hooks/useCarouselStability';
import { fetchBlogs } from '@/lib/api/blogs';
import type { Blog, BlogsApiError } from '@/lib/types/blog';

function Articles() {
  const t = useTranslations('HomePage');
  const { containerProps } = useCarouselStability();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<BlogsApiError | null>(null);

  const fetchBlogsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchBlogs();
      setBlogs(response.data.categories); // Note: API returns blogs in categories field
    } catch (err) {
      setError(err as BlogsApiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, []);

  // Show loading state
  if (isLoading) {
    return <ArticlesSkeleton itemCount={6} />;
  }

  // Show error state
  if (error) {
    return <ArticlesError error={error} onRetry={fetchBlogsData} />;
  }

  // Show empty state if no blogs
  if (!blogs || blogs.length === 0) {
    return <ArticlesEmpty />;
  }

  return (
    <div className="pb-15 overflow-visible">
      {/* Header section with proper spacing */}
      <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
        <DynamicIcon
          src="/assets/home/article.svg"
          alt="celebrate"
          width={60}
        />
        <h2 className="text-primary-identity text-3xl font-bold">
          {t('radicals')}
        </h2>
      </div>

      {/* Carousel container with proper overflow and padding */}
      <div className="carousel-container flex items-center justify-center px-4">
        <Carousel
          {...containerProps}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: true,
              stopOnMouseEnter: true
            })
          ]}
          opts={{
            loop: true,
            align: "start",
            containScroll: "trimSnaps"
          }}
          className="w-full max-w-[90%] md:max-w-[95%] mx-auto"
          dir="ltr"
        >
          <CarouselContent className="overflow-visible -ml-2 md:-ml-4">
            {blogs.map((blog) => (
              <CarouselItem
                key={blog._id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2 xl:basis-1/3"
              >
                <div className="p-1">
                  <ArticlesCard blog={blog} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default Articles;
