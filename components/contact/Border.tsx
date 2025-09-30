function Border({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-600 to-green-600 p-[1px] transition-all duration-500 ease-in-out hover:from-green-600 hover:to-blue-600 hover:scale-[1.03] transform-gpu">
      {children}
    </div>
  );
}

export default Border;
