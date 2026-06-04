interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded-full w-3/4" />
            <div className="h-4 bg-gray-100 rounded-full w-1/2" />
            <div className="h-6 bg-gray-100 rounded-full w-1/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
