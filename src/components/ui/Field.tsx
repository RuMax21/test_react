export default function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span>{label}</span>
      {children}
      {error ? <span className="text-red-800">{error}</span> : null}
    </label>
  );
}
