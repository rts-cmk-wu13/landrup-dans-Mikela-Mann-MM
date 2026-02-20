

"use client";

import { logout } from "@/lib/actions";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-(--grey-mid) text-sm flex items-center gap-1"
      >
        <LogOut size={16} />
        Log ud
      </button>
    </form>
  );
}