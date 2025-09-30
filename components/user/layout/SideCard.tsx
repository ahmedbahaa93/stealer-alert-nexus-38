function SideCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-blue-600 to-green-600 py-1 transition-all duration-300 ease-in-out hover:from-green-600 hover:to-blue-600 ${className}`}
    >
      <div className="bg-primary-foreground h-full rounded-md px-3 py-5">
        {children}
      </div>
    </div>
  );
}

export default SideCard;
