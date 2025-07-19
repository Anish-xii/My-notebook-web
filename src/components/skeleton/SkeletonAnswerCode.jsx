const SkeletonAnswerCode = () => (
    <div className="w-full bg-white p-4 rounded-xl shadow-md animate-pulse space-y-4 md:h-full flex flex-col">
      <div className="flex justify-end">
        <div className="h-6 w-24 bg-gray-200 rounded-md" />
      </div>
      <div className="flex-1 space-y-2 overflow-auto">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </div>
  );
  
  export default SkeletonAnswerCode;
  