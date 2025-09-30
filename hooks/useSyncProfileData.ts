/**
 * Hook to synchronize auth store with fresh profile data
 * This ensures that avatar and other profile data stays up-to-date
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useUserProfile } from '@/hooks/useUserProfile';

export const useSyncProfileData = () => {
  const { data: profile, isLoading } = useUserProfile();
  const { user, setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only sync if we have fresh profile data and user is authenticated
    if (isAuthenticated && profile && user && !isLoading) {
      // Check if profile data differs from auth store data
      const needsUpdate =
        profile.avatar !== user.avatar ||
        profile.personal_info?.email !== user.email ||
        profile.personal_info?.full_name !==
          `${user.first_name} ${user.last_name}`;

      if (needsUpdate) {
        console.log('🔄 Syncing profile data with auth store:', {
          oldAvatar: user.avatar,
          newAvatar: profile.avatar,
          profileData: profile
        });

        // Update auth store with fresh profile data
        const updatedUser = {
          ...user,
          avatar: profile.avatar || user.avatar,
          email: profile.personal_info?.email || user.email,
          // Update names if available in profile
          first_name:
            profile.personal_info?.full_name?.split(' ')[0] || user.first_name,
          last_name:
            profile.personal_info?.full_name?.split(' ').slice(1).join(' ') ||
            user.last_name
        };

        setUser(updatedUser);
      }
    }
  }, [profile, user, isAuthenticated, isLoading, setUser]);

  return {
    profile,
    isLoading,
    isSynced: !isLoading && !!profile
  };
};
