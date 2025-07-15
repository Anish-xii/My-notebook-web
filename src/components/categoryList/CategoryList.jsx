"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const categories = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Matrix",
  "Hash Table / Map",
  "Tree (Binary Tree, BST)",
  "DFS",
  "Backtracking",
  "Two Pointers",
  "Sorting",
  "DP", 
  "Divide and Conquer",
  "Greedy", 
  "Sliding Window", 
  "Binary Search", 
  "Graph", 
];

const CategoryList = ({ onCategorySelect, selectedCategory }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleHover = (hoveredIndex) => {
      const hoveredCard = cardRefs.current[hoveredIndex];
      if (!hoveredCard) return;

      const hoveredRect = hoveredCard.getBoundingClientRect();
      const hoveredX = hoveredRect.left + hoveredRect.width / 2;
      const hoveredY = hoveredRect.top + hoveredRect.height / 2;

      cardRefs.current.forEach((card, i) => {
        if (i === hoveredIndex || !card) return;

        const rect = card.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const dx = x - hoveredX;
        const dy = y - hoveredY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 250;

        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const offsetX = (dx / distance) * 20 * strength;
          const offsetY = (dy / distance) * 20 * strength;

          gsap.to(card, {
            x: offsetX,
            y: offsetY,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
    };

    const resetPositions = () => {
      cardRefs.current.forEach((card) => {
        if (card) {
          gsap.to(card, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          });
        }
      });
    };

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      card.addEventListener("mouseenter", () => handleHover(index));
      card.addEventListener("mouseleave", resetPositions);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.removeEventListener("mouseenter", () => handleHover(index));
        card.removeEventListener("mouseleave", resetPositions);
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap justify-center gap-4"
    >
      {categories.map((category, index) => (
        <div
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          onClick={() => onCategorySelect(category)}
          className={`category-card py-2 px-4 rounded-2xl text-center cursor-pointer shadow-md text-sm sm:text-base inline-flex transition-all font-medium ${
            selectedCategory === category
              ? "bg-blue-600 text-white scale-105"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
 