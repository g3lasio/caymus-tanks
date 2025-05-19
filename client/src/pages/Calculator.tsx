import { useState } from 'react';
import tankData, { TankData } from '@/data/tankData';
import { useTankCalculator } from '@/hooks/useTankCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TankVisual from '@/components/TankVisual';

const Calculator = () => {
  const [selectedTankId, setSelectedTankId] = useState<string>('');
  const [selectedTank, setSelectedTank] = useState<TankData | null>(null);
  const [fillPercentage, setFillPercentage] = useState<number>(50); // Default 50% fill
  const [inchesSpace, setInchesSpace] = useState<string>('');
  const [desiredGallons, setDesiredGallons] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const { 
    mode, 
    setMode, 
    result, 
    setResult, 
    calculate,
    isSpaceToGallons,
    isGallonsToSpace
  } = useTankCalculator();

  // Format number with commas and fixed decimal places
  const formatNumber = (num: number): string => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSelectTank = (tankId: string) => {
    setSelectedTankId(tankId);
    setSelectedTank(tankData[tankId] || null);
    setResult(null); // Clear result when changing tank
    setError(null);
  };

  const handleCalculate = () => {
    if (!selectedTank) {
      setError('Por favor selecciona un tanque primero');
      return;
    }

    try {
      if (mode === 'spaceToGallons') {
        const spaceValue = parseFloat(inchesSpace);
        if (isNaN(spaceValue) || spaceValue < 0) {
          setError('Por favor ingresa un número válido de pulgadas');
          return;
        }
        const calculationResult = calculate(selectedTank, spaceValue);
        setResult(calculationResult);
        
        if (isSpaceToGallons(calculationResult)) {
          setFillPercentage(calculationResult.fillPercentage);
        }
      } else {
        const gallonsValue = parseFloat(desiredGallons);
        if (isNaN(gallonsValue) || gallonsValue < 0 || gallonsValue > selectedTank.TOTAL_GALS) {
          setError(`Por favor ingresa un número válido de galones entre 0 y ${selectedTank.TOTAL_GALS.toFixed(2)}`);
          return;
        }
        const calculationResult = calculate(selectedTank, gallonsValue);
        setResult(calculationResult);
        
        if (isGallonsToSpace(calculationResult)) {
          setFillPercentage(calculationResult.fillPercentage);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleReset = () => {
    setInchesSpace('');
    setDesiredGallons('');
    setResult(null);
    setFillPercentage(50);
    setError(null);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as 'spaceToGallons' | 'gallonsToSpace');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-wine-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-wine-600 to-wine-800 py-3 shadow-md">
        <div className="container mx-auto px-3 flex flex-col sm:flex-row justify-between items-center">
          <h1 
            className="text-2xl md:text-3xl font-serif font-bold text-white glitch-effect text-center sm:text-left mb-1 sm:mb-0" 
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
      <main className="container mx-auto px-3 py-4 flex-grow">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-2xl mx-auto">
          {/* Tank Selection */}
          <div className="mb-4">
            <h2 className="text-xl font-serif text-wine-700 mb-3 border-b border-wine-200 pb-2">
              Selección de Tanque
            </h2>
            <Select value={selectedTankId} onValueChange={handleSelectTank}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="-- Selecciona un Tanque --" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Object.keys(tankData).map((tankId) => (
                  <SelectItem key={tankId} value={tankId}>
                    {tankId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tank Visualization & Specifications */}
          {selectedTank && (
            <div className="mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-oak-50 rounded-lg border border-oak-200 mb-3">
                  <h3 className="text-lg font-semibold text-oak-800 mb-2">Especificaciones</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Galones/Pulgada:</span>
                      <span className="font-medium">{selectedTank.GALS_PER_INCH.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Galones en Tope:</span>
                      <span className="font-medium">{selectedTank.GALS_IN_TOP.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pulgadas en Tope:</span>
                      <span className="font-medium">{selectedTank.TOP_INCHES.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Galones Totales:</span>
                      <span className="font-medium">{selectedTank.TOTAL_GALS.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <TankVisual fillPercentage={fillPercentage} />
              </div>
            </div>
          )}
          
          {/* Calculation Tabs */}
          <div className="mb-4">
            <Tabs 
              defaultValue="spaceToGallons" 
              value={mode}
              onValueChange={handleModeChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="spaceToGallons">Espacio → Galones</TabsTrigger>
                <TabsTrigger value="gallonsToSpace">Galones → Espacio</TabsTrigger>
              </TabsList>
              
              {/* Space to Gallons Content */}
              <TabsContent value="spaceToGallons" className="mt-4">
                <div className="mb-4">
                  <Label htmlFor="inchesSpace" className="block text-sm font-medium text-gray-700 mb-1">
                    Pulgadas de Espacio
                  </Label>
                  <div className="flex">
                    <Input
                      id="inchesSpace"
                      type="number"
                      value={inchesSpace}
                      onChange={(e) => setInchesSpace(e.target.value)}
                      placeholder="Ingrese pulgadas..."
                      step="0.01"
                      min="0"
                      className="rounded-r-none"
                    />
                    <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 border border-l-0 border-gray-300 rounded-r-md">
                      in
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Ingrese la medida de espacio vacío desde la parte superior del tanque
                  </p>
                </div>
              </TabsContent>
              
              {/* Gallons to Space Content */}
              <TabsContent value="gallonsToSpace" className="mt-4">
                <div className="mb-4">
                  <Label htmlFor="desiredGallons" className="block text-sm font-medium text-gray-700 mb-1">
                    Galones Deseados
                  </Label>
                  <div className="flex">
                    <Input
                      id="desiredGallons"
                      type="number"
                      value={desiredGallons}
                      onChange={(e) => setDesiredGallons(e.target.value)}
                      placeholder="Ingrese galones..."
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
                    Ingrese el volumen deseado en galones
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 border border-red-200 rounded">
              {error}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              onClick={handleCalculate}
              className="bg-wine-600 hover:bg-wine-700 text-white"
            >
              Calcular
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Resetear
            </Button>
          </div>
          
          {/* Results Display */}
          {result && (
            <div className="mt-4 p-4 bg-vineyard-50 rounded-lg border border-vineyard-200">
              <h3 className="text-lg font-semibold text-vineyard-800 mb-2">Resultado</h3>
              
              {isSpaceToGallons(result) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Galones en Cuerpo Principal:</p>
                    <p className="font-medium text-lg">{formatNumber(result.mainBodyGallons)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Galones en Sección Superior:</p>
                    <p className="font-medium text-lg">{formatNumber(result.topSectionGallons)}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-sm text-gray-600">Galones Totales en Tanque:</p>
                    <p className="font-bold text-xl text-vineyard-700">{formatNumber(result.totalGallons)}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-sm text-gray-600">Galones Restantes:</p>
                    <p className="font-bold text-xl text-wine-700">{formatNumber(result.remainingGallons)}</p>
                  </div>
                </div>
              )}
              
              {isGallonsToSpace(result) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-sm text-gray-600">Pulgadas de Espacio Requeridas:</p>
                    <p className="font-bold text-xl text-wine-700">{formatNumber(result.requiredSpace)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pulgadas en Cuerpo Principal:</p>
                    <p className="font-medium text-lg">{formatNumber(result.mainBodyInches)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pulgadas en Sección Superior:</p>
                    <p className="font-medium text-lg">{formatNumber(result.topSectionInches)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-wine-800 text-white py-3 mt-auto">
        <div className="container mx-auto px-3 text-center">
          <p>&copy; {new Date().getFullYear()} Caymus Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
