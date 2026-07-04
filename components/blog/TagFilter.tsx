"use client";

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onTagChange,
}: TagFilterProps) {
  return (
    <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4">
      <div className="inline-flex gap-2">
        {tags.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onTagChange(tag)}
              className={
                isActive
                  ? "bg-teal text-white text-sm font-medium rounded-full px-4 py-2 transition-colors duration-200 shrink-0"
                  : "bg-gray-100 dark:bg-[#1C1A18] text-gray-600 dark:text-gray-300 hover:bg-teal/10 text-sm font-medium rounded-full px-4 py-2 transition-colors duration-200 shrink-0"
              }
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
