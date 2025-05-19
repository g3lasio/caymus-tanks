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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-indigo-800 py-3 shadow-md">
        <div className="container mx-auto px-3 flex flex-col sm:flex-row justify-between items-center">
          <h1 
            className="text-2xl md:text-3xl font-mono font-bold text-white glitch-effect text-center sm:text-left mb-1 sm:mb-0" 
            data-text="Caymus Calculator"
          >
            <span className="text-accent">C</span>aymus <span className="text-accent">C</span>alculator
          </h1>
          <div className="text-blue-100 text-sm md:text-base font-light tracking-wider">
            <span className="bg-secondary px-2 py-1 rounded">WINE TANK MATRIX</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 py-4 flex-grow">
        <div className="bg-card rounded-lg shadow-2xl border border-accent/20 p-4 sm:p-6 max-w-2xl mx-auto backdrop-blur-sm">
          {/* Tank Selection */}
          <div className="mb-4">
            <h2 className="text-xl font-mono text-accent mb-3 border-b border-accent/30 pb-2 flex items-center">
              <span className="inline-block w-3 h-3 bg-accent mr-2 rounded-full animate-pulse"></span>
              Selección de Tanque
            </h2>
            
            {/* Search Tank Input */}
            <div className="mb-3">
              <Label htmlFor="searchTank" className="block text-sm font-medium text-blue-300 mb-1">
                Buscar Tanque
              </Label>
              <div className="relative">
                <Input
                  id="searchTank"
                  type="text"
                  value={selectedTankId}
                  onChange={(e) => {
                    const searchValue = e.target.value.toUpperCase();
                    setSelectedTankId(searchValue);
                    
                    // Check if the search matches any tank ID
                    if (Object.keys(tankData).includes(searchValue)) {
                      setSelectedTank(tankData[searchValue]);
                      setResult(null);
                      setError(null);
                    } else {
                      setSelectedTank(null);
                    }
                  }}
                  placeholder="Escribe el ID del tanque..."
                  className={`bg-card border-accent/30 text-foreground focus:border-accent/70 ${!selectedTank && selectedTankId ? 'border-red-500' : ''}`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>
            
            {/* Dropdown Select */}
            <Select value={selectedTankId} onValueChange={handleSelectTank}>
              <SelectTrigger className="w-full mb-2 bg-card border-accent/30 focus:ring-accent/50">
                <SelectValue placeholder="-- Selecciona un Tanque --" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-card border-accent/30">
                {Object.keys(tankData).map((tankId) => (
                  <SelectItem key={tankId} value={tankId} className="text-foreground hover:bg-accent/20">
                    {tankId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Feedback when no tank is found */}
            {selectedTankId && !selectedTank && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                No se encontró ningún tanque con ID "{selectedTankId}"
              </p>
            )}
          </div>
          
          {/* Tank Specifications */}
          {selectedTank && (
            <div className="mb-4">
              <div className="p-3 bg-secondary/30 rounded-lg border border-accent/20 backdrop-blur-sm">
                <h3 className="text-lg font-mono text-accent mb-2 flex items-center">
                  <span className="text-xs mr-2 bg-accent/20 px-2 py-0.5 rounded">[SPEC]</span>
                  Especificaciones
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between p-1 border-b border-accent/10">
                    <span className="text-blue-300">Galones/Pulgada:</span>
                    <span className="font-mono text-white">{selectedTank.GALS_PER_INCH.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-1 border-b border-accent/10">
                    <span className="text-blue-300">Galones en Tope:</span>
                    <span className="font-mono text-white">{selectedTank.GALS_IN_TOP.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-1 border-b border-accent/10">
                    <span className="text-blue-300">Pulgadas en Tope:</span>
                    <span className="font-mono text-white">{selectedTank.TOP_INCHES.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-1 border-b border-accent/10">
                    <span className="text-blue-300">Galones Totales:</span>
                    <span className="font-mono text-white">{selectedTank.TOTAL_GALS.toFixed(2)}</span>
                  </div>
                </div>
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
              <TabsList className="grid w-full grid-cols-2 bg-secondary/40 border border-accent/20">
                <TabsTrigger value="spaceToGallons" className="data-[state=active]:bg-accent data-[state=active]:text-black">
                  <span className="mr-1">⇣</span> Espacio → Galones
                </TabsTrigger>
                <TabsTrigger value="gallonsToSpace" className="data-[state=active]:bg-accent data-[state=active]:text-black">
                  <span className="mr-1">⇡</span> Galones → Espacio
                </TabsTrigger>
              </TabsList>
              
              {/* Space to Gallons Content */}
              <TabsContent value="spaceToGallons" className="mt-4 p-3 border border-accent/20 rounded-md bg-secondary/20">
                <div className="mb-4">
                  <Label htmlFor="inchesSpace" className="block text-sm font-medium text-blue-300 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M2 12h10"/><path d="m9 7 5 5-5 5"/><path d="M22 12H12"/></svg>
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
                      className="rounded-r-none bg-card border-accent/30 focus:border-accent"
                    />
                    <span className="inline-flex items-center px-3 bg-secondary text-accent font-mono border border-l-0 border-accent/30 rounded-r-md">
                      in
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/70 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Ingrese la medida de espacio vacío desde la parte superior del tanque
                  </p>
                </div>
              </TabsContent>
              
              {/* Gallons to Space Content */}
              <TabsContent value="gallonsToSpace" className="mt-4 p-3 border border-accent/20 rounded-md bg-secondary/20">
                <div className="mb-4">
                  <Label htmlFor="desiredGallons" className="block text-sm font-medium text-blue-300 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2"/><path d="M18 15h6"/><path d="M18 22h6v-7h-6v7Z"/></svg>
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
                      className="rounded-r-none bg-card border-accent/30 focus:border-accent"
                    />
                    <span className="inline-flex items-center px-3 bg-secondary text-accent font-mono border border-l-0 border-accent/30 rounded-r-md">
                      gal
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/70 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
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
          
          {/* Results Display with Tank Visual */}
          {result && (
            <div className="mt-4 p-4 bg-vineyard-50 rounded-lg border border-vineyard-200">
              <h3 className="text-lg font-semibold text-vineyard-800 mb-3">Resultado</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Results Data */}
                <div>
                  {isSpaceToGallons(result) && (
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className="text-sm text-gray-600">Galones en Cuerpo Principal:</p>
                        <p className="font-medium text-lg">{formatNumber(result.mainBodyGallons)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Galones en Sección Superior:</p>
                        <p className="font-medium text-lg">{formatNumber(result.topSectionGallons)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Galones Totales en Tanque:</p>
                        <p className="font-bold text-xl text-vineyard-700">{formatNumber(result.totalGallons)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Galones Restantes:</p>
                        <p className="font-bold text-xl text-wine-700">{formatNumber(result.remainingGallons)}</p>
                      </div>
                    </div>
                  )}
                  
                  {isGallonsToSpace(result) && (
                    <div className="grid grid-cols-1 gap-2">
                      <div>
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
                
                {/* Tank Visualization */}
                <div className="flex items-center justify-center">
                  {isSpaceToGallons(result) && (
                    <TankVisual 
                      fillPercentage={result.fillPercentage}
                      gallonsTotal={result.totalGallons}
                      gallonsRemaining={result.remainingGallons}
                    />
                  )}
                  
                  {isGallonsToSpace(result) && (
                    <TankVisual 
                      fillPercentage={result.fillPercentage}
                      gallonsTotal={selectedTank?.TOTAL_GALS}
                    />
                  )}
                </div>
              </div>
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
