

import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { getActivity, getActivityParticipants, getUser } from "@/lib/api";
import { getSession } from "@/lib/dal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ParticipantsPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();

  if (!session || (session.role !== "instructor" && session.role !== "admin")) {
    redirect("/activities");
  }

  const [activity, participants, user] = await Promise.all([
    getActivity(Number(id)),
    getActivityParticipants(Number(id), session.token),
    getUser(session.userId, session.token),
  ]);

  return (
    <main className="page-content">

      {/* ── Top bar ── */}
      <div className="bg-(--brand-dark) px-4 py-5 text-center">
        <h1 className="text-white text-lg font-medium">
          Min profil
        </h1>
      </div>

      {/* ── Profil header (lys baggrund) ── */}
      <div className="bg-(--grey-light) px-4 py-7 text-center">
        <div className="w-14 h-14 rounded-full bg-(--brand-dark) flex items-center justify-center mx-auto mb-3">
          <User size={28} color="var(--grey-mid)" />
        </div>
        <p className="text-xl font-medium text-(--brand-dark)">
          {user.firstname} {user.lastname}
        </p>
        <p className="text-sm text-(--grey-dark) mt-1">
          Instruktør
        </p>
      </div>

      {/* ── Deltagerliste (mørk baggrund) ── */}
      <div className="bg-(--brand-dark) px-4 py-6 min-h-screen">
        <h2 className="text-white text-lg font-medium mb-1">
          {activity.name}
        </h2>
        <p className="text-white font-medium text-base mb-4">
          Deltagere:
        </p>

        {participants.length === 0 ? (
          <p className="text-(--grey-mid) text-sm">
            Ingen tilmeldte endnu.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between bg-(--grey-light) rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <User size={20} color="var(--grey-dark)" />
                  <span className="text-(--brand-dark) text-base">
                    {p.firstname} {p.lastname}
                  </span>
                </div>
                <span className="text-(--grey-dark) text-sm">
                  {p.age} år
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  );
}