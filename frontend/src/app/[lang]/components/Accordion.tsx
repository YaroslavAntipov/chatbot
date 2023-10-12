import React from "react";
import { useState } from "react";

export const Accordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full p-2 text-left text-gray-800 text-sm font-semibold hover:bg-gray-200"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <span>{title}</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 shrink-0 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      {isExpanded && (
        <div className="p-2 text-sm text-gray-600">{children}</div>
      )}
    </div>
  );
};
