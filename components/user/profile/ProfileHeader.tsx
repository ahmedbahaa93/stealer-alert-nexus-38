'use client';

import { useTranslations } from 'next-intl';
import { Edit } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProfileHeaderSkeleton from './ProfileHeaderSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import { SafeImage } from '@/components/ui/SafeImage';

function ProfileHeader() {
    const t = useTranslations('profile');
    const tError = useTranslations('ProfileErrorStates');

    const { data: profile, isLoading, isError, error, refetch } = useUserProfile();

    if (isLoading) {
        return <ProfileHeaderSkeleton />;
    }

    if (isError) {
        return (
            <div className="w-full p-5 bg-white rounded-lg shadow-sm mb-8">
                <ErrorState
                    message={error instanceof Error ? error.message : tError('defaultMessage')}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="w-full p-5 bg-white rounded-lg shadow-sm mb-8">
                <ErrorState message={tError('defaultMessage')} onRetry={() => refetch()} />
            </div>
        );
    }

    const { personal_info, avatar } = profile;
    const fullName = personal_info.full_name || 'User';
    const email = personal_info.email || '';
    const initials = fullName.charAt(0).toUpperCase();

    return (
        <div className="w-full p-5 bg-white rounded-lg shadow-sm mb-8">
            <div className="flex items-center gap-6">
                {avatar ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden relative">
                        <SafeImage
                            src={avatar}
                            alt={fullName}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                            fallbackSrc="/assets/course/ai.svg"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-identity flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{initials}</span>
                    </div>
                )}

                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-800">{fullName}</h2>
                    <p className="text-gray-600 mt-1">{email}</p>
                </div>

                <Link href="/profile/edit">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Edit size={16} />
                        {t('editProfile')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default ProfileHeader;
