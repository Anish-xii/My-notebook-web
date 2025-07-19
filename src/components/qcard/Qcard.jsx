import React from "react";

const Qcard = ({
  title = "Two Sum",
  heading = "Find indices of two numbers that add up to target.",
  topics = ["Array", "HashMap"],
  isFavourite = false, 
}) => {
  return (
    <div className="w-full border border-gray-200 rounded-xl p-3 sm:p-4 bg-white hover:shadow transition duration-200 space-y-1 sm:space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight mb-3 sm:mb-1">
          {title}
        </h3>

        {isFavourite && (
          <svg
            className="w-5 h-5 fill-yellow-400 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M6 2a2 2 0 0 0-2 2v18l8-4 8 4V4a2 2 0 0 0-2-2H6z" />
          </svg>
        )}
      </div>

      {/* Summary (only on sm and up) */}
      <p
        className="text-sm text-gray-600 line-clamp-2 overflow-hidden text-ellipsis whitespace-normal sm:block"
      >
        {heading.split(/\s+/).slice(0, 15).join(" ") + "..."}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-2 ">
        {topics.map((topic, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Qcard;
