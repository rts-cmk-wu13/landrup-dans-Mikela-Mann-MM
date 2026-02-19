

interface Props {
  message?: string;
}

export default function FormError({ message }: Props) {
  if (!message) return null;
  return (
    <p
      style={{
        color: "#dc2626",
        fontSize: "0.75rem",
        marginTop: "0.25rem",
        fontFamily: "var(--font-body)",
      }}
      role="alert"
    >
      {message}
    </p>
  );
}