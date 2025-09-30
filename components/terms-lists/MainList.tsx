function MainList({ t, path }: { t: any; path: string }) {
  return (
    <ul className="list-disc px-8">
      {t.raw(path).map((item: string, index: number) => (
        <li key={index} className="text-sidebar-ring">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default MainList;
