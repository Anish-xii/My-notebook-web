import React, { useEffect, useState } from "react";
import Qcard from "../qcard/Qcard";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CardList = ({ filterTag }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = filterTag
    ? questions.filter((q) => Array.isArray(q.tags) && q.tags.includes(filterTag))
    : questions.filter((q) => q.isFavourite); 

  return (
    <div className="w-full max-h-[600px] overflow-y-auto flex flex-col gap-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
      {filteredQuestions.map((q) => (
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
      ))}

      {filteredQuestions.length === 0 && (
        <div className="text-center text-gray-500 pt-6">No questions found.</div>
      )}
    </div>
  );
};

export default CardList;



