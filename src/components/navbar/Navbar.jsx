"use client";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClasses = isScrolled
    ? "bg-white/95 border border-gray-200 backdrop-blur-md shadow-md w-[90%] md:w-[95%] lg:w-[1019px] h-[64px] px-4 md:px-5 lg:px-6"
    : "bg-transparent w-[92%] md:w-[96%] lg:w-[1080px] h-[80px] px-5 md:px-6 lg:px-8";

  const textSize = isScrolled ? "text-base" : "text-lg";
  const brandColor = isScrolled ? "text-gray-900" : "text-indigo-500";
  const linkColor = isScrolled
    ? "text-gray-700 hover:text-indigo-600"
    : "text-indigo-500 hover:text-indigo-700";

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out rounded-2xl ${navClasses}`}
    >
      <div className={`flex justify-between items-center h-full transition-all duration-300 ${textSize}`}>
        {/* Logo */}
        <a
          href="/"
          className={`font-semibold tracking-tight transition-colors duration-300 ${brandColor}`}
        >
          My NoteBook
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 font-medium">
          <a href="/" className={`transition-colors duration-300 ${linkColor}`}>
            Home
          </a>
          <a href="/about" className={`transition-colors duration-300 ${linkColor}`}>
            About
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden transition-all duration-300 ${
            isScrolled ? "text-gray-700" : "text-indigo-500"
          }`}
        >
          {menuOpen ? <X size={isScrolled ? 24 : 30} /> : <Menu size={isScrolled ? 24 : 30} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className={`md:hidden mt-2 rounded-xl transition-all duration-300 overflow-hidden bg-white shadow-md border border-gray-200 ${
            isScrolled ? "backdrop-blur-md" : "bg-white/80"
          }`}
        >
          <div className="flex flex-col items-start px-5 py-4 space-y-3 text-base">
            <a href="/" className="text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


