"use client";

import Button from "@/Ui/Button";
import { useTranslations } from "next-intl";
import { InboxIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  message?: string;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const CategoryEmptyState: React.FC<EmptyStateProps> = ({
  message,
  title,
  actionLabel,
  onAction,
}) => {
  const t = useTranslations('Categories.empty');
  const router = useRouter();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-blue-50 rounded-full p-4 mb-4">
        <InboxIcon className="h-10 w-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || t('emptyTitle')}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {message || t('emptyMessage')}
      </p>
      <Button 
        onClick={handleAction}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
      >
        {actionLabel || t('browseMoreCourses')}
      </Button>
    </div>
  );
};

export default CategoryEmptyState;
