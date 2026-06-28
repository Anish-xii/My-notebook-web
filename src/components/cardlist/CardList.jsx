import React, { useEffect, useState } from "react";
import Qcard from "../qcard/Qcard";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SkeletonQcard from "../skeleton/SkeletonQcard"; 

// Bring in the same category map used in ProgCard
const topicCategories = [
  { id: "array_hashing", label: "Array & Hashing", matchTags: ["Arrays", "Hash Table / Map"] },
  { id: "two_pointers", label: "Two Pointers", matchTags: ["Two Pointers"] },
  { id: "stack", label: "Stack", matchTags: ["Stack"] },
  { id: "sliding_window", label: "Sliding Window", matchTags: ["Sliding Window"] },
  { id: "binary_search", label: "Binary Search", matchTags: ["Binary Search"] },
  { id: "linked_list", label: "Linked List", matchTags: ["Linked List", "Doubly Linked List", "Circular Linked List"] },
  { id: "tree", label: "Tree", matchTags: ["Tree (Binary Tree, BST)", "Trie"] },
  { id: "backtracking", label: "Backtracking", matchTags: ["Backtracking"] },
  { id: "graph", label: "Graph", matchTags: ["Graph"] },
  { id: "heap_pq", label: "Heap & Priority Que", matchTags: ["Heap / Priority Queue"] },
];

const CardList = ({ filterTag }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "questions"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = filterTag
    ? questions.filter((q) => {
        if (!Array.isArray(q.tags)) return false;

        const mappedCategory = topicCategories.find(c => c.label === filterTag);
        
        if (mappedCategory) {
          return mappedCategory.matchTags.some((matchTag) => q.tags.includes(matchTag));
        }

        return q.tags.includes(filterTag);
      })
    : questions.filter((q) => q.isFavourite);

  return (
    <div className="w-full max-h-[600px] overflow-y-auto flex flex-col gap-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
      {loading ? (
        Array.from({ length: 2 }).map((_, idx) => <SkeletonQcard key={idx} />)
      ) : filteredQuestions.length > 0 ? (
        filteredQuestions.map((q) => (
          <Link
            key={q.slug}
            href={{
              pathname: `/${q.slug}`,
              query: filterTag ? { category: filterTag } : {},
            }}
            className="block hover:no-underline"
          >
            <Qcard
              title={q.title}
              heading={q.description}
              topics={q.tags}
              isFavourite={q.isFavourite}
            />
          </Link>
        ))
      ) : (
        <div className="text-center text-gray-500 pt-6">No questions found.</div>
      )}
    </div>
  );
};

export default CardList;


