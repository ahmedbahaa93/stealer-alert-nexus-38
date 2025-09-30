"use client";

import Button from "@/Ui/Button";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  error?: Error;
  onRetry?: () => void;
  message?: string;
  title?: string;
  hideHttpErrors?: boolean;
}

export const CategoryErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  message,
  title,
  hideHttpErrors = false,
}) => {
  const t = useTranslations('Categories.errors');
  const router = useRouter();

  // Handle error message formatting
  const errorMessage = () => {
    if (message) return message;
    if (error) {
      // Check if it's an HTTP error and hide it if requested
      if (hideHttpErrors && error.message && error.message.includes('HTTP Error:')) {
        return t('errorMessage');
      }
      return error.message;
    }
    return t('errorMessage');
  };

  const handleBrowse = () => {
    router.push('/courses');
  };

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-blue-50 rounded-full p-4 mb-4">
        <AlertCircle className="h-10 w-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || t('errorTitle')}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {errorMessage()}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            {t('retry')}
          </Button>
        )}
        <Button
          onClick={handleBrowse}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md border border-gray-300"
        >
          {t('browseCourses')}
        </Button>
      </div>
    </div>
  );
};

export default CategoryErrorState;
