export default function Num({resource}) {
  const num = resource.num.read();

  return (
    <div className="border">
      <h3>Num - setTimeout模拟</h3>
      <p>{num}</p>
    </div>
  );
}
