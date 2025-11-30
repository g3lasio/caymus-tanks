import { useState, useEffect } from 'react';
import tankData, { TankData } from '@/data/tankData';
import { useTankCalculator } from '@/hooks/useTankCalculator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TankVisual from '@/components/TankVisual';
import caymusLogo from '@assets/caymus-logo.jpeg';

const Calculator = () => {
  const [selectedTankId, setSelectedTankId] = useState<string>('');
  const [selectedTank, setSelectedTank] = useState<TankData | null>(null);
  const [fillPercentage, setFillPercentage] = useState<number>(50);
  const [inchesSpace, setInchesSpace] = useState<string>('');
  const [desiredGallons, setDesiredGallons] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showTankList, setShowTankList] = useState<boolean>(false);
  
  const { 
    mode, 
    setMode, 
    result, 
    setResult, 
    calculate,
    isSpaceToGallons,
    isGallonsToSpace
  } = useTankCalculator();

  const formatNumber = (num: number): string => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
      const newHistory = prevHistory.filter(id => id !== tankId);
      const updatedHistory = [tankId, ...newHistory].slice(0, 10);
      localStorage.setItem('tankSearchHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const getAllTankIds = (): string[] => {
    return Object.keys(tankData).sort((a, b) => {
      const getPrefix = (id: string) => id.replace(/\d+/g, '');
      const getNumber = (id: string) => parseInt(id.replace(/\D/g, '')) || 0;
      
      const prefixA = getPrefix(a);
      const prefixB = getPrefix(b);
      
      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      }
      
      return getNumber(a) - getNumber(b);
    });
  };

  const handleSelectTank = (tankId: string) => {
    const upperTankId = tankId.toUpperCase();
    setSelectedTankId(upperTankId);
    setSelectedTank(tankData[upperTankId] || null);
    setResult(null);
    setError(null);
    setShowTankList(false);
    
    if (tankData[upperTankId]) {
      addToHistory(upperTankId);
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
      setError(null);
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Header with Logo */}
      <header className="w-full py-6 px-5 flex items-center justify-center" style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #d4af37' }}>
        <img 
          src={caymusLogo} 
          alt="Caymus" 
          className="max-w-[80%] md:max-w-[400px] h-auto"
          style={{ maxHeight: '120px', objectFit: 'contain' }}
        />
      </header>

      {/* Transition Banner */}
      <div className="py-3 px-4 text-center" style={{ background: 'linear-gradient(to right, #b8860b, #d4af37)' }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="text-white font-semibold text-sm sm:text-base">
            Muy pronto disponible en App Store y Google Play
          </span>
          <div className="flex gap-3">
            <span className="bg-black/20 px-2 py-1 rounded text-white text-xs font-medium">iOS</span>
            <span className="bg-black/20 px-2 py-1 rounded text-white text-xs font-medium">Android</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="max-w-lg mx-auto rounded-xl p-5" style={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }}>
          
          {/* Tank Selection */}
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#d4af37' }}>Selección de Tanque</h2>
          
          <div className="flex gap-3 mb-3">
            <Input
              type="text"
              value={selectedTankId}
              onChange={(e) => handleSelectTank(e.target.value)}
              placeholder="ID"
              maxLength={4}
              className="w-20 text-center font-mono text-lg"
              style={{ backgroundColor: '#0a0a0a', border: '1px solid #d4af37', color: '#fff' }}
              data-testid="input-tank-id"
            />
            <button
              onClick={() => setShowTankList(!showTankList)}
              className="flex-1 py-2 px-4 rounded-lg font-semibold text-sm"
              style={{ backgroundColor: '#0f0f0f', border: '1px solid #d4af37', color: '#d4af37' }}
              data-testid="button-toggle-tank-list"
            >
              {showTankList ? '▲ Tanques' : '▼ Tanques'}
            </button>
          </div>

          {/* Tank Grid */}
          {showTankList && (
            <div className="max-h-40 overflow-y-auto rounded-lg mb-3 p-2" style={{ backgroundColor: '#0f0f0f', border: '1px solid #333' }}>
              <div className="grid grid-cols-4 gap-0">
                {getAllTankIds().map((tankId) => (
                  <button
                    key={tankId}
                    onClick={() => handleSelectTank(tankId)}
                    className="py-2 px-1 text-xs font-mono font-semibold text-center"
                    style={{
                      backgroundColor: selectedTankId === tankId ? '#d4af37' : '#1a1a1a',
                      color: selectedTankId === tankId ? '#000' : '#888',
                      border: '1px solid #333'
                    }}
                    data-testid={`button-select-tank-${tankId}`}
                  >
                    {tankId}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTankId && !selectedTank && (
            <p className="text-xs mb-3" style={{ color: '#ff4444' }}>No se encontró "{selectedTankId}"</p>
          )}

          {/* Specifications */}
          {selectedTank && (
            <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#0f0f0f', border: '1px solid #333' }}>
              <h3 className="text-base font-semibold mb-3" style={{ color: '#d4af37' }}>Especificaciones</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #222' }}>
                  <span style={{ color: '#888' }}>Galones/Pulgada:</span>
                  <span className="font-mono" style={{ color: '#fff' }}>{selectedTank.GALS_PER_INCH.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #222' }}>
                  <span style={{ color: '#888' }}>Galones en Tope:</span>
                  <span className="font-mono" style={{ color: '#fff' }}>{selectedTank.GALS_IN_TOP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #222' }}>
                  <span style={{ color: '#888' }}>Pulgadas en Tope:</span>
                  <span className="font-mono" style={{ color: '#fff' }}>{selectedTank.TOP_INCHES.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #222' }}>
                  <span style={{ color: '#888' }}>Galones Totales:</span>
                  <span className="font-mono" style={{ color: '#fff' }}>{selectedTank.TOTAL_GALS.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2" style={{ color: '#888' }}>Modo de Cálculo</p>
            <div className="flex rounded-full p-1" style={{ backgroundColor: '#0f0f0f', border: '2px solid #d4af37' }}>
              <button
                onClick={() => { setMode('spaceToGallons'); setResult(null); setError(null); }}
                className="flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: mode === 'spaceToGallons' ? '#d4af37' : 'transparent',
                  color: mode === 'spaceToGallons' ? '#000' : '#888'
                }}
                data-testid="button-mode-space-to-gallons"
              >
                Espacio → Galones
              </button>
              <button
                onClick={() => { setMode('gallonsToSpace'); setResult(null); setError(null); }}
                className="flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: mode === 'gallonsToSpace' ? '#d4af37' : 'transparent',
                  color: mode === 'gallonsToSpace' ? '#000' : '#888'
                }}
                data-testid="button-mode-gallons-to-space"
              >
                Galones → Espacio
              </button>
            </div>
          </div>

          {/* Input Field */}
          {mode === 'spaceToGallons' ? (
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: '#888' }}>Pulgadas de Espacio</label>
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #d4af37' }}>
                <input
                  type="number"
                  value={inchesSpace}
                  onChange={(e) => setInchesSpace(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="flex-1 p-3 text-base outline-none"
                  style={{ backgroundColor: '#0a0a0a', color: '#fff', border: 'none' }}
                  data-testid="input-inches"
                />
                <span className="px-4 flex items-center font-mono text-sm" style={{ backgroundColor: '#0a0a0a', color: '#d4af37' }}>in</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#666' }}>Ingrese la medida de espacio vacío desde la parte superior del tanque</p>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: '#888' }}>Galones Deseados</label>
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #d4af37' }}>
                <input
                  type="number"
                  value={desiredGallons}
                  onChange={(e) => setDesiredGallons(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={selectedTank?.TOTAL_GALS || 0}
                  className="flex-1 p-3 text-base outline-none"
                  style={{ backgroundColor: '#0a0a0a', color: '#fff', border: 'none' }}
                  data-testid="input-gallons"
                />
                <span className="px-4 flex items-center font-mono text-sm" style={{ backgroundColor: '#0a0a0a', color: '#d4af37' }}>gal</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#666' }}>Ingrese el volumen deseado en galones</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#331111', border: '1px solid #ff4444' }}>
              <p style={{ color: '#ff4444' }}>{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleCalculate}
              className="flex-1 py-4 rounded-lg font-bold text-base"
              style={{ backgroundColor: '#d4af37', color: '#000' }}
              data-testid="button-calculate"
            >
              CALCULAR
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-4 rounded-lg font-bold text-base"
              style={{ backgroundColor: 'transparent', border: '1px solid #d4af37', color: '#d4af37' }}
              data-testid="button-reset"
            >
              RESETEAR
            </button>
          </div>

          {/* Results */}
          {result && selectedTank && (
            <div className="rounded-lg p-4" style={{ backgroundColor: '#0f0f0f', border: '1px solid #d4af37' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#d4af37' }}>Resultado</h3>
              
              <div className="flex justify-center mb-4">
                <TankVisual 
                  fillPercentage={fillPercentage}
                  gallonsTotal={isSpaceToGallons(result) ? result.totalGallons : selectedTank.TOTAL_GALS}
                  gallonsRemaining={isSpaceToGallons(result) ? result.remainingGallons : undefined}
                />
              </div>
              
              {isSpaceToGallons(result) && (
                <div className="space-y-3">
                  <div className="flex justify-between py-3" style={{ borderBottom: '1px solid #222' }}>
                    <span className="text-sm" style={{ color: '#888' }}>Total de galones en el tanque:</span>
                    <span className="font-mono font-semibold" style={{ color: '#fff' }}>{formatNumber(result.totalGallons)}</span>
                  </div>
                  <div className="flex justify-between py-3" style={{ borderBottom: '1px solid #222' }}>
                    <span className="text-sm" style={{ color: '#888' }}>Galones restantes:</span>
                    <span className="font-mono font-semibold" style={{ color: '#fff' }}>{formatNumber(result.remainingGallons)}</span>
                  </div>
                  <div className="flex justify-between py-3" style={{ borderBottom: '1px solid #222' }}>
                    <span className="text-sm" style={{ color: '#888' }}>Porcentaje de llenado:</span>
                    <span className="font-mono font-semibold" style={{ color: '#fff' }}>{fillPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              )}
              
              {isGallonsToSpace(result) && (
                <div className="space-y-3">
                  <div className="flex justify-between py-3" style={{ borderBottom: '1px solid #222' }}>
                    <span className="text-sm" style={{ color: '#888' }}>Espacio requerido (pulgadas):</span>
                    <span className="font-mono font-semibold" style={{ color: '#fff' }}>{formatNumber(result.requiredSpace)}</span>
                  </div>
                  <div className="flex justify-between py-3" style={{ borderBottom: '1px solid #222' }}>
                    <span className="text-sm" style={{ color: '#888' }}>Porcentaje de llenado:</span>
                    <span className="font-mono font-semibold" style={{ color: '#fff' }}>{fillPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-5 text-center" style={{ backgroundColor: '#1a1a1a', borderTop: '2px solid #d4af37' }}>
        <p className="font-semibold text-sm" style={{ color: '#d4af37' }}>© {new Date().getFullYear()} Chyrris Technologies</p>
        <p className="text-xs mt-1" style={{ color: '#888' }}>All rights reserved</p>
      </footer>
    </div>
  );
};

export default Calculator;
