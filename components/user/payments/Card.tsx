function Card({ children, date }: { children: React.ReactNode; date: string }) {
  return (
    <div className="rounded-lg bg-gradient-to-b from-blue-600 to-green-600 pl-1 transition-all duration-300 ease-in-out hover:from-green-600 hover:to-blue-600">
      <div className="bg-primary-foreground relative w-full rounded-md px-10 py-10">
        <span className="border-primary-identity bg-background text-primary-identity absolute -top-4 rounded-md border-1 px-5 text-lg font-bold">
          {date}
        </span>
        {children}
      </div>
    </div>
  );
}

export default Card;
