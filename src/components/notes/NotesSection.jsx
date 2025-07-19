import React from "react";

const YOUTUBE_REGEX =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/g;

const NotesSection = ({ notes }) => {
  const parsedLines = notes.split("\n").map((line, index) => {
    const match = line.match(YOUTUBE_REGEX);

    if (match) {
      const url = match[0];
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]
        : new URL(url).searchParams.get("v");

      if (videoId) {
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        return (
          <div key={index} className="my-4">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full aspect-video rounded-lg overflow-hidden group"
            >
              <img
                src={thumbnail}
                alt="YouTube video thumbnail"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="opacity-90 group-hover:opacity-100"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </a>
          </div>
        );
      }
    }

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
