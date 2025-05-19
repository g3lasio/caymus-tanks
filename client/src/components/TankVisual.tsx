import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TankVisualProps {
  fillPercentage: number;
  showLabels?: boolean;
  gallonsTotal?: number;
  gallonsRemaining?: number;
}

const TankVisual = ({ 
  fillPercentage, 
  showLabels = true, 
  gallonsTotal,
  gallonsRemaining
}: TankVisualProps) => {
  const tankRef = useRef<HTMLDivElement>(null);
  const boundedFillPercentage = Math.min(Math.max(fillPercentage, 0), 100);

  useEffect(() => {
    // Update tank fill visual
    if (tankRef.current) {
      tankRef.current.style.setProperty('--fill-height', `${boundedFillPercentage}%`);
    }
  }, [boundedFillPercentage]);

  const formatNumber = (num?: number): string => {
    if (num === undefined) return "0";
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div 
        ref={tankRef}
        className="w-full h-64 border-2 border-accent/50 rounded-lg tank-fill mx-auto mb-2 overflow-hidden relative bg-black/20 backdrop-blur-sm" 
        style={{ '--fill-height': `${boundedFillPercentage}%` } as React.CSSProperties}
      >
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: 'linear-gradient(to right, rgba(30, 144, 255, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 144, 255, 0.5) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>
        
        <div className="h-full flex flex-col justify-between p-4 relative z-10">
          <div className="text-center font-mono text-blue-300 text-xs tracking-wider flex flex-col items-center">
            {showLabels && (
              <>
                <span className="text-accent mb-1">ESPACIO</span>
                <div className="px-2 py-1 bg-secondary/40 rounded-sm border border-accent/20 w-16 text-center">
                  {(100 - boundedFillPercentage).toFixed(1)}%
                </div>
              </>
            )}
          </div>
          
          <div className="text-center text-white font-mono font-bold z-10 text-lg shadow-sm bg-secondary/50 rounded-md border border-accent/20 py-2 px-3">
            <span className="text-accent mr-1">LLENO</span> {boundedFillPercentage.toFixed(1)}%
          </div>
        </div>
        
        {/* Digital measurement lines */}
        <div className="absolute left-0 h-full w-5 flex flex-col justify-between py-2 opacity-70">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="h-px w-3 bg-accent"></div>
              <div className="text-accent font-mono text-[8px]">{100 - i * 25}</div>
            </div>
          ))}
        </div>
        
        {/* Wine tank icon */}
        <div className="absolute top-2 right-2 text-accent/40">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10v12h-3M4 22h3V10M14 22H10M12 2v7M12 9L4 10M12 9l8 1M7 2h10" 
                  stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Additional data display */}
      {(gallonsTotal !== undefined || gallonsRemaining !== undefined) && (
        <div className="grid grid-cols-2 gap-2 text-sm mt-1">
          {gallonsTotal !== undefined && (
            <div className="flex justify-between items-center p-1 bg-secondary/30 rounded border border-accent/20">
              <span className="text-blue-300 font-mono text-xs">TOTAL:</span>
              <span className="font-mono text-white">{formatNumber(gallonsTotal)}</span>
            </div>
          )}
          {gallonsRemaining !== undefined && (
            <div className="flex justify-between items-center p-1 bg-secondary/30 rounded border border-accent/20">
              <span className="text-blue-300 font-mono text-xs">RESTANTE:</span>
              <span className="font-mono text-white">{formatNumber(gallonsRemaining)}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TankVisual;
