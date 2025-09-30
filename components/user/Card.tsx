function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gradient-to-b from-blue-600 to-green-600 pl-1 transition-all duration-300 ease-in-out hover:from-green-600 hover:to-blue-600">
      <div className="bg-primary-foreground w-full rounded-md px-3 lg:px-10 py-10">
        {children}
      </div>
    </div>
  );
}

export default Card;
