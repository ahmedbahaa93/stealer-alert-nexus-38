'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, CreditCard, Building2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useEnrollment } from '@/hooks/useEnrollment';
import { type PaymentProvider } from '@/lib/types/enrollment';
import { useLocationAwarePrice, useLocationAwarePayment } from '@/hooks/useLocationAwarePrice';
import { useLocationStore } from '@/lib/store/locationStore';
import { LocationModal } from '@/components/location/LocationModal';
import { courseApi } from '@/lib/api/courses';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course } from '@/lib/types/course';
import { SafeImage } from '@/components/ui/SafeImage';

function EnrollmentPageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header skeleton */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    <Skeleton className="h-6 w-72" />
                </div>

                {/* Content skeleton */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-3">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EnrollmentPage() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations('courseDetail');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const courseId = params.id as string;

    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider['id'] | null>(null);
    const [selectedCourseType, setSelectedCourseType] = useState<string>('Online');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [courseError, setCourseError] = useState<any>(null);

    // Location-aware hooks
    const { location } = useLocationStore();
    const locationAwarePrice = useLocationAwarePrice(course?.price || 0);
    const { paymentMethod, currency, isEgypt } = useLocationAwarePayment();

    const {
        isProcessing,
        error,
        success,
        enrollInCourse,
        resetState,
        isAuthenticated,
    } = useEnrollment();

    // Fetch course details
    const fetchCourse = async () => {
        try {
            setIsLoading(true);
            setCourseError(null);
            const response = await courseApi.getCourseDetail(courseId);
            const typedResponse = response as { data: { course: Course } };
            setCourse(typedResponse.data.course);

            // Set default course type from URL query param or course data
            const searchParams = new URLSearchParams(window.location.search);
            const typeFromUrl = searchParams.get('type');

            if (typeFromUrl) {
                setSelectedCourseType(typeFromUrl);
            } else if (typedResponse.data.course.course_type) {
                if (Array.isArray(typedResponse.data.course.course_type)) {
                    setSelectedCourseType(typedResponse.data.course.course_type[0]);
                } else if (typeof typedResponse.data.course.course_type === 'string') {
                    setSelectedCourseType(typedResponse.data.course.course_type);
                }
            }
        } catch (err) {
            setCourseError(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset state when component mounts
    useEffect(() => {
        resetState();
        setSelectedStartDate('');
        // Auto-select payment method based on location
        setSelectedProvider(paymentMethod as PaymentProvider['id']);
    }, [resetState, paymentMethod]);

    // Fetch course on mount
    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    // Handle successful enrollment
    useEffect(() => {
        if (success) {
            router.push(`/${locale}/payment-result?type=enrollment&course=${course?.title}&success=true`);
        }
    }, [success, router, locale, course?.title]);

    const handleEnroll = async () => {
        if (!selectedStartDate || !selectedProvider || !course) {
            return;
        }

        // Ensure date is in YYYY-MM-DD format
        const formattedDate = formatDateForAPI(selectedStartDate);

        await enrollInCourse(
            {
                courseId,
                startDate: formattedDate,
                courseTitle: course.title,
                coursePrice: course.price,
                courseDuration: course.duration,
                course_type: selectedCourseType
            },
            selectedProvider
        );
    };

    // Format date for API (YYYY-MM-DD)
    const formatDateForAPI = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Date formatting error:', error);
            // If the date is already in YYYY-MM-DD format, return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }
            throw new Error('Invalid date format');
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if parsing fails
            }
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            console.error('Date display formatting error:', error);
            return dateString;
        }
    };

    const formatPrice = () => {
        return locationAwarePrice.formatted;
    };

    const handleGoBack = () => {
        router.back();
    };

    // Show loading state
    if (isLoading) {
        return <EnrollmentPageSkeleton />;
    }

    // Show error state
    if (courseError || !course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-red-800 mb-4">
                            {isRTL ? 'تعذر تحميل الدورة' : 'Failed to Load Course'}
                        </h1>
                        <p className="text-red-600 mb-6">
                            {isRTL
                                ? 'حدث خطأ أثناء تحميل تفاصيل الدورة. يرجى المحاولة مرة أخرى.'
                                : 'An error occurred while loading course details. Please try again.'
                            }
                        </p>
                        <Button onClick={handleGoBack} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {isRTL ? 'العودة' : 'Go Back'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-[#0F43B4] mb-2">
                                {t('enrollNow') || (isRTL ? 'التسجيل الآن' : 'Enroll Now')}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {course.title}
                            </p>
                        </div>
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {isRTL ? 'العودة' : 'Back'}
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                        {/* Authentication Check */}
                        {!isAuthenticated && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-amber-800 text-lg">
                                            {isRTL ? 'مطلوب تسجيل الدخول' : 'Login Required'}
                                        </h3>
                                        <p className="text-amber-700 mt-1">
                                            {isRTL
                                                ? 'يجب تسجيل الدخول أولاً للتسجيل في الدورات'
                                                : 'You need to log in first to enroll in courses'
                                            }
                                        </p>
                                        <Button
                                            onClick={() => router.push(`/${locale}/login`)}
                                            className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
                                        >
                                            {isRTL ? 'تسجيل الدخول' : 'Login'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location and Currency Info */}
                        {location && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-xl">
                                                {location.countryCode === 'EG' ? '🇪🇬' : '🌍'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-blue-900 text-lg">
                                                {location.city}, {location.country}
                                            </h3>
                                            <p className="text-blue-700">
                                                {isRTL ? 'العملة:' : 'Currency:'} {currency} • {isRTL ? 'الدفع:' : 'Payment:'} {paymentMethod}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowLocationModal(true)}
                                        variant="outline"
                                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                    >
                                        {isRTL ? 'تغيير' : 'Change'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Show location modal trigger if no location */}
                        {!location && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-yellow-800 text-lg">
                                                {isRTL ? 'تحديد الموقع للحصول على الأسعار الدقيقة' : 'Set Location for Accurate Pricing'}
                                            </h3>
                                            <p className="text-yellow-700 mt-1">
                                                {isRTL
                                                    ? 'احصل على الأسعار بالعملة المحلية وطرق الدفع المناسبة'
                                                    : 'Get pricing in your local currency and suitable payment methods'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowLocationModal(true)}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                    >
                                        {isRTL ? 'تحديد الموقع' : 'Set Location'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Start Date Selection */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-[#0F43B4]" />
                                {t('availableStartDates') || (isRTL ? 'تواريخ البداية المتاحة' : 'Available Start Dates')}
                            </h3>
                            {course.start_dates && course.start_dates.length > 0 ? (
                                <div className="grid gap-4">
                                    {course.start_dates.map((dateOption) => (
                                        <label
                                            key={dateOption.date}
                                            className={`
                          flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${selectedStartDate === dateOption.date
                                                    ? 'border-[#0F43B4] bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }
                          ${dateOption.available_slots === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="radio"
                                                    name="startDate"
                                                    value={dateOption.date}
                                                    checked={selectedStartDate === dateOption.date}
                                                    onChange={(e) => setSelectedStartDate(e.target.value)}
                                                    disabled={dateOption.available_slots === 0 || isProcessing}
                                                    className="w-5 h-5 text-[#0F43B4] focus:ring-[#0F43B4]"
                                                />
                                                <span className="font-medium text-gray-900 text-lg">
                                                    {formatDate(dateOption.date)}
                                                </span>
                                            </div>
                                            <div>
                                                {dateOption.available_slots > 0 ? (
                                                    <span className="text-green-600 font-medium">
                                                        {dateOption.available_slots} {t('slotsAvailable') || (isRTL ? 'مقعد متاح' : 'slots available')}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 font-medium">
                                                        {isRTL ? 'ممتلئ' : 'Full'}
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                                        <div className="flex items-center justify-center mb-4">
                                            <Calendar className="w-12 h-12 text-amber-500" />
                                        </div>
                                        <h4 className="font-semibold text-amber-800 text-lg mb-2">
                                            {isRTL ? 'لا توجد تواريخ متاحة حالياً' : 'No Available Start Dates'}
                                        </h4>
                                        <p className="text-amber-700 mb-4">
                                            {isRTL
                                                ? 'لم يتم تحديد تواريخ بداية لهذه الدورة بعد. يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بفريق الدعم.'
                                                : 'Start dates for this course haven\'t been scheduled yet. Please try again later or contact our support team.'
                                            }
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <Button
                                                onClick={() => window.location.reload()}
                                                variant="outline"
                                                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                                            >
                                                {isRTL ? 'إعادة تحميل' : 'Refresh'}
                                            </Button>
                                            <Button
                                                onClick={() => router.push(`/${locale}/contact`)}
                                                className="bg-amber-600 hover:bg-amber-700 text-white"
                                            >
                                                {isRTL ? 'تواصل معنا' : 'Contact Support'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Course Type Selection */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-[#0F43B4]" />
                                {isRTL ? 'اختر نوع الدورة' : 'Select Course Type'}
                            </h3>
                            <div className="grid gap-4">
                                {['Online', 'Offline', 'Recorded'].map((type) => (
                                    <label
                                        key={type}
                                        className={`
                                          flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                                          ${selectedCourseType === type
                                                ? 'border-[#0F43B4] bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="courseType"
                                                value={type}
                                                checked={selectedCourseType === type}
                                                onChange={(e) => setSelectedCourseType(e.target.value)}
                                                disabled={isProcessing}
                                                className="w-5 h-5 text-[#0F43B4] focus:ring-[#0F43B4]"
                                            />
                                            <span className="font-medium text-gray-900 text-lg">
                                                {type === 'Online' ? (isRTL ? 'عبر الإنترنت' : 'Online') :
                                                    type === 'Offline' ? (isRTL ? 'حضوري' : 'In Person') :
                                                        type === 'Recorded' ? (isRTL ? 'مسجل' : 'Recorded') : type}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Payment Provider Selection */}
                        {selectedStartDate && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-[#0F43B4]" />
                                    {isRTL ? 'اختر طريقة الدفع' : 'Select Payment Method'}
                                </h3>
                                <div className="space-y-4">
                                    {/* Show only location-appropriate payment methods */}
                                    {isEgypt ? (
                                        <label className="flex items-center justify-between p-6 border-2 border-[#0F43B4] bg-blue-50 rounded-lg cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="radio"
                                                    name="paymentProvider"
                                                    value="paymob"
                                                    checked={selectedProvider === 'paymob'}
                                                    onChange={(e) => setSelectedProvider(e.target.value as PaymentProvider['id'])}
                                                    disabled={isProcessing}
                                                    className="w-5 h-5 text-[#0F43B4] focus:ring-[#0F43B4]"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <Building2 className="w-5 h-5" />
                                                        <span className="font-medium text-gray-900 text-lg">
                                                            {isRTL ? 'باي موب' : 'Paymob'}
                                                        </span>
                                                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                                            {isRTL ? 'مُوصى' : 'Recommended'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mt-2">
                                                        {isRTL
                                                            ? 'الدفع بالجنيه المصري - الطريقة الأفضل في مصر'
                                                            : 'Pay in Egyptian Pounds - Best for Egypt'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ) : (
                                        <label className="flex items-center justify-between p-6 border-2 border-[#0F43B4] bg-blue-50 rounded-lg cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="radio"
                                                    name="paymentProvider"
                                                    value="stripe"
                                                    checked={selectedProvider === 'stripe'}
                                                    onChange={(e) => setSelectedProvider(e.target.value as PaymentProvider['id'])}
                                                    disabled={isProcessing}
                                                    className="w-5 h-5 text-[#0F43B4] focus:ring-[#0F43B4]"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <CreditCard className="w-5 h-5" />
                                                        <span className="font-medium text-gray-900 text-lg">
                                                            {isRTL ? 'دفع دولي' : 'International Payment'}
                                                        </span>
                                                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                                            {isRTL ? 'مُوصى' : 'Recommended'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mt-2">
                                                        {isRTL
                                                            ? 'الدفع بالدولار الأمريكي - للعملاء الدوليين'
                                                            : 'Pay in USD - For international customers'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-red-800 text-lg">
                                            {isRTL ? 'حدث خطأ' : 'Error Occurred'}
                                        </h3>
                                        <p className="text-red-700 mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Course Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        {/* Course Image */}
                        <div className="mb-6">
                            <div className="w-full h-48 rounded-lg overflow-hidden">
                                <SafeImage
                                    src={course.image || '/assets/course/ai.svg'}
                                    alt={course.title}
                                    width={400}
                                    height={192}
                                    className="object-cover w-full h-full"
                                    fallbackSrc="/assets/course/ai.svg"
                                />
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-[#0F43B4]" />
                            {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-gray-700 font-medium">{isRTL ? 'الدورة:' : 'Course:'}</span>
                                <span className="font-semibold text-gray-900">{course.title}</span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-gray-700 font-medium">{isRTL ? 'الفئة:' : 'Category:'}</span>
                                <span className="font-semibold text-gray-900">
                                    {typeof course.category === 'object'
                                        ? (course.category as any)?.name || 'General'
                                        : course.category || 'General'
                                    }
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-gray-700 font-medium">{isRTL ? 'السعر:' : 'Price:'}</span>
                                <span className="font-bold text-[#0F43B4] text-xl">{formatPrice()}</span>
                            </div>

                            {course.duration && (
                                <div className="flex items-center justify-between py-3 border-b">
                                    <span className="text-gray-700 font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {isRTL ? 'المدة:' : 'Duration:'}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {course.duration} {isRTL ? 'ساعات' : 'hours'}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-gray-700 font-medium">{isRTL ? 'نوع الدورة:' : 'Course Type:'}</span>
                                <span className="font-semibold text-gray-900">
                                    {selectedCourseType === 'Online' ? (isRTL ? 'عبر الإنترنت' : 'Online') :
                                        selectedCourseType === 'Offline' ? (isRTL ? 'حضوري' : 'In Person') :
                                            selectedCourseType === 'Recorded' ? (isRTL ? 'مسجل' : 'Recorded') :
                                                selectedCourseType || (isRTL ? 'عبر الإنترنت' : 'Online')
                                    }
                                </span>
                            </div>

                            {selectedStartDate && (
                                <div className="flex items-center justify-between py-3 border-b">
                                    <span className="text-gray-700 font-medium">{isRTL ? 'تاريخ البداية:' : 'Start Date:'}</span>
                                    <span className="font-semibold text-gray-900">{formatDate(selectedStartDate)}</span>
                                </div>
                            )}

                            {selectedProvider && (
                                <div className="flex items-center justify-between py-3 border-b">
                                    <span className="text-gray-700 font-medium">{isRTL ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                                    <span className="font-semibold text-gray-900">
                                        {selectedProvider === 'paymob' ? (isRTL ? 'باي موب' : 'Paymob') : (isRTL ? 'دفع دولي' : 'International')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Enroll Button */}
                        <div className="mt-8">
                            <Button
                                onClick={handleEnroll}
                                disabled={!selectedStartDate || !selectedProvider || isProcessing || !isAuthenticated || !course.start_dates || course.start_dates.length === 0}
                                className="w-full bg-[#0F43B4] hover:bg-[#1a5bc4] text-white text-lg py-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isProcessing
                                    ? (isRTL ? 'جاري المعالجة...' : 'Processing...')
                                    : !course.start_dates || course.start_dates.length === 0
                                        ? (isRTL ? 'لا توجد تواريخ متاحة' : 'No Dates Available')
                                        : (isRTL ? 'التسجيل الآن' : 'Enroll Now')
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Modal */}
            <LocationModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onSuccess={() => setShowLocationModal(false)}
            />
        </div>
    );
}
