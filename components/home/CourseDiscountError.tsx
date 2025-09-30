'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useApiErrorHandler } from '@/hooks/useLocalization';

interface CourseDiscountErrorProps {
    onRetry?: () => void;
    error?: Error | null;
}

function CourseDiscountError({ onRetry, error }: CourseDiscountErrorProps) {
    const t = useTranslations('Errors');
    const { getErrorMessage } = useApiErrorHandler();

    const errorMessage = getErrorMessage(error || null, t('general'));

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="flex flex-col items-center text-center space-y-4">
                <AlertTriangle className="h-16 w-16 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground">
                    {t('title')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    {errorMessage}
                </p>
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="outline"
                        className="mt-4"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t('retry')}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default CourseDiscountError;
