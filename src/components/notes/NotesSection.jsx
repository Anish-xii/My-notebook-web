import React from "react";

const YOUTUBE_REGEX =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/g;

const NotesSection = ({ notes }) => {
  // Split notes by line and parse each line
  const parsedLines = notes.split("\n").map((line, index) => {
    const match = line.match(YOUTUBE_REGEX);

    if (match) {
      // Extract video ID from the first match
      const videoId = match[0].includes("youtu.be")
        ? match[0].split("youtu.be/")[1]
        : new URL(match[0]).searchParams.get("v");

      if (videoId) {
        return (
          <div key={index} className="my-4">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        );
      }
    }

    // Fallback: render plain text with preserved whitespace
    return (
      <p key={index} className="text-sm text-gray-700 whitespace-pre-wrap">
        {line}
      </p>
    );
  });

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md md:h-full md:overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Explanation / Notes</h3>
      {parsedLines}
      <div className="h-12 md:hidden" />
    </div>
  );
};

export default NotesSection;
