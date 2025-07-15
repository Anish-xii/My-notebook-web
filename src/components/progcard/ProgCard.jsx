"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ProgCard = ({ goal = 400, showCompact = false }) => {
  const [totalSolved, setTotalSolved] = useState(0); // default: 0

  useEffect(() => {
    const fetchTotalSolved = async () => {
      try {
        const docSnap = await getDoc(doc(db, "meta", "stats"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTotalSolved(data.totalQuestions || 0);
        } else {
          console.warn("📭 No stats document found.");
        }
      } catch (err) {
        console.error("❌ Error fetching total solved:", err);
      }
    };

    fetchTotalSolved();
  }, []);

  const circleRadius = 45;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleProgressPercent = Math.min((totalSolved / goal) * 100, 100);
  const strokeOffset =
    circleCircumference - (circleProgressPercent / 100) * circleCircumference;

  const milestones = [100, 200, 300, 400];

  if (showCompact) {
    return (
      <div
        className={`
          fixed bottom-20 right-5 z-50 w-20 h-20
          bg-white shadow-xl rounded-full border border-gray-300
          flex items-center justify-center
          transition-all duration-500 ease-in-out
          opacity-100 scale-100
        `}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            stroke="#10b981"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-gray-800">
          {totalSolved}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-full rounded-3xl p-6 bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-28 h-28 hover:scale-105 transition-transform duration-300">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={circleRadius}
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={circleRadius}
              stroke="#10b981"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-gray-800">
              {totalSolved}
            </span>
            <span className="text-xs text-emerald-600">/ {goal}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const prev = index === 0 ? 0 : milestones[index - 1];
          const range = milestone - prev;
          const currentBlockSolved = totalSolved - prev;

          const isCompleted = totalSolved >= milestone;
          const isCurrent = totalSolved >= prev && totalSolved < milestone;
          const progressPercent = isCompleted
            ? 100
            : isCurrent
            ? (currentBlockSolved / range) * 100
            : 0;

          return (
            <div
              key={milestone}
              className="flex items-center gap-3 group transition-all duration-300"
            >
              <span className="w-10 text-sm text-gray-700 font-mono">
                {milestone}
              </span>

              <div className="flex-1 h-3 rounded-full bg-gray-100 relative overflow-hidden border border-gray-300 group-hover:border-emerald-400">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCompleted
                      ? "bg-gray-400"
                      : isCurrent
                      ? "bg-emerald-500"
                      : "bg-transparent"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="w-5 h-5 flex items-center justify-center">
                {isCompleted && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgCard;
