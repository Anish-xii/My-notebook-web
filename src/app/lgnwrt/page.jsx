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
      alert("Title, description, and code are required.");
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

      // Increment counter
      await updateDoc(doc(db, "meta", "stats"), {
        totalQuestions: increment(1),
      });

      alert("Question submitted!");
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-lg font-medium text-gray-500">
          Checking authentication...
        </div>
      </div>
    );
  }

  const inputStyles =
    "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        
        {/* Main Form Card */}
        <div
          className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition duration-500 ${
            isVerified ? "" : "blur-md opacity-40 pointer-events-none select-none"
          }`}
        >
          {/* Header */}
          <div className="bg-white px-6 py-8 sm:px-10 border-b border-gray-100">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Write a New DSA Question
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Document your problem-solving journey. Fill out the details below to add a new question to your notebook.
            </p>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8 sm:px-10 space-y-8">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="e.g., Two Sum, Reverse Linked List"
                className={inputStyles}
              />
            </div>

            {/* Grid for Tags and Favourite Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags & Categories
                </label>
                <Select
                  isMulti
                  options={tagOptions}
                  value={tags}
                  onChange={(selected) => setTags(selected)}
                  placeholder="Select related tags..."
                  className="text-sm rounded-xl shadow-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '50px',
                      borderRadius: '0.75rem',
                      borderColor: '#E5E7EB',
                      backgroundColor: '#F9FAFB',
                    })
                  }}
                />
              </div>

              {/* Styled Favourite Toggle */}
              <div className="flex items-center h-[50px] px-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                <label className="flex items-center cursor-pointer w-full justify-between">
                  <span className="text-sm font-semibold text-gray-700">Mark as Favourite</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isFavourite}
                      onChange={() => setIsFavourite(!isFavourite)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${isFavourite ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isFavourite ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the problem statement or write your own description..."
                className={`${inputStyles} min-h-[120px] resize-y`}
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Solution Code <span className="text-red-500">*</span>
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your optimized solution here..."
                className="w-full px-4 py-4 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-gray-900 text-gray-100 font-mono text-sm min-h-[250px] resize-y shadow-inner scrollbar-thin scrollbar-thumb-gray-600"
                spellCheck="false"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Explanation & Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Time complexity, Space complexity, intuition, edge cases..."
                className={`${inputStyles} min-h-[120px] resize-y`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex justify-center items-center gap-2"
              >
                <span>Submit Question</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>

          </div>
        </div>

        {/* Auth Overlay Overlay */}
        {!isVerified && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-white/40 backdrop-blur-sm rounded-2xl">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100 text-center max-w-sm w-full mx-4 transform transition-all">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-500 mb-8 text-sm">
                You must be an authorized admin to add new questions to the notebook.
              </p>
              <button
                onClick={handleLogin}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Login with Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritePage;
