

"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearServerSession } from "@/lib/session";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await clearServerSession();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-(--grey-mid) text-sm flex items-center gap-1"
    >
      <LogOut size={16} />
      Log ud
    </button>
  );
}