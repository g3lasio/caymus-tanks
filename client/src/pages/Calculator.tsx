import { useState, useEffect } from 'react';
import tankData, { TankData } from '@/data/tankData';
import { useTankCalculator } from '@/hooks/useTankCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TankVisual from '@/components/TankVisual';

const Calculator = () => {
  const [selectedTankId, setSelectedTankId] = useState<string>('');
  const [selectedTank, setSelectedTank] = useState<TankData | null>(null);
  const [fillPercentage, setFillPercentage] = useState<number>(50); // Default 50% fill
  const [inchesSpace, setInchesSpace] = useState<string>('');
  const [desiredGallons, setDesiredGallons] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  
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

  // Cargar historial de búsqueda del localStorage al inicio
  useEffect(() => {
    const savedHistory = localStorage.getItem('tankSearchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory);
        }
      } catch (e) {
        console.error('Error parsing search history', e);
      }
    }
  }, []);

  const addToHistory = (tankId: string) => {
    if (!tankId) return;
    
    setSearchHistory(prevHistory => {
      // Si el ID ya está en el historial, lo movemos al principio
      const newHistory = prevHistory.filter(id => id !== tankId);
      // Añadimos el nuevo ID al principio y limitamos a 10 elementos
      const updatedHistory = [tankId, ...newHistory].slice(0, 10);
      
      // Guardamos en localStorage
      localStorage.setItem('tankSearchHistory', JSON.stringify(updatedHistory));
      
      return updatedHistory;
    });
  };

  const handleSelectTank = (tankId: string) => {
    setSelectedTankId(tankId);
    setSelectedTank(tankData[tankId] || null);
    setResult(null); // Clear result when changing tank
    setError(null);
    // Añadir al historial si se encontró un tanque válido
    if (tankData[tankId]) {
      addToHistory(tankId);
    }
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

      {/* Transition Banner - Native Apps Coming Soon */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 py-3 px-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 18h.01"/>
              <path d="M7.9 17h8.2a2 2 0 0 0 1.7-3l-4.1-6.9a2 2 0 0 0-3.4 0L6.2 14a2 2 0 0 0 1.7 3z"/>
            </svg>
            <span className="text-white font-semibold text-sm sm:text-base">
              Muy pronto disponible en App Store y Google Play
            </span>
          </div>
          <div className="flex gap-3 mt-1 sm:mt-0">
            <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-white text-xs font-medium">iOS</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M17.523 15.34a.5.5 0 0 0 0-.68l-.19-.19a.5.5 0 0 0-.68 0l-.68.68-.68-.68a.5.5 0 0 0-.68 0l-.19.19a.5.5 0 0 0 0 .68l.68.68-.68.68a.5.5 0 0 0 0 .68l.19.19a.5.5 0 0 0 .68 0l.68-.68.68.68a.5.5 0 0 0 .68 0l.19-.19a.5.5 0 0 0 0-.68l-.68-.68.68-.68zM6.523 15.34a.5.5 0 0 0 0-.68l-.19-.19a.5.5 0 0 0-.68 0l-.68.68-.68-.68a.5.5 0 0 0-.68 0l-.19.19a.5.5 0 0 0 0 .68l.68.68-.68.68a.5.5 0 0 0 0 .68l.19.19a.5.5 0 0 0 .68 0l.68-.68.68.68a.5.5 0 0 0 .68 0l.19-.19a.5.5 0 0 0 0-.68l-.68-.68.68-.68zM3.5 10.5l7-7 2 2 7-7v11a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-11z"/>
              </svg>
              <span className="text-white text-xs font-medium">Android</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-3 py-4 flex-grow">
        <div className="bg-card rounded-lg shadow-2xl border border-accent/20 p-4 sm:p-6 max-w-2xl mx-auto backdrop-blur-sm">
          {/* Tank Selection */}
          <div className="mb-4">
            <h2 className="text-xl font-mono text-accent mb-3 border-b border-accent/30 pb-2 flex items-center">
              <span className="inline-block w-3 h-3 bg-accent mr-2 rounded-full animate-pulse"></span>
              Selección de Tanque
            </h2>
            
            {/* Tank Selection Controls - Side by side */}
            <div className="flex flex-row gap-2 items-start">
              {/* Search Tank Input */}
              <div className="flex-1">
                <Label htmlFor="searchTank" className="block text-sm font-medium text-blue-300 mb-1">
                  ID Tanque
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
                    placeholder="ID"
                    maxLength={5}
                    className={`bg-card border-accent/30 text-foreground focus:border-accent/70 w-32 text-center font-mono text-lg ${!selectedTank && selectedTankId ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
              
              {/* Dropdown Select */}
              <div className="flex-1">
                <Label htmlFor="tankSelect" className="block text-sm font-medium text-blue-300 mb-1">
                  Seleccionar
                </Label>
                <Select value={selectedTankId} onValueChange={handleSelectTank}>
                  <SelectTrigger id="tankSelect" className="bg-card border-accent/30 focus:ring-accent/50 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-card border-accent/30">
                    {Object.keys(tankData).map((tankId) => (
                      <SelectItem key={tankId} value={tankId} className="text-foreground hover:bg-accent/20">
                        {tankId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* History Button */}
              <div className="flex flex-col items-start mt-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-full bg-secondary border-accent/30 hover:bg-accent/20"
                      aria-label="Mostrar historial"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                           className="text-accent">
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path>
                        <path d="M12 7v5l3 3"></path>
                      </svg>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0 bg-card border-accent/30">
                    <div className="p-2 bg-secondary/50 border-b border-accent/20">
                      <p className="text-xs font-mono text-blue-300">BÚSQUEDAS RECIENTES</p>
                    </div>
                    {searchHistory.length > 0 ? (
                      <div className="max-h-40 overflow-y-auto">
                        {searchHistory.map((tankId) => (
                          <button
                            key={tankId}
                            className="w-full text-left py-1.5 px-3 hover:bg-accent/20 font-mono text-sm text-foreground flex items-center"
                            onClick={() => handleSelectTank(tankId)}
                          >
                            <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2"></span>
                            {tankId}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-xs text-foreground/70">
                        No hay búsquedas recientes
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Feedback when no tank is found */}
            {selectedTankId && !selectedTank && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                No se encontró "{selectedTankId}"
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
            <div className="mb-4 p-2 bg-red-950/50 text-red-400 border border-red-500/30 rounded-md flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 flex-shrink-0"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              onClick={handleCalculate}
              className="bg-accent hover:bg-accent/80 text-black font-mono uppercase tracking-wider text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 3v18h18"/><path d="m21 3-9 9"/><path d="m21 9-9 9-3-3 9-9"/><path d="m9 15-3 3"/></svg>
              Calcular
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-accent/40 text-accent hover:bg-accent/10 font-mono uppercase tracking-wider text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              Resetear
            </Button>
          </div>
          
          {/* Results Display with Tank Visual */}
          {result && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-accent/30 backdrop-blur-sm">
              <h3 className="text-lg font-mono text-accent mb-3 flex items-center">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                Resultado
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Results Data */}
                <div className="bg-card/50 rounded-lg border border-accent/20 p-3">
                  {isSpaceToGallons(result) && (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-2 border-b border-accent/10">
                        <p className="text-sm text-blue-300">Total de galones en el tanque:</p>
                        <p className="font-mono text-xl text-white flex items-center">
                          <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                          {formatNumber(result.totalGallons)}
                        </p>
                      </div>
                      <div className="p-2">
                        <p className="text-sm text-blue-300">Galones restantes:</p>
                        <p className="font-mono text-xl text-white flex items-center">
                          <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                          {formatNumber(result.remainingGallons)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {isGallonsToSpace(result) && (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-2">
                        <p className="text-sm text-blue-300">Espacio requerido (en pulgadas):</p>
                        <p className="font-mono text-xl text-white flex items-center">
                          <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                          {formatNumber(result.requiredSpace)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Tank Visualization */}
                <div className="flex items-center justify-center bg-gradient-to-b from-secondary/30 to-black/30 rounded-lg border border-accent/20 p-2">
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
      <footer className="bg-gradient-to-r from-indigo-900 to-primary text-white py-3 mt-auto border-t border-accent/30">
        <div className="container mx-auto px-3 text-center">
          <p className="font-mono text-xs tracking-wider opacity-80">&copy; {new Date().getFullYear()} <span className="text-accent">CAYMUS</span> CALCULATOR v2.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
