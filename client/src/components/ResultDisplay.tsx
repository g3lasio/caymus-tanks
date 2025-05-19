import { 
  CalculationMode, 
  CalculationResult, 
  SpaceToGallonsResult, 
  GallonsToSpaceResult 
} from '@/hooks/useTankCalculator';

interface ResultDisplayProps {
  result: CalculationResult;
  mode: CalculationMode;
  isSpaceToGallons: (result: CalculationResult) => result is SpaceToGallonsResult;
  isGallonsToSpace: (result: CalculationResult) => result is GallonsToSpaceResult;
}

const ResultDisplay = ({ 
  result, 
  mode,
  isSpaceToGallons,
  isGallonsToSpace
}: ResultDisplayProps) => {
  // Format number to include commas and fixed decimal places
  const formatNumber = (num: number): string => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="mt-6 p-4 bg-vineyard-50 rounded-lg border border-vineyard-200">
      <h3 className="text-lg font-semibold text-vineyard-800 mb-2">Result</h3>
      
      {isSpaceToGallons(result) && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-gray-600">Gallons in Main Body:</p>
            <p className="font-medium text-lg">{formatNumber(result.mainBodyGallons)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gallons in Top Section:</p>
            <p className="font-medium text-lg">{formatNumber(result.topSectionGallons)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Total Gallons in Tank:</p>
            <p className="font-bold text-xl text-vineyard-700">{formatNumber(result.totalGallons)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Remaining Gallons:</p>
            <p className="font-bold text-xl text-wine-700">{formatNumber(result.remainingGallons)}</p>
          </div>
        </div>
      )}
      
      {isGallonsToSpace(result) && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Required Inches of Space:</p>
            <p className="font-bold text-xl text-wine-700">{formatNumber(result.requiredSpace)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Inches in Main Body:</p>
            <p className="font-medium text-lg">{formatNumber(result.mainBodyInches)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Inches in Top Section:</p>
            <p className="font-medium text-lg">{formatNumber(result.topSectionInches)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
