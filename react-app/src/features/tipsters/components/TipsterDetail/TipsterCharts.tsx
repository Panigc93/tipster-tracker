import { lazy, Suspense } from 'react';
import { SkeletonCard } from '@/shared/components';
import type { Pick, UserFollow } from '@/shared/types';

const OddsDistributionChart = lazy(() => 
  import('@/shared/components/charts/OddsDistributionChart').then(m => ({ default: m.OddsDistributionChart }))
);
const StakeDistributionChart = lazy(() => 
  import('@/shared/components/charts/StakeDistributionChart').then(m => ({ default: m.StakeDistributionChart }))
);
const SportDistributionChart = lazy(() => 
  import('@/shared/components/charts/SportDistributionChart').then(m => ({ default: m.SportDistributionChart }))
);
const PickTypeDistributionChart = lazy(() => 
  import('@/shared/components/charts/PickTypeDistributionChart').then(m => ({ default: m.PickTypeDistributionChart }))
);

interface TipsterChartsProps {
  picks?: Pick[];
  follows?: UserFollow[];
  title?: string;
}

export function TipsterCharts({ picks, follows, title = 'Distribuciones' }: TipsterChartsProps) {
  // Determine if we are showing picks or follows
  const dataProps = follows ? { follows } : { picks };
  
  // If showing follows, we need picks for Sport and Type charts
  // This logic was in the original file, but here we might need to pass the related picks for follows
  // However, the original code passed `picks` (the array of all picks) to Sport/Type charts even for follows section?
  // Let's check the original code.
  // Original code for follows section:
  // <SportDistributionChart picks={followedPicks} ... />
  // So for follows, we should pass the resolved picks corresponding to the follows.
  // But the component signature for SportDistributionChart takes `picks`.
  // Let's adjust the props of this component to accept `picks` always for Sport/Type, 
  // and `follows` optionally for Odds/Stake if we want to show user stats.
  
  // Actually, to keep it simple and flexible:
  // If `follows` is provided, we use it for Odds/Stake.
  // For Sport/Type, we need `picks`. If we are in "follows" mode, the parent should pass the *followed* picks as `picks`.
  // If we are in "tipster" mode, the parent passes all `picks`.
  
  // Wait, the original code for follows section:
  // <OddsDistributionChart follows={tipsterFollows} ... />
  // <StakeDistributionChart follows={tipsterFollows} ... />
  // <SportDistributionChart picks={followedPicks} ... />
  // <PickTypeDistributionChart picks={followedPicks} ... />
  
  // So `Odds` and `Stake` charts can take `follows`. `Sport` and `Type` take `picks`.
  
  return (
    <div className={picks && !follows ? "bg-slate-800 rounded-lg" : ""}>
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <SkeletonCard height="180px" />
          <SkeletonCard height="180px" />
          <SkeletonCard height="180px" />
          <SkeletonCard height="180px" />
        </div>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <OddsDistributionChart {...dataProps} height={180} title={follows ? "Tus Cuotas" : undefined} />
          <StakeDistributionChart {...dataProps} height={180} title={follows ? "Tus Stakes" : undefined} />
          {picks && (
            <>
              <SportDistributionChart picks={picks} height={140} title={follows ? "Deportes Seguidos" : undefined} />
              <PickTypeDistributionChart picks={picks} height={140} title={follows ? "Tipos de Pick Seguidos" : undefined} />
            </>
          )}
        </div>
      </Suspense>
    </div>
  );
}
