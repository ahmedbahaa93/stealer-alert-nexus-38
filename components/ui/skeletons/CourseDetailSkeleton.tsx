"use client";

import React from 'react';

const SkeletonPulse = ({ className }: { className: string }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    ></div>
  );
};

export const CourseDetailSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="w-full bg-[#0F43B4] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between mx-4 sm:mx-6 md:mx-8 lg:mx-16 xl:mx-24 2xl:mx-32 p-4 sm:p-6 md:p-8 lg:p-12 gap-6 sm:gap-8 min-h-[400px] sm:min-h-[450px] lg:min-h-[500px]">
          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 text-white w-full lg:max-w-[55%] text-center lg:text-left">
            <SkeletonPulse className="h-10 w-full" />
            <SkeletonPulse className="h-4 w-1/3 mx-auto lg:mx-0" />
            <div className="flex justify-center lg:justify-start">
              <SkeletonPulse className="h-6 w-32" />
            </div>
            <SkeletonPulse className="h-24 w-full" />
            <div className="flex flex-col gap-2 sm:gap-3 mt-2">
              <div className="flex gap-5 justify-center lg:justify-start">
                <SkeletonPulse className="h-8 w-32 rounded-2xl" />
                <SkeletonPulse className="h-8 w-40 rounded-2xl" />
              </div>
              <div className="flex gap-5 justify-center lg:justify-start">
                <SkeletonPulse className="h-8 w-36 rounded-2xl" />
                <SkeletonPulse className="h-8 w-28 rounded-2xl" />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[40%]">
            <SkeletonPulse className="w-full h-[200px] lg:h-[300px] rounded-2xl" />
          </div>
        </div>
      </div>

      {/* What's Included Section Skeleton */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-green-50 py-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SkeletonPulse className="h-8 w-56 mx-auto" />
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative w-full max-w-sm lg:max-w-xs">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-[2px] rounded-2xl">
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="mb-6">
                      <SkeletonPulse className="w-16 h-16 mx-auto rounded-full" />
                    </div>
                    <SkeletonPulse className="h-6 w-32 mx-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Description Skeleton */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SkeletonPulse className="h-8 w-64 mx-auto" />
          </div>
          <div className="flex flex-col gap-4">
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Course Content Skeleton */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <SkeletonPulse className="h-8 w-48 mx-auto" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-4 rounded-lg">
                <SkeletonPulse className="h-8 w-full mb-4" />
                <div className="space-y-2">
                  <SkeletonPulse className="h-4 w-full" />
                  <SkeletonPulse className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Section Skeleton */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonPulse className="h-8 w-72 mx-auto mb-12" />
          <SkeletonPulse className="h-64 w-full max-w-2xl mx-auto rounded-lg" />
        </div>
      </div>

      {/* Ways To Attend Skeleton */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonPulse className="h-8 w-56 mx-auto mb-12" />
          <div className="flex flex-col md:flex-row gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="flex-1 p-6 bg-white rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <SkeletonPulse className="h-12 w-12 rounded-full" />
                  <SkeletonPulse className="h-6 w-32" />
                </div>
                <SkeletonPulse className="h-4 w-full mb-2" />
                <SkeletonPulse className="h-4 w-3/4 mb-2" />
                <SkeletonPulse className="h-4 w-5/6 mb-4" />
                <SkeletonPulse className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
