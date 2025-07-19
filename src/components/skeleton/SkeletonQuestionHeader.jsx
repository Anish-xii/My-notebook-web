const SkeletonQuestionHeader = () => (
    <div className="w-full bg-white p-6 rounded-xl shadow-md animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-2/3" />
      <div className="flex gap-2 flex-wrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-5 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
  
  export default SkeletonQuestionHeader;
  