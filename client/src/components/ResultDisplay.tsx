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
      <h3 className="text-lg font-semibold text-vineyard-800 mb-2">Resultado</h3>
      
      {isSpaceToGallons(result) && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total de galones en el tanque:</p>
            <p className="font-bold text-xl text-vineyard-700">{formatNumber(result.totalGallons)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Espacio disponible para más vino:</p>
            <p className="font-bold text-xl text-wine-700">{formatNumber(result.remainingGallons)} galones</p>
          </div>
        </div>
      )}
      
      {isGallonsToSpace(result) && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total de galones en el tanque:</p>
            <p className="font-bold text-xl text-vineyard-700">{formatNumber(result.fillPercentage / 100 * (result as any).tankTotalGallons || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Espacio requerido (en pulgadas):</p>
            <p className="font-bold text-xl text-wine-700">{formatNumber(result.requiredSpace)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
