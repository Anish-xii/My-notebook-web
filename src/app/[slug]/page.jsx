"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { ArrowLeft } from "lucide-react";

import QuestionHeader from "@/components/question/QuestionHeader";
import AnswerCode from "@/components/answer/AnswerCode";
import NotesSection from "@/components/notes/NotesSection";

// ✅ Modern Loading Placeholder
const LoadingPlaceholder = ({ label }) => {
  return (
    <div className="bg-white p-4 rounded shadow h-full flex items-center justify-center text-gray-400 text-sm font-medium">
      {label}
      <span className="ml-1 animate-blink">...</span>
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-blink {
          animation: blink 1.2s infinite;
        }
      `}</style>
    </div>
  );
};

const QuestionPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCategory = searchParams.get("category");

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const q = query(collection(db, "questions"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setQuestionData(snapshot.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching question:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [slug]);

  const handleBackClick = () => {
    if (fromCategory) {
      router.push(`/?category=${fromCategory}`);
    } else {
      router.push("/");
    }
  };

  const { title, description, tags, code, notes } = questionData || {};

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100">
      <button
        onClick={handleBackClick}
        className="mt-4 ml-4 flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Mobile Layout */}
      <div className="md:hidden pt-6 px-4 pb-4 h-full overflow-y-auto space-y-4">
        {loading ? (
          <>
            <LoadingPlaceholder label="Loading question" />
            <LoadingPlaceholder label="Loading code" />
            <LoadingPlaceholder label="Loading notes" />
          </>
        ) : (
          <>
            <QuestionHeader title={title} description={description} topics={tags} />
            <AnswerCode code={code} />
            <NotesSection notes={notes} />
          </>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full pt-6 px-4 gap-2">
        <PanelGroup direction="horizontal" className="w-full h-full gap-2">
          <Panel defaultSize={60} minSize={20} maxSize={70}>
            <div className="h-full overflow-y-auto">
              {loading ? (
                <LoadingPlaceholder label="Loading question" />
              ) : (
                <QuestionHeader title={title} description={description} topics={tags} />
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 transition-all duration-150 cursor-col-resize rounded" />

          <Panel defaultSize={60}>
            <PanelGroup direction="vertical" className="h-full gap-2">
              <Panel defaultSize={60} minSize={30} maxSize={90}>
                <div className="h-full overflow-y-auto">
                  {loading ? (
                    <LoadingPlaceholder label="Loading code" />
                  ) : (
                    <AnswerCode code={code} />
                  )}
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-all duration-150 cursor-row-resize rounded" />

              <Panel defaultSize={40} minSize={10} maxSize={70}>
                <div className="h-full overflow-y-auto">
                  {loading ? (
                    <LoadingPlaceholder label="Loading notes" />
                  ) : (
                    <NotesSection notes={notes} />
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default QuestionPage;

