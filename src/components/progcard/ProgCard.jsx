"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const topicCategories = [
  {
    id: "array_hashing",
    label: "Array & Hashing",
    matchTags: ["Arrays", "Hash Table / Map"],
  },
  {
    id: "two_pointers",
    label: "Two Pointers",
    matchTags: ["Two Pointers"],
  },
  {
    id: "stack",
    label: "Stack",
    matchTags: ["Stack"],
  },
  {
    id: "sliding_window",
    label: "Sliding Window",
    matchTags: ["Sliding Window"],
  },
  {
    id: "binary_search",
    label: "Binary Search",
    matchTags: ["Binary Search"],
  },
  {
    id: "linked_list",
    label: "Linked List",
    matchTags: [
      "Linked List",
      "Doubly Linked List",
      "Circular Linked List",
    ],
  },
  {
    id: "tree",
    label: "Tree",
    matchTags: ["Tree (Binary Tree, BST)", "Trie"],
  },
  {
    id: "backtracking",
    label: "Backtracking",
    matchTags: ["Backtracking"],
  },
  {
    id: "graph",
    label: "Graph",
    matchTags: ["Graph"],
  },
  {
    id: "heap_pq",
    label: "Heap",
    matchTags: ["Heap / Priority Queue"],
  },
];

export default function ProgCard({ showCompact = false }) {
  const router = useRouter();

  const [topicCounts, setTopicCounts] = useState({});
  const [totalSolved, setTotalSolved] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "questions"));
        const questions = snapshot.docs.map((doc) => doc.data());

        setTotalSolved(questions.length);

        const counts = {};

        topicCategories.forEach((topic) => {
          counts[topic.id] = 0;
        });

        questions.forEach((question) => {
          const tags = question.tags || [];

          topicCategories.forEach((topic) => {
            if (topic.matchTags.some((tag) => tags.includes(tag))) {
              counts[topic.id]++;
            }
          });
        });

        setTopicCounts(counts);
      } catch (err) {
        console.error("Failed to fetch pattern counts:", err);
      }
    };

    fetchQuestions();
  }, []);

  const sortedTopics = useMemo(() => {
    return topicCategories
      .map((topic) => ({
        ...topic,
        count: topicCounts[topic.id] || 0,
      }))
      .filter((topic) => topic.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [topicCounts]);

  const visibleTopics = expanded
    ? sortedTopics
    : sortedTopics.slice(0, 5);

  const handleCategoryClick = (label) => {
    router.push(`/?category=${encodeURIComponent(label)}`, {
      scroll: false,
    });
  };

  // Mobile
  if (showCompact) {
    return (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-20 right-5 z-50 rounded-full border bg-white px-4 py-3 text-sm font-semibold shadow-lg"
      >
        {totalSolved}
      </button>
    );
  }

  return (
    <aside className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Patterns
        </h3>

        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
          {totalSolved}
        </span>
      </div>

      {/* Topics */}
      <div
        className={`py-2 ${
          expanded ? "max-h-80 overflow-y-auto" : ""
        }`}
      >
        {visibleTopics.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-400">
            No patterns explored yet.
          </p>
        ) : (
          visibleTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleCategoryClick(topic.label)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
            >
              <span className="truncate text-sm text-gray-700">
                {topic.label}
              </span>

              <span className="ml-4 text-sm font-semibold text-gray-900">
                {topic.count}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      {sortedTopics.length > 5 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full border-t px-4 py-3 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          {expanded
            ? "Show less"
            : `Show all (${sortedTopics.length})`}
        </button>
      )}
    </aside>
  );
}