

"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Søg aktivitet, ugedag eller instruktør…",
}: Props) {
  return (
    <div className="search-bar">
      <Search size={18} style={{ flexShrink: 0, opacity: 0.6 }} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Søg"
      />
    </div>
  );
}