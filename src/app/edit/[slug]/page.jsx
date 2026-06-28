"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import Select from "react-select";

const allowedEmail = process.env.NEXT_PUBLIC_ALLOWED_EMAIL;

// Reusing your tagOptions from lgnwrt/page.jsx
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

const EditPage = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [docId, setDocId] = useState(null); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [isFavourite, setIsFavourite] = useState(true);

  // 1. Auth Check (matches lgnwrt/page.jsx logic)
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

  // 2. Fetch the existing question data
  useEffect(() => {
    if (!isVerified) return; // Don't fetch if not verified to save reads

    const fetchQuestion = async () => {
      try {
        const q = query(collection(db, "questions"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const document = snapshot.docs[0];
          const data = document.data();
          
          setDocId(document.id); // Save ID for updating
          setTitle(data.title || "");
          setDescription(data.description || "");
          setCode(data.code || "");
          setNotes(data.notes || "");
          setIsFavourite(data.isFavourite ?? true);
          
          if (data.tags) {
            setTags(data.tags.map(t => ({ label: t, value: t })));
          }
        } else {
          alert("Question not found.");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
      } finally {
        setFetchingData(false);
      }
    };

    fetchQuestion();
  }, [slug, isVerified]);

  // 3. Handle Update
  const handleUpdate = async () => {
    if (!title || !description || !code) {
      alert("Title, description, and code are required.");
      return;
    }

    try {
      const docRef = doc(db, "questions", docId);
      await updateDoc(docRef, {
        title,
        description,
        code,
        notes,
        tags: tags.map((t) => t.value),
        isFavourite,
        // Not updating slug or createdAt, letting them remain the same
      });

      // Clear the session storage so the Question Page re-fetches the fresh data
      sessionStorage.removeItem(`question-${slug}`);

      alert("✅ Question updated successfully!");
      router.push(`/${slug}`); // Push user back to the question page
    } catch (error) {
      console.error("❌ Update Error:", error.message, error);
      alert("❌ Failed to update question. Check console.");
    }
  };

  if (checkingAuth) {
    return <div className="p-10 text-center">Checking authentication...</div>;
  }

  return (
    <div className="relative w-full min-h-screen p-10 bg-white">
      <button
        onClick={() => router.push(`/${slug}`)}
        className="mb-4 flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        ← Cancel & Back
      </button>

      <div
        className={`transition duration-300 max-w-4xl mx-auto ${
          isVerified && !fetchingData ? "" : "blur-sm opacity-40 pointer-events-none select-none"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">✏️ Edit Question</h1>

        {fetchingData && isVerified && (
           <p className="mb-4 text-gray-500">Loading existing question data...</p>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter question title"
          className="w-full border p-2 rounded mb-4"
        />

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
          className="mb-6 z-50"
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
          onClick={handleUpdate}
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow"
        >
          Update Question
        </button>
      </div>

      {!isVerified && (
        <div className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center z-10">
          <p className="mb-4 text-xl font-medium">🔒 Sign in to edit</p>
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-medium"
          >
            Login with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default EditPage;