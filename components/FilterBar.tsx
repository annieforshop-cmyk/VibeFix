"use client";

import { ALL_CATEGORIES, Category } from "@/lib/data";

interface FilterBarProps {
  selected: Category | null;
  onSelect: (cat: Category | null) => void;
}

export default function FilterBar({ selected, onSelect }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          selected === null
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        全部
      </button>
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(selected === cat ? null : cat)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            selected === cat
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
