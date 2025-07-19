import React, { useEffect, useState } from "react";
import Qcard from "../qcard/Qcard";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SkeletonQcard from "../skeleton/SkeletonQcard"; 

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
        setLoading(false); // ✅ end loading
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = filterTag
    ? questions.filter((q) => Array.isArray(q.tags) && q.tags.includes(filterTag))
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




