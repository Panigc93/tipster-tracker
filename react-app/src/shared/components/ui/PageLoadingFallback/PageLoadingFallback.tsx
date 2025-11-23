import { SkeletonText, SkeletonCard } from '../SkeletonLoader/SkeletonLoader';
import type { PageLoadingFallbackProps } from './PageLoadingFallback.types';

/**
 * Loading fallback for lazy-loaded pages
 * Provides a consistent loading state with skeleton loaders
 */
export function PageLoadingFallback({ message }: Readonly<PageLoadingFallbackProps>) {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="space-y-4">
          <SkeletonText width="16rem" height="2rem" />
          <SkeletonText width="24rem" height="1rem" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard height="8rem" />
          <SkeletonCard height="8rem" />
          <SkeletonCard height="8rem" />
          <SkeletonCard height="8rem" />
        </div>

        {/* Main content skeleton */}
        <SkeletonCard height="24rem" />

        {/* Optional message */}
        {message && (
          <p className="text-center text-slate-400 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}
