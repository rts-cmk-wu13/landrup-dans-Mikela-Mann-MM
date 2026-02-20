

"use client";

import { useState } from "react";
import { EnrollButtonProps } from "@/types";

export default function EnrollButton({ activityId, initialEnrolled, onEnroll, onLeave }: EnrollButtonProps) {
    const [enrolled, setEnrolled] = useState(initialEnrolled);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleClick = async () => {
        setLoading(true);
        setError("");
        const result = enrolled ? await onLeave(activityId) : await onEnroll(activityId);
        if (result.error) setError(result.error);
        else setEnrolled((e) => !e);
        setLoading(false);
    };

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={loading}
                className={`
    bg-brand-dark text-white font-medium text-md font-sans
    px-14 py-3.5 rounded-lg border-none transition-opacity
    ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
  `}
            >
                {loading ? "Vent…" : enrolled ? "Forlad hold" : "Tilmeld"}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
    );
}