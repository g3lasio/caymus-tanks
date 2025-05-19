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
        className="w-full h-64 border-2 border-oak-400 rounded-lg tank-fill mx-auto mb-2 overflow-hidden relative" 
        style={{ '--fill-height': `${boundedFillPercentage}%` } as React.CSSProperties}
      >
        <div className="h-full flex flex-col justify-between p-4">
          <div className="text-center text-oak-700 text-sm">
            {showLabels && "Espacio Vacío"}
          </div>
          <div className="text-center text-white font-bold z-10 text-lg shadow-sm">
            {boundedFillPercentage.toFixed(1)}% Lleno
          </div>
        </div>
        
        {/* Wine bottle decoration */}
        <div className="absolute bottom-1 right-1 opacity-20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 14 5 14 8C14 10 13 11 12.5 13C12 15 12 19 12 19M12 2C12 2 10 5 10 8C10 10 11 11 11.5 13C12 15 12 19 12 19M12 19C9 19 7 17.5 7 15.5C7 13.5 8 12 9.5 9.5C11 7 9 4 9 4M12 19C15 19 17 17.5 17 15.5C17 13.5 16 12 14.5 9.5C13 7 15 4 15 4" 
                  stroke="#8A3541" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Additional data display */}
      {(gallonsTotal !== undefined || gallonsRemaining !== undefined) && (
        <div className="grid grid-cols-2 gap-2 text-sm mt-1">
          {gallonsTotal !== undefined && (
            <div className="flex justify-between items-center p-1 bg-vineyard-50 rounded border border-vineyard-200">
              <span className="text-vineyard-800">Total:</span>
              <span className="font-medium text-vineyard-700">{formatNumber(gallonsTotal)} gal</span>
            </div>
          )}
          {gallonsRemaining !== undefined && (
            <div className="flex justify-between items-center p-1 bg-wine-50 rounded border border-wine-200">
              <span className="text-wine-800">Restante:</span>
              <span className="font-medium text-wine-700">{formatNumber(gallonsRemaining)} gal</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TankVisual;
