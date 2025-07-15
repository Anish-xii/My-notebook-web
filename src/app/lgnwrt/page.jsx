"use client";

import React, { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import Select from "react-select";
import slugify from "slugify";

const allowedEmail = process.env.NEXT_PUBLIC_ALLOWED_EMAIL;

const tagOptions = [
  {
    label: "Data Structures",
    options: [
      "Arrays", "Strings", "Linked List", "Doubly Linked List", "Circular Linked List",
      "Stack", "Queue", "Deque", "Hash Table / Map", "Set", "Heap / Priority Queue",
      "Tree (Binary Tree, BST)", "Trie", "Segment Tree", "Binary Indexed Tree (Fenwick Tree)",
      "Graph", "Matrix", "Union-Find / Disjoint Set", "Bitset / Bitmask"
    ].map((t) => ({ label: t, value: t }))
  },
  {
    label: "Algorithms / Paradigms",
    options: [
      "Binary Search", "Two Pointers", "Sliding Window", "DFS", "BFS", "Recursion", "Backtracking",
      "Greedy", "Divide and Conquer", "DP", "Bit Manipulation", "Topological Sort", "Flood Fill",
      "Kadane’s Algorithm", "KMP / Z Algorithm", "Prefix Sum", "Sweep Line"
    ].map((t) => ({ label: t, value: t }))
  },
  {
    label: "Problem Types",
    options: [
      "Sorting", "Searching", "Math / Number Theory", "Geometry", "Counting",
      "Subarrays / Subsequences", "Palindromes", "Intervals", "Simulation", "Combinatorics" 
    ].map((t) => ({ label: t, value: t }))
  },
];

const WritePage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [isFavourite, setIsFavourite] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === allowedEmail) {
        setIsVerified(true);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === allowedEmail) {
        setIsVerified(true);
      } else {
        alert("Unauthorized: Wrong email.");
      }
    } catch (error) {
      console.error("🔒 Login Error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !code) {
      alert("🚨 Title, description, and code are required.");
      return;
    }

    const slugBase = slugify(title, { lower: true });
    const uniqueSuffix = Date.now();
    const slug = `${slugBase}-${uniqueSuffix}`;

    const newQuestion = {
      title,
      slug,
      description,
      code,
      notes,
      tags: tags.map((t) => t.value),
      isFavourite,
      createdAt: serverTimestamp(),
    };

    try {
      console.log("📤 Uploading:", newQuestion);
      await addDoc(collection(db, "questions"), newQuestion);

      // ✅ Increment counter
      await updateDoc(doc(db, "meta", "stats"), {
        totalQuestions: increment(1),
      });

      alert("✅ Question submitted!");
      setTitle("");
      setDescription("");
      setCode("");
      setNotes("");
      setTags([]);
      setIsFavourite(true);
    } catch (error) {
      console.error("❌ Upload Error:", error.message, error);
      alert("❌ Failed to upload question. Check console.");
    }
  };

  if (checkingAuth) {
    return <div className="p-10 text-center">Checking authentication...</div>;
  }

  return (
    <div className="relative w-full h-full p-10">
      <div
        className={`transition duration-300 ${
          isVerified ? "" : "blur-sm opacity-40 pointer-events-none select-none"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">📝 Write a New DSA Question</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter question title"
          className="w-full border p-2 rounded mb-4"
        />

        {/* ✅ Favourite Toggle */}
        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Mark as Favourite?
          </label>
          <input
            type="checkbox"
            checked={isFavourite}
            onChange={() => setIsFavourite(!isFavourite)}
            className="w-4 h-4"
          />
        </div>

        <Select
          isMulti
          options={tagOptions}
          value={tags}
          onChange={(selected) => setTags(selected)}
          className="mb-6"
          placeholder="Select related tags"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write question description..."
          className="w-full h-28 p-3 border rounded mb-4"
        />

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your solution code..."
          className="w-full h-48 p-3 border rounded mb-4 font-mono"
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write explanation / notes..."
          className="w-full h-28 p-3 border rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>

      {!isVerified && (
        <div className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center z-10">
          <p className="mb-4 text-xl">🔒 Sign in to access Write Page</p>
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default WritePage;
