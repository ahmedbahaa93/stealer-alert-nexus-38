'use client';

import { Calendar, MessageSquare } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { DynamicIcon } from '../DynamicIcon';
import { SafeImage } from '../ui/SafeImage';
import type { Blog } from '@/lib/types/blog';

interface ArticlesCardProps {
  blog?: Blog;
}

function ArticlesCard({ blog }: ArticlesCardProps) {
  const t = useTranslations('HomePage.article-card');
  const router = useRouter();
  const locale = useLocale();

  // Fallback data if no blog provided
  const blogImage = blog?.images?.[0] || '/assets/home/article-cover.svg';
  const blogTitle = blog?.title || t('title');
  const blogContent = blog?.content || t('message');
  const blogAuthor = blog?.author?.name || 'Admin';
  const blogDate = blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : t('date');

  const handleViewMore = () => {
    if (blog?._id) {
      router.push(`/${locale}/articles/${blog._id}`);
    }
  };

  // Truncate content for card display
  const truncatedContent = blogContent.length > 150
    ? `${blogContent.substring(0, 150)}...`
    : blogContent;

  return (
    <div className="card-container overflow-visible">
      <div className="bg-card rounded-xl drop-shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-500 ease-in-out transform-gpu overflow-visible">
        <div className="overflow-hidden rounded-t-xl h-[250px]">
          <SafeImage
            src={blogImage}
            alt={blogTitle}
            width={600}
            height={250}
            className="object-cover w-full h-full"
            fallbackSrc="/assets/home/article-cover.svg"
          />
        </div>
        <div className="mt-5 px-5 card-content">
          <div className="flex items-center justify-start gap-6">
            <p className="space-x-2 text-sm text-gray-600">
              <Calendar className="text-primary-identity inline w-4 h-4" />
              <span>{blogDate}</span>
            </p>
            <p className="space-x-2 text-sm text-gray-600">
              <MessageSquare className="text-primary-identity inline w-4 h-4" />
              <span>{blogAuthor}</span>
            </p>
          </div>
          <div className="mt-5 space-y-5">
            <h2 className="text-primary-identity text-2xl font-bold card-title line-clamp-2">
              {blogTitle}
            </h2>
            <p className="mx-auto w-[80%] text-gray-700 line-clamp-3">
              {truncatedContent}
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex w-[50%] items-center justify-evenly pb-5">
          <div className="w-fit rounded-lg bg-gradient-to-r from-blue-500 to-green-500 p-[1px] hover:from-green-500 hover:to-blue-500 transition-all duration-500 ease-in-out">
            <Button
              variant="none"
              size="lg"
              className="bg-card rounded-lg"
              onClick={handleViewMore}
              disabled={!blog?._id}
            >
              {t('action')}
            </Button>
          </div>
          <DynamicIcon src="/assets/home/rise.svg" alt="up-arrow" width={30} />
        </div>
      </div>
    </div>
  );
}

export default ArticlesCard;
