import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tankData, { TankData } from '../data/tankData';
import { useTankCalculator } from '../hooks/useTankCalculator';
import TankVisual from '../components/TankVisual';
import FloatingMenu from '../components/FloatingMenu';

interface HistoryItem {
  tankId: string;
  info: string;
  timestamp: number;
}

export default function CalculatorScreen() {
  const [selectedTankId, setSelectedTankId] = useState<string>('');
  const [selectedTank, setSelectedTank] = useState<TankData | null>(null);
  const [fillPercentage, setFillPercentage] = useState<number>(50);
  const [inchesSpace, setInchesSpace] = useState<string>('');
  const [desiredGallons, setDesiredGallons] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showTankList, setShowTankList] = useState<boolean>(false);
  const [tankSearch, setTankSearch] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>('#0a1628');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

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
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('tankSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history', e);
    }
  };

  const saveHistory = async (history: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem('tankSearchHistory', JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history', e);
    }
  };

  const clearHistory = async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem('tankSearchHistory');
    } catch (e) {
      console.error('Error clearing history', e);
    }
  };

  const handleSelectHistoryItem = (tankId: string) => {
    handleSelectTank(tankId);
  };

  const handleChangeBackgroundColor = async (color: string) => {
    setBackgroundColor(color);
    try {
      await AsyncStorage.setItem('backgroundColor', color);
    } catch (e) {
      console.error('Error saving background color', e);
    }
  };

  const handleChangeLanguage = async (lang: 'es' | 'en') => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (e) {
      console.error('Error saving language', e);
    }
  };

  // Cargar preferencias guardadas
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedBgColor = await AsyncStorage.getItem('backgroundColor');
        const savedLang = await AsyncStorage.getItem('language');
        if (savedBgColor) setBackgroundColor(savedBgColor);
        if (savedLang) setLanguage(savedLang as 'es' | 'en');
      } catch (e) {
        console.error('Error loading preferences', e);
      }
    };
    loadPreferences();
  }, []);

  const addToHistory = (tankId: string) => {
    if (!tankId || !tankData[tankId]) return;
    
    let info = '';
    
    if (result) {
      if (mode === 'spaceToGallons' && isSpaceToGallons(result)) {
        const inches = parseFloat(inchesSpace);
        info = `${inches} pulg. → ${formatNumber(result.totalGallons)} gal.`;
      } else if (mode === 'gallonsToSpace' && isGallonsToSpace(result)) {
        const gallons = parseFloat(desiredGallons);
        info = `${formatNumber(gallons)} gal. → ${formatNumber(result.requiredSpace)} pulg.`;
      }
    }
    
    const newHistoryItem: HistoryItem = {
      tankId,
      info,
      timestamp: Date.now()
    };
    
    const filteredHistory = searchHistory.filter(item => item.tankId !== tankId);
    const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 10);
    
    setSearchHistory(updatedHistory);
    saveHistory(updatedHistory);
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

  const SERIES_ORDER = ['BL', 'BR', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  
  const getAllTankIds = (): string[] => {
    return Object.keys(tankData).sort((a, b) => {
      const getPrefix = (id: string) => id.replace(/\d+/g, '');
      const getNumber = (id: string) => parseInt(id.replace(/\D/g, '')) || 0;
      
      const prefixA = getPrefix(a);
      const prefixB = getPrefix(b);
      
      if (prefixA !== prefixB) {
        const indexA = SERIES_ORDER.indexOf(prefixA);
        const indexB = SERIES_ORDER.indexOf(prefixB);
        return indexA - indexB;
      }
      
      return getNumber(a) - getNumber(b);
    });
  };
  
  const getFilteredTankIds = (): string[] => {
    const allTanks = getAllTankIds();
    if (!tankSearch.trim()) return allTanks;
    const search = tankSearch.toUpperCase();
    return allTanks.filter(id => id.includes(search));
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
        
        if (selectedTankId) {
          addToHistory(selectedTankId);
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
        
        if (selectedTankId) {
          addToHistory(selectedTankId);
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
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <FloatingMenu
        history={searchHistory}
        onClearHistory={clearHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
        backgroundColor={backgroundColor}
        onChangeBackgroundColor={handleChangeBackgroundColor}
        language={language}
        onChangeLanguage={handleChangeLanguage}
      />
      
      <View style={styles.header}>
        <Image 
          source={require('../../assets/caymus-logo.jpeg')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Selección de Tanque</Text>
          
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={selectedTankId}
              onChangeText={handleSelectTank}
              placeholder="ID"
              placeholderTextColor="#666"
              autoCapitalize="characters"
              maxLength={4}
            />
            <TouchableOpacity 
              style={styles.tankListButton}
              onPress={() => setShowTankList(!showTankList)}
              data-testid="button-toggle-tank-list"
            >
              <Text style={styles.tankListButtonText}>
                {showTankList ? '▲ Tanques' : '▼ Tanques'}
              </Text>
            </TouchableOpacity>
          </View>

          {showTankList && (
            <View style={styles.tankListWrapper}>
              <TextInput
                style={styles.tankSearchInput}
                value={tankSearch}
                onChangeText={setTankSearch}
                placeholder="🔍 Buscar tanque..."
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
              <ScrollView 
                style={styles.tankListContainer} 
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
              >
                <View style={styles.tankGrid}>
                  {getFilteredTankIds().map((tankId) => (
                  <TouchableOpacity
                    key={tankId}
                    style={[
                      styles.tankGridItem,
                      selectedTankId === tankId && styles.tankGridItemSelected
                    ]}
                    onPress={() => handleSelectTank(tankId)}
                    data-testid={`button-select-tank-${tankId}`}
                  >
                    <Text style={[
                      styles.tankGridText,
                      selectedTankId === tankId && styles.tankGridTextSelected
                    ]}>
                      {tankId}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              </ScrollView>
            </View>
          )}

          {selectedTankId && !selectedTank && (
            <Text style={styles.errorText}>No se encontró "{selectedTankId}"</Text>
          )}

          {selectedTank && (
            <View style={styles.specsContainer}>
              <Text style={styles.specsTitle}>Especificaciones</Text>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Galones/Pulgada:</Text>
                <Text style={styles.specValue}>{selectedTank.GALS_PER_INCH.toFixed(2)}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Galones en Tope:</Text>
                <Text style={styles.specValue}>{selectedTank.GALS_IN_TOP.toFixed(2)}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Pulgadas en Tope:</Text>
                <Text style={styles.specValue}>{selectedTank.TOP_INCHES.toFixed(2)}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Galones Totales:</Text>
                <Text style={styles.specValue}>{selectedTank.TOTAL_GALS.toFixed(2)}</Text>
              </View>
            </View>
          )}

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Modo de Cálculo</Text>
            <View style={styles.toggleSwitch}>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  mode === 'spaceToGallons' && styles.toggleOptionActive
                ]}
                onPress={() => { setMode('spaceToGallons'); setResult(null); setError(null); }}
                data-testid="button-mode-space-to-gallons"
              >
                <Text style={[
                  styles.toggleText,
                  mode === 'spaceToGallons' && styles.toggleTextActive
                ]}>
                  Espacio → Galones
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  mode === 'gallonsToSpace' && styles.toggleOptionActive
                ]}
                onPress={() => { setMode('gallonsToSpace'); setResult(null); setError(null); }}
                data-testid="button-mode-gallons-to-space"
              >
                <Text style={[
                  styles.toggleText,
                  mode === 'gallonsToSpace' && styles.toggleTextActive
                ]}>
                  Galones → Espacio
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'spaceToGallons' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pulgadas de Espacio</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.inputField}
                  value={inchesSpace}
                  onChangeText={setInchesSpace}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#666"
                />
                <Text style={styles.unit}>in</Text>
              </View>
              <Text style={styles.hint}>Ingrese la medida de espacio vacío desde la parte superior del tanque</Text>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Galones Deseados</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.inputField}
                  value={desiredGallons}
                  onChangeText={setDesiredGallons}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#666"
                />
                <Text style={styles.unit}>gal</Text>
              </View>
              <Text style={styles.hint}>Ingrese el volumen deseado en galones</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>CALCULAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>RESETEAR</Text>
            </TouchableOpacity>
          </View>

          {result && selectedTank && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Resultado</Text>
              
              {/* Mensaje de precisión dinámico */}
              {result && 'precisionMessage' in result && (
                <View style={[styles.warningContainer, result.isInCampana ? styles.campanaWarning : styles.bodySuccess]}>
                  <Text style={[styles.warningText, !result.isInCampana && styles.successText]}>
                    {result.precisionMessage}
                  </Text>
                </View>
              )}
              
              <TankVisual fillPercentage={fillPercentage} />
              
              {isSpaceToGallons(result) && (
                <View style={styles.resultValues}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total de galones en el tanque:</Text>
                    <Text style={styles.resultValue}>{formatNumber(result.totalGallons)}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Galones restantes:</Text>
                    <Text style={styles.resultValue}>{formatNumber(result.remainingGallons)}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Porcentaje de llenado:</Text>
                    <Text style={styles.resultValue}>{fillPercentage.toFixed(1)}%</Text>
                  </View>
                </View>
              )}
              
              {isGallonsToSpace(result) && (
                <View style={styles.resultValues}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Espacio requerido (pulgadas):</Text>
                    <Text style={styles.resultValue}>{formatNumber(result.requiredSpace)}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Porcentaje de llenado:</Text>
                    <Text style={styles.resultValue}>{fillPercentage.toFixed(1)}%</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Chyrris Technologies</Text>
        <Text style={styles.footerSubtext}>All rights reserved</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628', // Default, overridden by state
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    backgroundColor: '#112240',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00d4ff',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: 120,
    maxWidth: 400,
  },
  card: {
    margin: 16,
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    width: 70,
    backgroundColor: '#0a1628',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tankListButton: {
    flex: 1,
    backgroundColor: '#0d1f3c',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tankListButtonText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  tankListWrapper: {
    marginBottom: 12,
  },
  tankSearchInput: {
    backgroundColor: '#0d1f3c',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  tankListContainer: {
    maxHeight: 160,
    backgroundColor: '#0d1f3c',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    marginBottom: 12,
  },
  tankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 6,
  },
  tankGridItem: {
    width: '25%',
    backgroundColor: '#112240',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    minHeight: 36,
  },
  tankGridItemSelected: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  tankGridText: {
    color: '#8892b0',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tankGridTextSelected: {
    color: '#000',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  specsContainer: {
    backgroundColor: '#0d1f3c',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  specLabel: {
    color: '#8892b0',
    fontSize: 14,
  },
  specValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleLabel: {
    color: '#8892b0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  toggleSwitch: {
    flexDirection: 'row',
    backgroundColor: '#0d1f3c',
    borderRadius: 25,
    padding: 4,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOptionActive: {
    backgroundColor: '#00d4ff',
  },
  toggleText: {
    color: '#8892b0',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#8892b0',
    fontSize: 14,
    marginBottom: 8,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a1628',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 8,
  },
  inputField: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#fff',
  },
  unit: {
    paddingHorizontal: 12,
    color: '#00d4ff',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  hint: {
    color: '#5a6a8a',
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#331111',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  calculateButton: {
    flex: 1,
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  resetButtonText: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#0d1f3c',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 16,
  },
  warningContainer: {
    backgroundColor: '#332200',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  campanaWarning: {
    backgroundColor: '#332200',
    borderColor: '#00d4ff',
  },
  bodySuccess: {
    backgroundColor: '#113311',
    borderColor: '#44aa44',
  },
  warningText: {
    color: '#00d4ff',
    fontSize: 13,
    textAlign: 'center',
  },
  successText: {
    color: '#44aa44',
  },
  resultValues: {
    marginTop: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  resultLabel: {
    color: '#8892b0',
    fontSize: 14,
    flex: 1,
  },
  resultValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footer: {
    backgroundColor: '#112240',
    borderTopWidth: 2,
    borderTopColor: '#00d4ff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: 4,
  },
});
