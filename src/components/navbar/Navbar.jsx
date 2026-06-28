"use client";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Scroll listener
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("🔒 Navbar Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("🔒 Navbar Logout Error:", error);
    }
  };

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

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 font-medium items-center">
          <a href="/" className={`transition-colors duration-300 ${linkColor}`}>
            Home
          </a>
          <a href="/about" className={`transition-colors duration-300 ${linkColor}`}>
            About
          </a>
          
          {/* Desktop Auth Links */}
          {user ? (
            <>
              <a href="/lgnwrt" className={`transition-colors duration-300 ${linkColor}`}>
                Add New
              </a>
              <button
                onClick={handleLogout}
                className={`transition-colors duration-300 ${linkColor}`}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className={`px-4 py-1.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-sm`}
            >
              Login
            </button>
          )}
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
            <a href="/" className="text-gray-700 hover:text-indigo-600 w-full text-left" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600 w-full text-left" onClick={() => setMenuOpen(false)}>
              About
            </a>
            
            {/* Mobile Auth Links */}
            <hr className="w-full border-gray-200" />
            {user ? (
              <>
                <a 
                  href="/lgnwrt" 
                  className="text-gray-700 hover:text-indigo-600 w-full text-left" 
                  onClick={() => setMenuOpen(false)}
                >
                  Add New
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-indigo-600 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setMenuOpen(false);
                }}
                className="text-indigo-600 font-medium hover:text-indigo-700 w-full text-left"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

