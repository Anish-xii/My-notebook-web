"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SearchBox from "@/components/search/SearchBox";

const HeroSection = () => {
  const heroRef = useRef();
  const bgRef = useRef();
  const overlayRef = useRef();
  const searchRef = useRef();
  const textRef = useRef();
  const subtextRef = useRef();
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = 50;
      const scrolled = window.scrollY > triggerPoint;

      if (scrolled && !scrolledPast) {
        setScrolledPast(true);

        // Background parallax effect
        gsap.to(bgRef.current, {
          y: -50,
          duration: 0.6,
          ease: "power2.out",
        });

        // Overlay dark fade
        gsap.to(overlayRef.current, {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (!scrolled && scrolledPast) {
        setScrolledPast(false);

        // Reset background position
        gsap.to(bgRef.current, {
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });

        // Remove overlay
        gsap.to(overlayRef.current, {
          backgroundColor: "rgba(0, 0, 0, 0)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolledPast]);

  return (
    <section
      ref={heroRef}
      className="relative h-[70vh] w-full bg-gradient-to-br from-blue-100 to-white text-gray-900 pt-24 overflow-hidden"
    >
      {/* Decorative Polka Dot BG */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#6366f1_2px,transparent_1px)] [background-size:20px_20px] z-0"
      />

      {/* Scroll-triggered dark overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/0 transition-colors duration-300 z-10 pointer-events-none"
      />

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        <h1
          ref={textRef}
          className="text-4xl md:text-6xl font-extrabold mb-4 transition-all duration-300"
        >
          Welcome to My DSA Notebook
        </h1>
        <p
          ref={subtextRef}
          className="text-base md:text-lg text-gray-700 max-w-xl mb-6"
        >
          Solved problems and notes — personal, but open to explore.
        </p>
        <div ref={searchRef} className="w-full max-w-md">
          <SearchBox />
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-white pointer-events-none z-20" />
    </section>
  );
};

export default HeroSection;
