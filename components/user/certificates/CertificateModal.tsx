'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { UserCertificate } from '@/lib/api/user';
import Image from 'next/image';
import { Calendar, Clock, MapPin, GraduationCap, User } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface CertificateModalProps {
    certificate: UserCertificate;
    isOpen: boolean;
    onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
    certificate,
    isOpen,
    onClose,
}) => {
    const t = useTranslations('prof-cert');

    // Format date for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'PPP');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary-identity">
                        {t('certificateDetails')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('certificateDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-8">
                    {/* Certificate Image */}
                    <div className="bg-blue-50 p-6 rounded-lg flex items-center justify-center">
                        <div className="relative w-full h-[200px]">
                            <Image
                                src="/cert.svg"
                                alt="Certificate"
                                className="object-contain"
                                fill
                                priority
                            />
                        </div>
                    </div>

                    {/* Course Information */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                            {t('courseInfo')}
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-3">
                                <GraduationCap className="text-primary-identity mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{t('courseName')}</p>
                                    <p className="text-base font-medium text-gray-900">
                                        {certificate.courseInfo?.title || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="text-primary-identity mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{t('duration')}</p>
                                    <p className="text-base text-gray-900">
                                        {certificate.courseInfo?.duration || 'N/A'} {t('hours')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="text-primary-identity mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{t('courseType')}</p>
                                    <p className="text-base text-gray-900">
                                        {Array.isArray(certificate.courseInfo?.course_type)
                                            ? certificate.courseInfo?.course_type.join(', ')
                                            : certificate.courseInfo?.course_type || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="text-primary-identity mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{t('startDate')}</p>
                                    <p className="text-base text-gray-900">
                                        {certificate.courseInfo?.selected_start_date
                                            ? formatDate(certificate.courseInfo.selected_start_date)
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-500">{t('courseDescription')}</h4>
                        <p className="text-base text-gray-900">
                            {certificate.courseInfo?.description || 'No description available.'}
                        </p>
                    </div>

                    {/* User Information */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                            {t('certificateInfo')}
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-3">
                                <User className="text-primary-identity mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{t('issuedTo')}</p>
                                    <p className="text-base font-medium text-gray-900">
                                        {certificate.userInfo?.first_name} {certificate.userInfo?.last_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="text-primary-identity mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{t('issueDate')}</p>
                                    <p className="text-base text-gray-900">
                                        {certificate.createdAt ? formatDate(certificate.createdAt) : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-1 rounded-full bg-primary-identity/10 flex-shrink-0">
                                    <span className="text-primary-identity text-xs font-medium">ID</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{t('certificateId')}</p>
                                    <p className="text-base text-gray-900 font-mono">
                                        {certificate._id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CertificateModal;
