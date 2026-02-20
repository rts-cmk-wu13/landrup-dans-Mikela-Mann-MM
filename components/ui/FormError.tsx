

import { ContactFormErrors } from "@/types";

export default function FormError({ message }: Pick<ContactFormErrors, "message">) {
  if (!message) return null;
  return (
   <p className="text-(--error)  text-xs mt-1 font-(--font-body)" role="alert">
      {message}
    </p>
  );
}