function Border({
  children,
  from = 'blue',
  to = 'green',
  padding = 'py-[2px]'
}: {
  children: React.ReactNode;
  from?: string;
  to?: string;
  padding?: string;
}) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-${from}-600 to-${to}-600 ${padding} hover:from-green-600 hover:to-blue-600 hover:scale-[1.005] transition-all duration-300 ease-in-out transform-gpu`}
    >
      {children}
    </div>
  );
}

export default Border;
