const SkeletonNotesSection = () => (
    <div className="w-full bg-white p-4 rounded-xl shadow-md animate-pulse md:h-full md:overflow-y-auto space-y-4">
      <div className="h-5 bg-gray-300 rounded w-1/3" />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="aspect-video bg-gray-200 rounded-lg w-full" />
      ))}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
  
  export default SkeletonNotesSection;
  