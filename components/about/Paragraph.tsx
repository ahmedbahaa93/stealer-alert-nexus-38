function Paragraph({ data, className }: { data: string; className?: string }) {
  return <p className={`${className} text-sidebar-ring`}>{data}</p>;
}

export default Paragraph;
