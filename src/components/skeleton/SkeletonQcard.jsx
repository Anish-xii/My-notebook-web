import React from "react";

const SkeletonQcard = () => {
  return (
    <div className="w-full border border-gray-200 rounded-xl p-3 sm:p-4 bg-white space-y-2 animate-pulse">
      {/* Title and Star */}
      <div className="flex justify-between items-start">
        <div className="h-4 sm:h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-5 w-5 bg-gray-200 rounded-full" />
      </div>

      {/* Description line */}
      <div className="space-y-1">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-1">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-12 bg-gray-200 rounded-full" />
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonQcard;
