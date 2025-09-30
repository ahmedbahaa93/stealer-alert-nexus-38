import { FC } from 'react';

const TestimonialSkeleton: FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-md animate-pulse"
                >
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="ml-4">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-4/6" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TestimonialSkeleton;
