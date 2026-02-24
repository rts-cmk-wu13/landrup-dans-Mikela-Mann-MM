

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
        <div className="flex flex-col items-center">
            <button
                onClick={handleClick}
                disabled={loading}
                className={`
                    w-[70%] py-4 rounded-xl
                    bg-(--brand-mid) text-white font-medium text-base
                    border-none transition-opacity
                    ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
                `}
            >
                {loading ? "Vent…" : enrolled ? "Forlad hold" : "Tilmeld"}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
    );
}