

"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { SearchBarProps } from "@/types";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Søg aktivitet, ugedag eller instruktør…",
}: SearchBarProps) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  function handleClose() {
    setExpanded(false);
    onChange("");
  }

  if (!expanded) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => setExpanded(true)}
          aria-label="Åbn søgning"
          className="text-white opacity-80 hover:opacity-100 transition-opacity p-1"
        >
          <Search size={22} />
        </button>
      </div>
    );
  }

  return (
    <div className="search-bar animate-in fade-in slide-in-from-top-1 duration-200">
      <Search size={18} className="shrink-0 opacity-60 text-white" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Søg"
      />
      <button
        onClick={handleClose}
        aria-label="Luk søgning"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
}