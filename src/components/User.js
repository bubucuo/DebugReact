export default function User({ resource }) {
  const user = resource.user.read();
  return (
    <div>
      <h3>User</h3>
      <p>网络请求：{user.name.first}</p>
    </div>
  );
}
