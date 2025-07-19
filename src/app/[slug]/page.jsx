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

import SkeletonQuestionHeader from "@/components/skeleton/SkeletonQuestionHeader";
import SkeletonAnswerCode from "@/components/skeleton/SkeletonAnswerCode";
import SkeletonNotesSection from "@/components/skeleton/SkeletonNotesSection";

const QuestionPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCategory = searchParams.get("category");

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem(`question-${slug}`);
    if (cached) {
      setQuestionData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const q = query(collection(db, "questions"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setQuestionData(data);
          sessionStorage.setItem(`question-${slug}`, JSON.stringify(data));
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

      {/* 📱 Mobile View */}
      <div className="md:hidden pt-6 px-4 pb-4 h-full overflow-y-auto space-y-4">
        {loading ? (
          <>
            <SkeletonQuestionHeader />
            <SkeletonAnswerCode />
            <SkeletonNotesSection />
          </>
        ) : (
          <>
            <QuestionHeader title={title} description={description} topics={tags} />
            <AnswerCode code={code} />
            <NotesSection notes={notes} />
          </>
        )}
      </div>

      {/* 💻 Desktop Split View */}
      <div className="hidden md:flex h-full pt-6 px-4 gap-2">
        <PanelGroup direction="horizontal" className="w-full h-full gap-2">
          <Panel defaultSize={60} minSize={20} maxSize={70}>
            <div className="h-full overflow-y-auto">
              {loading ? (
                <SkeletonQuestionHeader />
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
                  {loading ? <SkeletonAnswerCode /> : <AnswerCode code={code} />}
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-all duration-150 cursor-row-resize rounded" />

              <Panel defaultSize={40} minSize={10} maxSize={70}>
                <div className="h-full overflow-y-auto">
                  {loading ? <SkeletonNotesSection /> : <NotesSection notes={notes} />}
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

