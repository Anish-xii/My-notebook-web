"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const tagList = [
  "Arrays", "Strings", "Linked List", "Doubly Linked List", "Circular Linked List",
  "Stack", "Queue", "Deque", "Hash Table / Map", "Set", "Heap / Priority Queue",
  "Tree (Binary Tree, BST)", "Trie", "Segment Tree", "Binary Indexed Tree (Fenwick Tree)",
  "Graph", "Matrix", "Union-Find / Disjoint Set", "Bitset / Bitmask",
  "Binary Search", "Two Pointers", "Sliding Window", "DFS", "BFS", "Recursion", "Backtracking",
  "Greedy", "Divide and Conquer", "DP", "Bit Manipulation", "Topological Sort", "Flood Fill",
  "Kadane’s Algorithm", "KMP / Z Algorithm", "Prefix Sum", "Sweep Line",
  "Sorting", "Searching", "Math / Number Theory", "Geometry", "Counting",
  "Subarrays / Subsequences", "Palindromes", "Intervals", "Simulation", "Combinatorics"
];

const SearchBox = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const data = snapshot.docs.map((doc) => doc.data());
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!input) return setSuggestions([]);

    const lower = input.toLowerCase();

    const matchedTags = tagList
      .filter((tag) => tag.toLowerCase().includes(lower))
      .map((tag) => ({ type: "tag", label: tag }));

    const matchedQuestions = questions
      .filter((q) => q.title.toLowerCase().includes(lower))
      .map((q) => ({ type: "question", label: q.title, slug: q.slug }));

    setSuggestions([...matchedTags, ...matchedQuestions].slice(0, 5)); 
  }, [input, questions]);

  const handleSelect = (item) => {
    setInput(""); 
  
    if (item.type === "tag") {
      router.push(`/?category=${encodeURIComponent(item.label)}`);
    } else if (item.type === "question") {
      router.push(`/${item.slug}`);
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length === 1) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search DSA questions..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-64 overflow-auto">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700 flex justify-between items-center"
            >
              <span>{item.label}</span>
              <span className="text-xs italic text-gray-400">
                {item.type === "tag" ? "Category" : "Question"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
