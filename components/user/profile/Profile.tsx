'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import CertificatesCard from './CertificatesCard';
import CourseProgressCard from './CourseProgressCard';
import PaymentRecordCard from './PaymentRecordCard';
import InfoCard from '../user-info/InfoCard';

function Profile() {
  return (
    <AuthGuard fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <InfoCard />
      <CourseProgressCard />
      <CertificatesCard />
      <PaymentRecordCard />
    </AuthGuard>
  );
}

export default Profile;
