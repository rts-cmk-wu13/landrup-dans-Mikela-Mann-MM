

"use client";

import { Search } from "lucide-react";
import { SearchBarProps } from "@/types"

export default function SearchBar({
  value,
  onChange,
  placeholder = "Søg aktivitet, ugedag eller instruktør…",
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <Search size={18} className="shrink-0 opacity-60" />
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