"use client";

import { MotionDiv } from "@/components/ui/motion";

const CourseGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="relative bg-white rounded-2xl p-8 shadow-lg h-[520px]">
          <div className="w-full h-full flex flex-col">
            {/* Image placeholder */}
            <MotionDiv
              className="h-48 w-full rounded-lg bg-gray-200 mb-6"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />

            {/* Title placeholder */}
            <MotionDiv
              className="h-8 w-3/4 rounded-md bg-gray-200 mb-4"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            />

            {/* Description placeholder */}
            <MotionDiv
              className="h-20 w-full rounded-md bg-gray-200 mb-6"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
            />

            {/* Details placeholders */}
            <div className="space-y-4 mb-auto">
              <MotionDiv
                className="h-6 w-2/3 rounded-md bg-gray-200"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
              />
              <MotionDiv
                className="h-6 w-1/2 rounded-md bg-gray-200"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.7 }}
              />
              <MotionDiv
                className="h-6 w-3/5 rounded-md bg-gray-200"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
              />
            </div>

            {/* Button placeholders */}
            <div className="mt-6 flex gap-4">
              <MotionDiv
                className="h-10 w-full rounded-md bg-gray-200"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
              />
              <MotionDiv
                className="h-10 w-full rounded-md bg-gray-200"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 1.1 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseGridSkeleton;
