

import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { getUser } from "@/lib/api";
import { getSession } from "@/lib/dal";
import LogoutButton from "@/components/ui/LogoutButton";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUser(session.userId, session.token);
  const isInstructor = session.role === "instructor" || session.role === "admin";

  return (
    <main>
      <div className="bg-(--brand-dark) px-4 py-5 flex justify-between items-center">
        <h1 className="text-white font-bold text-lg">Min profil</h1>
        <LogoutButton />
      </div>

      <div className="bg-(--grey-light) px-4 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-(--brand-dark) flex items-center justify-center mx-auto mb-3">
          <User size={28} className="text-(--grey-mid)" />
        </div>
        <p className="text-(--brand-dark) font-bold text-xl">
          {user.firstname} {user.lastname}
        </p>
        <p className="text-(--grey-mid) text-sm mt-1">
          {isInstructor ? "Instruktør" : "Medlem"}
        </p>
      </div>

      <div className="bg-(--brand-dark) px-4 py-6 min-h-screen">
        <h2 className="text-white font-bold mb-4">
          {isInstructor ? "Mine hold" : "Mine aktiviteter"}
        </h2>
        {(user.activities ?? []).length === 0 ? (
          <p className="text-(--grey-mid) text-sm">
            {isInstructor ? "Du underviser ikke på nogen hold endnu." : "Du er ikke tilmeldt nogen aktiviteter endnu."}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {(user.activities ?? []).map((a) => (
              <li key={a.id}>
                <Link
                  href={`/activities/${a.id}`}
                  className="flex justify-between items-center py-3 border-b border-white/10"
                >
                  <span className="text-white text-sm">{a.name}</span>
                  <span className="text-(--grey-mid) text-xs">{a.weekday}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}