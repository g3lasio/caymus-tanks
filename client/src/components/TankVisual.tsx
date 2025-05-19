import { useEffect, useRef } from 'react';

interface TankVisualProps {
  fillPercentage: number;
}

const TankVisual = ({ fillPercentage }: TankVisualProps) => {
  const tankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update tank fill visual
    if (tankRef.current) {
      const boundedFillPercentage = Math.min(Math.max(fillPercentage, 0), 100);
      tankRef.current.style.setProperty('--fill-height', `${boundedFillPercentage}%`);
    }
  }, [fillPercentage]);

  return (
    <div 
      ref={tankRef}
      className="w-full h-64 border-2 border-oak-400 rounded-lg tank-fill mx-auto mb-4" 
      style={{ '--fill-height': `${Math.min(Math.max(fillPercentage, 0), 100)}%` } as React.CSSProperties}
    >
      <div className="h-full flex flex-col justify-between p-4">
        <div className="text-center text-oak-700 text-sm">Empty Space</div>
        <div className="text-center text-white font-bold z-10">
          {fillPercentage.toFixed(1)}% Full
        </div>
      </div>
    </div>
  );
};

export default TankVisual;
