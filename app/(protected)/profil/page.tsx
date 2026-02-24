

import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { getUser, getActivities } from "@/lib/api";
import { getSession } from "@/lib/dal";
import LogoutButton from "@/components/ui/LogoutButton";
import InstructorActivityList from "@/components/activities/InstructorActivityList";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const isInstructor = session.role === "instructor" || session.role === "admin";

  const [user, allActivities] = await Promise.all([
    getUser(session.userId, session.token),
    isInstructor ? getActivities() : Promise.resolve([]),
  ]);

  const instructorActivities = allActivities.filter(
    (a) => a.instructorId === session.userId
  );

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold">
            {isInstructor ? "Mine hold" : "Tilmeldte hold"}
          </h2>
          {isInstructor && (
            <Link
              href="/aktiviteter/opret"
              className="w-10 h-10 bg-(--grey-light) rounded-xl flex items-center justify-center font-bold text-(--brand-dark) text-xl"
            >
              +
            </Link>
          )}
        </div>

        {isInstructor ? (
          <InstructorActivityList activities={instructorActivities} />
        ) : (user.activities ?? []).length === 0 ? (
          <p className="text-(--grey-mid) text-sm">
            Du er ikke tilmeldt nogen aktiviteter endnu.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {(user.activities ?? []).map((a) => (
              <li key={a.id} className="bg-(--grey-light) rounded-xl p-4">
                <p className="text-(--brand-dark) font-bold text-base">{a.name}</p>
                <p className="text-(--brand-dark) text-sm mt-1">
                  {a.weekday} kl. {a.time}
                </p>
                <div className="mt-3">
                  <Link
                    href={`/aktiviteter/${a.id}`}
                    className="px-4 py-2 bg-(--brand-dark) text-white text-sm rounded-lg inline-block"
                  >
                    Vis hold
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}