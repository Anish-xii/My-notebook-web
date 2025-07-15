import React from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const AnswerCode = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md flex flex-col md:h-full">
      <div className="flex justify-end mb-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-600" />
              <span className="text-green-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} className="text-gray-600" />
              <span className="text-gray-800">Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="rounded-lg overflow-auto flex-1">
        <SyntaxHighlighter
          language="python"
          style={oneDark}
          customStyle={{
            padding: "1rem",
            margin: 0,
            minHeight: "100%",
            width: "100%",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
            boxSizing: "border-box",
          }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default AnswerCode;
