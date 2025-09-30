function Border({
  children,
  from = 'blue',
  to = 'green',
  padding = 'py-[2px]',
  className = '',
  invertOnHover = false
}: {
  children: React.ReactNode;
  from?: string;
  to?: string;
  padding?: string;
  className?: string;
  invertOnHover?: boolean;
}) {
  const hoverGradient = invertOnHover
    ? `hover:from-${to}-600 hover:to-${from}-600`
    : 'hover:from-green-600 hover:to-blue-600';

  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-${from}-600 to-${to}-600 ${padding} ${hoverGradient} hover:scale-[1.03] transition-all duration-500 ease-in-out transform-gpu ${className}`}
    >
      {children}
    </div>
  );
}

export default Border;
