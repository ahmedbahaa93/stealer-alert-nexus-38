function Box({
  children,
  className = 'mt-5'
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export default Box;
