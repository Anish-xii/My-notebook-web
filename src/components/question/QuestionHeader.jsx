import React from "react";

const QuestionHeader = ({ title, description, topics = [] }) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md md:h-full md:overflow-y-auto">
      {/* 🟦 Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>

      {/* 🟧 Topic Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* 📝 Description */}
      <div className="text-sm text-gray-700 whitespace-pre-wrap">{description}</div>
    </div>
  );
};

export default QuestionHeader;

