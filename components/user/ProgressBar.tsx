interface ProgressBarProps {
  title: string;
  progress: string;
  courseTitle?: string;
}

function ProgressBar({ title, progress, courseTitle }: ProgressBarProps) {
  const isCompleted = progress === '100%';
  const progressValue = isCompleted ? '100' : progress;

  return (
    <div className="w-full space-y-2">
      {courseTitle && (
        <h2 className="text-primary font-semibold text-lg mb-1">{courseTitle}</h2>
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-primary-identity text-xl font-semibold">{title}</h3>
        <span className="text-primary text-sm">
          {isCompleted ? 'Completed' : `${progress}`}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${isCompleted ? 'bg-primary-identity' : 'bg-gradient-to-r from-blue-500 to-green-400'} transition-all duration-300`}
          style={{ width: progressValue }}
          role="progressbar"
          aria-label={`${title} progress`}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
