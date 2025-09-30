function Paragraph({
  data,
  type = 'gray'
}: {
  data: string;
  type?: 'gray' | 'blue';
}) {
  if (type === 'gray') {
    return <p className="text-[#808080] wrap-anywhere">{data}</p>;
  } else {
    return <p className="text-primary-identity">{data}</p>;
  }
}

export default Paragraph;
