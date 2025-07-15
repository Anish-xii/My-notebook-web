"use client";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfaf3] text-[#3e3e3e] px-6 py-10 font-serif relative flex flex-col items-center justify-center text-center">
      
      {/* Top-Left Back Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <span
            className="text-xl md:text-2xl text-[#5e574c] hover:text-[#2c281e] italic"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            ← Back to Home
          </span>
        </Link>
      </div>

      {/* Heading */}
      <h1
        className="text-5xl md:text-6xl mb-10"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Hi, I am Anish
      </h1>

      {/* Description */}
      <p className="max-w-2xl text-lg md:text-xl leading-relaxed mb-16">
        Welcome to my DSA notebook — a place where I document the problems I’ve solved. This page is for me to search through my solutions quickly, revise anytime, anywhere, and avoid any noise. Only I can add or edit content here, but you&apos;re welcome to explore.
      </p>
      

      {/* Social Links */}
      <div className="flex gap-10">
        <a
          href="https://uk.linkedin.com/in/anish-biswas-0740aa2b1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#f1e4b3] px-5 py-3 rounded shadow hover:shadow-md hover:bg-[#f4e7be] transition"
        >
          <FaLinkedin className="text-blue-700 text-2xl" />
          <span className="font-medium text-base">LinkedIn</span>
        </a>

        <a
          href="https://github.com/Anish-xii"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#f1e4b3] px-5 py-3 rounded shadow hover:shadow-md hover:bg-[#f4e7be] transition"
        >
          <FaGithub className="text-gray-800 text-2xl" />
          <span className="font-medium text-base">GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default AboutPage;

