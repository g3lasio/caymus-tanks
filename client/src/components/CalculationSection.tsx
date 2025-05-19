import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TankData } from '@/data/tankData';
import { 
  CalculationMode, 
  CalculationResult, 
  SpaceToGallonsResult, 
  GallonsToSpaceResult 
} from '@/hooks/useTankCalculator';
import ResultDisplay from './ResultDisplay';

interface CalculationSectionProps {
  selectedTank: TankData | null;
  mode: CalculationMode;
  setMode: (mode: CalculationMode) => void;
  result: CalculationResult | null;
  onCalculate: (value: number) => void;
  onReset: () => void;
  isSpaceToGallons: (result: CalculationResult) => result is SpaceToGallonsResult;
  isGallonsToSpace: (result: CalculationResult) => result is GallonsToSpaceResult;
}

const CalculationSection = ({
  selectedTank,
  mode,
  setMode,
  result,
  onCalculate,
  onReset,
  isSpaceToGallons,
  isGallonsToSpace
}: CalculationSectionProps) => {
  const [inchesSpace, setInchesSpace] = useState<string>('');
  const [desiredGallons, setDesiredGallons] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSwitchTab = (newMode: CalculationMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleInchesSpaceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInchesSpace(e.target.value);
    setError(null);
  };

  const handleDesiredGallonsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDesiredGallons(e.target.value);
    setError(null);
  };

  const handleCalculate = () => {
    if (!selectedTank) {
      setError('Please select a tank first');
      return;
    }

    try {
      if (mode === 'spaceToGallons') {
        const spaceValue = parseFloat(inchesSpace);
        if (isNaN(spaceValue) || spaceValue < 0) {
          setError('Please enter a valid number of inches');
          return;
        }
        onCalculate(spaceValue);
      } else {
        const gallonsValue = parseFloat(desiredGallons);
        if (isNaN(gallonsValue) || gallonsValue < 0 || gallonsValue > selectedTank.TOTAL_GALS) {
          setError(`Please enter a valid number of gallons between 0 and ${selectedTank.TOTAL_GALS.toFixed(2)}`);
          return;
        }
        onCalculate(gallonsValue);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleReset = () => {
    setInchesSpace('');
    setDesiredGallons('');
    setError(null);
    onReset();
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-wine-700 mb-4 border-b border-wine-200 pb-2">Calculation</h2>
      
      {/* Calculation Type Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button 
          className={`py-2 px-4 font-medium ${mode === 'spaceToGallons' 
            ? 'text-wine-600 border-b-2 border-wine-600' 
            : 'text-gray-500'}`}
          onClick={() => handleSwitchTab('spaceToGallons')}
        >
          Space to Gallons
        </button>
        <button 
          className={`py-2 px-4 font-medium ${mode === 'gallonsToSpace' 
            ? 'text-wine-600 border-b-2 border-wine-600' 
            : 'text-gray-500'}`}
          onClick={() => handleSwitchTab('gallonsToSpace')}
        >
          Gallons to Space
        </button>
      </div>
      
      {/* Space to Gallons Form */}
      <div className={`mb-6 ${mode === 'spaceToGallons' ? '' : 'hidden'}`}>
        <div className="mb-4">
          <Label htmlFor="inchesSpace" className="block text-sm font-medium text-gray-700 mb-1">
            Inches of Space
          </Label>
          <div className="flex">
            <Input
              id="inchesSpace"
              type="number"
              value={inchesSpace}
              onChange={handleInchesSpaceChange}
              placeholder="Enter inches..."
              step="0.01"
              min="0"
              className="rounded-r-none"
            />
            <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 border border-l-0 border-gray-300 rounded-r-md">
              in
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the measurement of empty space from the top of the tank
          </p>
        </div>
      </div>
      
      {/* Gallons to Space Form */}
      <div className={`mb-6 ${mode === 'gallonsToSpace' ? '' : 'hidden'}`}>
        <div className="mb-4">
          <Label htmlFor="desiredGallons" className="block text-sm font-medium text-gray-700 mb-1">
            Desired Gallons
          </Label>
          <div className="flex">
            <Input
              id="desiredGallons"
              type="number"
              value={desiredGallons}
              onChange={handleDesiredGallonsChange}
              placeholder="Enter gallons..."
              step="0.01"
              min="0"
              max={selectedTank?.TOTAL_GALS || 0}
              className="rounded-r-none"
            />
            <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 border border-l-0 border-gray-300 rounded-r-md">
              gal
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the desired volume in gallons
          </p>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleCalculate}
          className="bg-wine-600 hover:bg-wine-700 text-white"
        >
          Calculate
        </Button>
        <Button 
          onClick={handleReset}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Reset
        </Button>
      </div>
      
      {/* Results Display */}
      {result && (
        <ResultDisplay 
          result={result} 
          mode={mode}
          isSpaceToGallons={isSpaceToGallons}
          isGallonsToSpace={isGallonsToSpace}
        />
      )}
    </div>
  );
};

export default CalculationSection;
