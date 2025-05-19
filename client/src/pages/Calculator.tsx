import { useState } from 'react';
import TankSelection from '@/components/TankSelection';
import CalculationSection from '@/components/CalculationSection';
import tankData, { TankData } from '@/data/tankData';
import { useTankCalculator } from '@/hooks/useTankCalculator';

const Calculator = () => {
  const [selectedTankId, setSelectedTankId] = useState<string>('');
  const [selectedTank, setSelectedTank] = useState<TankData | null>(null);
  const [fillPercentage, setFillPercentage] = useState<number>(50); // Default 50% fill
  
  const { 
    mode, 
    setMode, 
    result, 
    setResult, 
    calculate,
    isSpaceToGallons,
    isGallonsToSpace
  } = useTankCalculator();

  const handleSelectTank = (tankId: string) => {
    setSelectedTankId(tankId);
    setSelectedTank(tankData[tankId] || null);
    setResult(null); // Clear result when changing tank
  };

  const handleCalculate = (value: number) => {
    if (!selectedTank) return;
    
    const calculationResult = calculate(selectedTank, value);
    setResult(calculationResult);
    
    // Update fill percentage based on result
    if (isSpaceToGallons(calculationResult)) {
      setFillPercentage(calculationResult.fillPercentage);
    } else if (isGallonsToSpace(calculationResult)) {
      setFillPercentage(calculationResult.fillPercentage);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFillPercentage(50); // Reset to default 50% fill
  };

  return (
    <div className="min-h-screen flex flex-col bg-wine-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-wine-600 to-wine-800 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 
            className="text-3xl md:text-4xl font-serif font-bold text-white glitch-effect" 
            data-text="Caymus Calculator"
          >
            Caymus Calculator
          </h1>
          <div className="text-oak-100 text-sm md:text-base font-light">
            Wine Tank Calculator
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tank Selection Component */}
            <TankSelection 
              selectedTank={selectedTank} 
              selectedTankId={selectedTankId} 
              onSelectTank={handleSelectTank}
              fillPercentage={fillPercentage}
            />

            {/* Calculation Section Component */}
            <CalculationSection 
              selectedTank={selectedTank}
              mode={mode}
              setMode={setMode}
              result={result}
              onCalculate={handleCalculate}
              onReset={handleReset}
              isSpaceToGallons={isSpaceToGallons}
              isGallonsToSpace={isGallonsToSpace}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-wine-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Caymus Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
