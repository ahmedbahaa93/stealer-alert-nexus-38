import Image from 'next/image';

interface ThemedIconProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function DynamicIcon({
  src,
  alt,
  width = 30,
  height = 30,
  className
}: ThemedIconProps) {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
    />
  );
}
