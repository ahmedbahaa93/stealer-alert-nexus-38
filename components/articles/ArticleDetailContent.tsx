'use client';

import { useState } from 'react';
import { Calendar, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { SafeImage } from '@/components/ui/SafeImage';
import { Button } from '@/components/ui/button';
import type { Blog } from '@/lib/types/blog';
import '@/app/styles/article-detail.css';

interface ImageSliderProps {
    images: string[];
    title: string;
}

function ImageSlider({ images, title }: ImageSliderProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Track when buttons are clicked to add extra animation effects
    const [isChanging, setIsChanging] = useState(false);

    if (!images || images.length === 0) {
        return null;
    }

    // If only one image, show it without slider controls
    if (images.length === 1) {
        return (
            <div className="w-full max-w-4xl mx-auto mb-8">
                <div className="aspect-video rounded-lg overflow-hidden">
                    <SafeImage
                        src={images[0]}
                        alt={title}
                        width={800}
                        height={450}
                        className="object-cover w-full h-full"
                        fallbackSrc="/assets/home/article-cover.svg"
                    />
                </div>
            </div>
        );
    }

    const nextImage = () => {
        setIsChanging(true);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);

        // Reset animation state after transition
        setTimeout(() => {
            setIsChanging(false);
        }, 300);
    };

    const prevImage = () => {
        setIsChanging(true);
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

        // Reset animation state after transition
        setTimeout(() => {
            setIsChanging(false);
        }, 300);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            {/* Main image slider with improved animation */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100">
                {/* Image with animation */}
                <div className="w-full h-full transition-opacity duration-300" key={currentImageIndex}>
                    <SafeImage
                        src={images[currentImageIndex]}
                        alt={`${title} - Image ${currentImageIndex + 1}`}
                        width={800}
                        height={450}
                        className={`object-cover w-full h-full transition-transform duration-500 ease-in-out ${isChanging ? 'scale-105' : 'scale-100'}`}
                        fallbackSrc="/assets/home/article-cover.svg"
                        key={`image-${currentImageIndex}`}
                    />
                </div>

                {/* Enhanced navigation buttons */}
                <Button
                    onClick={prevImage}
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white hover:shadow-lg transition-all duration-200 z-10"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                    onClick={nextImage}
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white hover:shadow-lg transition-all duration-200 z-10"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Enhanced image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm shadow-lg">
                    {currentImageIndex + 1} / {images.length}
                </div>
            </div>

            {/* Improved thumbnail navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setIsChanging(true);
                            setCurrentImageIndex(index);
                            setTimeout(() => setIsChanging(false), 300);
                        }}
                        title={`View image ${index + 1}`}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImageIndex
                            ? 'border-blue-500 opacity-100 shadow-md transform scale-105'
                            : 'border-gray-200 opacity-60 hover:opacity-80 hover:border-blue-300'
                            }`}
                    >
                        <SafeImage
                            src={image}
                            alt={`${title} - Thumbnail ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                            fallbackSrc="/assets/home/article-cover.svg"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

interface ArticleDetailContentProps {
    blog: Blog;
}

function ArticleDetailContent({ blog }: ArticleDetailContentProps) {
    const locale = useLocale();

    const blogDate = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero section with featured image */}
            <div className="relative h-[50vh] bg-gradient-to-r from-blue-800 to-blue-900 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full article-detail-pattern"></div>
                </div>

                {/* Featured image */}
                {blog.images && blog.images[0] && (
                    <div className="absolute inset-0 opacity-30">
                        <SafeImage
                            src={blog.images[0]}
                            alt={blog.title}
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-full"
                            fallbackSrc="/assets/home/article-cover.svg"
                        />
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-4 mb-4 text-blue-100">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{blogDate}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">{blog.author.name}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            {blog.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Image gallery */}
                    {blog.images && blog.images.length > 0 && (
                        <div className="p-6 pt-8 md:p-8">
                            <ImageSlider images={blog.images} title={blog.title} />
                        </div>
                    )}

                    {/* Article content */}
                    <div className="p-6 md:p-8">
                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {blog.content}
                            </div>
                        </div>

                        {/* Author info card */}
                        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-green-400 flex items-center justify-center text-white font-bold text-xl">
                                    {blog.author.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-bold text-gray-900">About the Author</h3>
                                    <p className="text-gray-600">{blog.author.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Back button */}
                        <div className="mt-8 flex justify-center">
                            <Button
                                onClick={() => window.history.back()}
                                variant="outline"
                                className="inline-flex items-center gap-2 hover:bg-blue-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                {locale === 'ar' ? 'العودة إلى المقالات' : 'Back to Articles'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleDetailContent;
