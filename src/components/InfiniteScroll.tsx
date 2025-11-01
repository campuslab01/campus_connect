import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  fetchNext: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children?: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ 
  fetchNext, 
  hasMore, 
  isLoading,
  children 
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchNext();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNext, hasMore, isLoading]);

  return (
    <>
      {children}
      <div ref={loadMoreRef} className="py-4 text-center min-h-[20px]">
        {isLoading && hasMore && (
          <div className="animate-spin rounded-full h-6 w-6 mx-auto border-2 border-pink-500 border-t-transparent"></div>
        )}
        {!hasMore && (
          <p className="text-white/50 text-sm">No more items to load</p>
        )}
      </div>
    </>
  );
};

