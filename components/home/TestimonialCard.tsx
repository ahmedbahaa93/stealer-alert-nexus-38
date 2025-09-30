import { DynamicIcon } from '../DynamicIcon';

interface TestimonialCardProps {
  fullName: string;
  jobTitle: string;
  content: string;
}

function TestimonialCard({ fullName, jobTitle, content }: TestimonialCardProps) {
  return (
    <div className="h-full min-h-[28rem]">
      <div className="bg-[#0F43B4] border border-blue-200 rounded-xl p-12 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex flex-col h-full">
          <div className="mb-10">
            <DynamicIcon
              src="/assets/home/qoute.svg"
              width={56}
              height={48}
              alt="quote-icon"
              className="text-white opacity-80"
            />
          </div>

          <div className="flex-grow mb-10">
            <p className="text-white text-2xl leading-relaxed line-clamp-4">&#34;{content}&#34;</p>
          </div>

          <div className="flex items-center pt-8 border-t border-white/20">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl">
              {fullName.charAt(0)}
            </div>
            <div className="ml-6">
              <h3 className="text-white font-semibold text-2xl">{fullName}</h3>
              <p className="text-white/80 text-xl">{jobTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
