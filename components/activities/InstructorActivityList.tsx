

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteActivityAction } from "@/app/(protected)/profil/actions"
import { reportError } from "@/lib/reportError";
import type { Activity } from "@/types";

interface Props {
  activities: Activity[];
}

export default function InstructorActivityList({ activities }: Props) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorId, setErrorId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }

    setDeletingId(id);
    setConfirmId(null);

    try {
      const result = await deleteActivityAction(id);
      if (result.error) {
        setErrorId(id);
        reportError(new Error(result.error), { page: "profil", activityId: id });
      } else {
        router.refresh();
      }
    } catch (err) {
      setErrorId(id);
      reportError(err, { page: "profil", activityId: id });
    } finally {
      setDeletingId(null);
    }
  };

  if (activities.length === 0) {
    return (
      <p className="text-(--grey-mid) text-sm">
        Du underviser ikke på nogen hold endnu.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {activities.map((a) => (
        <li key={a.id} className="bg-(--grey-light) rounded-xl p-4">

          <p className="text-(--brand-dark) font-bold text-base">{a.name}</p>
          <p className="text-(--brand-dark) text-sm mt-1">
            {a.weekday} {a.time}
          </p>

          <div className="flex gap-6 mt-2">
            <p className="text-(--brand-dark) text-sm">
              Max. deltagere: <span className="font-medium">{a.maxParticipants ?? "—"}</span>
            </p>
            <p className="text-(--brand-dark) text-sm">
              Tilmeldte: <span className="font-medium">{a.users?.length ?? 0}</span>
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <Link
              href={`/aktiviteter/${a.id}/deltagere`}
              className="px-4 py-2 bg-(--brand-dark) text-white text-sm rounded-lg"
            >
              Deltagerliste
            </Link>
            <div className="flex gap-2">
              <Link
                href={`/aktiviteter/${a.id}/rediger`}
                className="w-10 h-10 bg-(--brand-dark) rounded-lg flex items-center justify-center"
              >
                <Pencil size={18} color="white" />
              </Link>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={deletingId === a.id}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  confirmId === a.id ? "bg-red-700" : "bg-(--brand-dark)"
                }`}
                title={confirmId === a.id ? "Klik igen for at bekræfte sletning" : "Slet hold"}
              >
                <Trash2 size={18} color="white" />
              </button>
            </div>
          </div>

          {confirmId === a.id && (
            <p className="text-red-400 text-xs mt-2">
              Er du sikker? Klik på skraldespanden igen for at bekræfte.
            </p>
          )}
          {errorId === a.id && (
            <p className="text-red-400 text-xs mt-2">
              Kunne ikke slette aktiviteten. Prøv igen.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}