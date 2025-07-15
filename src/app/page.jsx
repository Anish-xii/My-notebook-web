"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSearchParams, useRouter } from "next/navigation";

import HeroSection from "@/components/hero/HeroSection";
import Navbar from "@/components/navbar/Navbar";
import CategoryList from "@/components/categoryList/CategoryList";
import ProgCard from "@/components/progcard/ProgCard";
import CardList from "@/components/cardlist/CardList";

export default function Home() {
  const catRef = useRef();
  const questionSectionRef = useRef();
  const backButtonRef = useRef();

  const [showFloating, setShowFloating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchMode, setSearchMode] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle category from query param
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
  
      // Trigger same animation as selecting category manually
      gsap.to(catRef.current, {
        y: -40,
        opacity: 0,
        scale: 0.95,
        pointerEvents: "none",
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          setSearchMode(true);
  
          gsap.fromTo(
            questionSectionRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power1.out" }
          );
          
          
  
          gsap.fromTo(
            backButtonRef.current,
            { y: -10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.3 }
          );
  
          setTimeout(() => {
            questionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        },
      });
    }
  }, [searchParams]);
  

  // Animate when a category is selected
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    router.push(`/?category=${category}`, { scroll: false });

    gsap.to(catRef.current, {
      y: -40,
      opacity: 0,
      scale: 0.95,
      pointerEvents: "none",
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        setSearchMode(true);

        // Animate question section in
        gsap.fromTo(
          questionSectionRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );

        // Animate back button
        gsap.fromTo(
          backButtonRef.current,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.3 }
        );

        // Scroll to question section
        setTimeout(() => {
          questionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      },
    });
  };

  const handleBack = () => {
    gsap.to(backButtonRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.inOut",
    });

    setSearchMode(false);
    setSelectedCategory(null);
    router.push("/", { scroll: false });

    gsap.fromTo(
      catRef.current,
      { y: -40, opacity: 0, scale: 0.95, pointerEvents: "none" },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        pointerEvents: "auto",
        duration: 0.6,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      questionSectionRef.current,
      { y: 10, opacity: 0.95 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.1,
      }
    );

    setTimeout(() => {
      catRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Mobile progress bar trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloating(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (questionSectionRef.current) observer.observe(questionSectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />

      {!searchMode && (
        <section
          ref={catRef}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Popular Categories</h2>
          <p className="text-gray-600 mb-6">Explore questions by category</p>
          <CategoryList
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </section>
      )}

      <section
        ref={questionSectionRef}
        className="transition-opacity duration-300 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white"
        style={{ opacity: 1 }}
      >
        {searchMode && (
          <div
            ref={backButtonRef}
            className="mb-6 flex items-center gap-2 cursor-pointer text-blue-600 hover:underline transition-opacity"
            onClick={handleBack}
          >
            ← Back to Categories
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-4/5 w-full">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
            {searchMode ? `Questions on ${selectedCategory}` : "Favourite Questions"}
            </h2>
            <CardList filterTag={selectedCategory} />
          </div>

          <div className="lg:w-1/5 w-full hidden lg:block">
            <ProgCard />
          </div>
        </div>
      </section>

      {showFloating && (
        <div className="block lg:hidden">
          <ProgCard showCompact totalSolved={185} />
        </div>
      )}
    </>
  );
}
