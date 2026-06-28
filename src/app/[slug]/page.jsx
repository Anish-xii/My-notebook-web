"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { db, auth } from "@/lib/firebase"; 
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; 
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { ArrowLeft, Edit2, Trash2, X } from "lucide-react"; 

import QuestionHeader from "@/components/question/QuestionHeader";
import AnswerCode from "@/components/answer/AnswerCode";
import NotesSection from "@/components/notes/NotesSection";

import SkeletonQuestionHeader from "@/components/skeleton/SkeletonQuestionHeader";
import SkeletonAnswerCode from "@/components/skeleton/SkeletonAnswerCode";
import SkeletonNotesSection from "@/components/skeleton/SkeletonNotesSection";

const allowedEmail = process.env.NEXT_PUBLIC_ALLOWED_EMAIL;

const QuestionPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCategory = searchParams.get("category");

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false); 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === allowedEmail) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    });
    return () => unsubscribe(); 
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

  const handleEditClick = () => {
    router.push(`/edit/${slug}`);
  };

  const handleDeleteConfirm = async () => {
    if (deleteInput !== slug) return; 
    
    setIsDeleting(true);
    try {
      // Find the document ID by querying the slug
      const q = query(collection(db, "questions"), where("slug", "==", slug));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        
        // Delete from Firestore
        await deleteDoc(doc(db, "questions", docId));
        
        // Clear it from session storage so it doesn't render again
        sessionStorage.removeItem(`question-${slug}`);
        
        // Push user back to safety
        handleBackClick();
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      setIsDeleting(false);
    }
  };

  const { title, description, tags, code, notes } = questionData || {};

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100 flex flex-col relative">
      
      {/* Delete Verification Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <Trash2 size={20} />
                Delete Question
              </h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete this question and remove all associated data.
            </p>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                Please type <strong>{slug}</strong> to verify.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder={slug}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                autoComplete="off"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteInput !== slug || isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar with Back, Edit, and Delete Buttons */}
      <div className="flex justify-between items-center w-full px-4 pt-4 shrink-0">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {isVerified && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all"
            >
              <Edit2 size={16} />
              Edit
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* 📱 Mobile View */}
      <div className="md:hidden pt-4 px-4 pb-4 h-full overflow-y-auto space-y-4">
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
      <div className="hidden md:flex flex-1 pt-4 px-4 pb-4 gap-2 min-h-0">
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
