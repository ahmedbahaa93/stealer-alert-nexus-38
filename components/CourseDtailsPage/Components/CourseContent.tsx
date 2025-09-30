"use client";

import { useState } from 'react';
import RelatedCourses from './RelatedCourses';
import { useTranslations } from 'next-intl';

// Function to convert any YouTube URL to an embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Handle youtube.com/watch format
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Already an embed URL or other format
  return url;
};

interface CourseVideoProps {
  title?: string;
  videoUrl?: string;
}

interface CourseContentProps {
  content?: string[];
  contentDetails?: { title: string; content: string[] }[];
  courseVideo?: CourseVideoProps;
}

const CourseContent = ({
  content,
  contentDetails,
  courseVideo = { title: "Introduction to Course", videoUrl: "" }
}: CourseContentProps) => {
  const t = useTranslations('courseDetail');

  // Use the provided content or fallback to mock data
  const initialLessons = contentDetails ?
    contentDetails.map((item, index) => ({
      id: index + 1,
      title: item.title,
      description: item.content.join('. '),
      duration: "45 min",
      lessons: `${item.content.length} Lessons`,
      type: content?.[index] || "Module",
      // Don't include static link, let it be undefined if not provided from the API
      isExpanded: index === 0 // Expand only the first one by default
    }))
    : [
      {
        id: 1,
        title: "Introduction to Front-End Development",
        description: "Get started with the basics of front-end development and understand the role of HTML, CSS, and JavaScript.",
        duration: "45 min",
        lessons: "5 Lessons",
        type: "HTML5 Essentials",
        link: "https://www.figma.com/design/7hxbr-dh-0-1&t=6aE",
        isExpanded: true
      },
      {
        id: 2,
        title: "HTML5 Essentials",
        description: "Master HTML5 semantic elements, forms, and modern web standards.",
        duration: "60 min",
        lessons: "8 Lessons",
        type: "HTML5 Essentials",
        isExpanded: false
      },
      {
        id: 3,
        title: "HTML5 Essentials",
        description: "Learn CSS3 styling, animations, and responsive design principles.",
        duration: "75 min",
        lessons: "10 Lessons",
        type: "CSS3 Essentials",
        isExpanded: false
      },
      {
        id: 4,
        title: "HTML5 Essentials",
        description: "Advanced JavaScript concepts and ES6+ features for modern development.",
        duration: "90 min",
        lessons: "12 Lessons",
        type: "JavaScript Fundamentals",
        isExpanded: false
      },
      {
        id: 5,
        title: "Introduction to Front-End Development",
        description: "Build interactive user interfaces with React components and hooks.",
        duration: "120 min",
        lessons: "15 Lessons",
        type: "React Basics",
        link: "https://www.figma.com/design/7hxbr-dh-0-1&t=6aE",
        isExpanded: true
      },
      {
        id: 6,
        title: "HTML5 Essentials",
        description: "Learn Git version control and collaborative development workflows.",
        duration: "45 min",
        lessons: "6 Lessons",
        type: "Version Control",
        isExpanded: false
      },
      {
        id: 7,
        title: "HTML5 Essentials",
        description: "Learn Git version control and collaborative development workflows.",
        duration: "45 min",
        lessons: "6 Lessons",
        type: "Version Control",
        isExpanded: false
      },
      {
        id: 8,
        title: "HTML5 Essentials",
        description: "Learn Git version control and collaborative development workflows.",
        duration: "45 min",
        lessons: "6 Lessons",
        type: "Version Control",
        isExpanded: false
      },
      {
        id: 9,
        title: "HTML5 Essentials",
        description: "Learn Git version control and collaborative development workflows.",
        duration: "45 min",
        lessons: "6 Lessons",
        type: "Version Control",
        isExpanded: false
      },
      {
        id: 10,
        title: "HTML5 Essentials",
        description: "Learn Git version control and collaborative development workflows.",
        duration: "45 min",
        lessons: "6 Lessons",
        type: "Version Control",
        isExpanded: false
      },
      {
        id: 11,
        title: "Introduction to Front-End Development",
        description: "Learn Git version control and collaborative development workflows.",
        duration: "45 min",
        lessons: "6 Lessons",
        type: "Version Control",
        link: "https://www.figma.com/design/7hxbr-dh-0-1&t=6aE",
        isExpanded: true
      }
    ];

  const [lessons, setLessons] = useState(initialLessons);

  const toggleLesson = (lessonId: number) => {
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, isExpanded: !lesson.isExpanded }
          : lesson
      )
    );
  };

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Course Content */}
          <div>
            <h2 className="text-2xl md:text-2xl font-bold text-[#0F43B4] mb-8">
              {t('courseContent')}
            </h2>

            <div className="space-y-0">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border-l-2 border-dashed border-gray-300 relative">
                  {/* Blue dot indicator */}
                  <div className="absolute -left-[5px] top-4 w-2 h-2 bg-[#0F43B4] rounded-full"></div>

                  <div className="ml-6 pb-6">
                    {/* Main lesson title with arrow */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-[#0F43B4] cursor-pointer hover:underline">
                        {lesson.title}
                      </h3>
                      <button
                        onClick={() => toggleLesson(lesson.id)}
                        className="p-1 text-gray-400 hover:text-[#0F43B4] transition-colors"
                        title={lesson.isExpanded ? "Collapse lesson details" : "Expand lesson details"}
                        aria-label={lesson.isExpanded ? "Collapse lesson details" : "Expand lesson details"}
                        type="button"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ease-in-out ${lesson.isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Expanded content */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${lesson.isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="space-y-2 text-sm text-gray-600 pt-2">
                        <p className="flex items-start gap-2">
                          <span className="text-gray-500">•</span>
                          {lesson.description}
                        </p>

                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500">•</span>
                            {lesson.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500">•</span>
                            {lesson.lessons}
                          </span>
                        </div>

                        {lesson.link && (
                          <p className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                            <span className="text-gray-500">•</span>
                            {lesson.link}
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Introduction Card and Related Courses */}
          <div className="space-y-8">
            {/* Introduction Video Card */}
            <div>
              <h2 className="text-lg text-center md:text-2xl font-bold text-[#0F43B4] mb-6">
                {courseVideo?.title || "Introduction to Course"}
              </h2>
              <div className="flex justify-center mb-4 relative">
                {courseVideo?.videoUrl ? (
                  <div className="relative w-full max-w-sm">
                    {courseVideo.videoUrl.includes('youtube') || courseVideo.videoUrl.includes('youtu.be') ? (
                      <iframe
                        className="w-full aspect-video rounded-lg shadow-md"
                        src={getYouTubeEmbedUrl(courseVideo.videoUrl)}
                        title={courseVideo.title || "Course Video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <iframe
                        className="w-full aspect-video rounded-lg shadow-md"
                        src={courseVideo.videoUrl}
                        title={courseVideo.title || "Course Video"}
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-sm aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No video available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Courses Section */}
            <div>
              <h3 className="text-xl font-bold text-center text-[#0F43B4] mb-6">
                Related courses you can also join
              </h3>

              <div className="gap-4">
                <RelatedCourses />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;