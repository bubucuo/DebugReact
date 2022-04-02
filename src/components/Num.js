export default function Num({ resource }) {
  const num = resource.num.read();
  return (
    <div>
      <h3>Num</h3>
      <p>{num}</p>
    </div>
  );
}
