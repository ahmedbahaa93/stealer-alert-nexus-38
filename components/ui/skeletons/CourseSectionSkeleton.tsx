"use client";

import { MotionDiv } from "@/components/ui/motion";

const CourseSectionSkeleton = () => {
  return (
    <div className="mb-12 px-4 relative">
      {/* Cards container */}
      <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        {[1, 2].map((item) => (
          <MotionDiv
            key={item}
            className="relative bg-white rounded-2xl p-8 min-h-[320px] shadow-md"
            style={{
              boxShadow: "0 0 0 2px #e0e0e0, 0 0 0 4px #e0e0e0",
              borderRadius: "1.5rem",
            }}
            animate={{ opacity: [0.6, 0.8, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            {/* Card Content - Left Side */}
            <div className="flex-1 pr-40">
              {/* Title placeholder */}
              <MotionDiv
                className="h-8 w-3/5 rounded-md bg-gray-200 mx-auto mb-6"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              />

              {/* Content placeholders */}
              <div className="space-y-5 mb-6">
                <div className="flex items-center gap-2">
                  <MotionDiv
                    className="h-6 w-28 rounded-md bg-gray-200"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  />
                  <MotionDiv
                    className="h-6 w-40 rounded-md bg-gray-200"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MotionDiv
                    className="h-6 w-28 rounded-md bg-gray-200"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                  />
                  <MotionDiv
                    className="h-6 w-60 rounded-md bg-gray-200"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.7 }}
                  />
                </div>
              </div>

              {/* Button placeholder */}
              <div className="flex justify-center">
                <MotionDiv
                  className="h-10 w-36 rounded-md bg-gray-200"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
                />
              </div>
            </div>

            {/* Right side image placeholder */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gray-200 rounded-tr-2xl rounded-br-2xl"></div>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default CourseSectionSkeleton;
