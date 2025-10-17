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
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/caymus-logo.jpeg')} 
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.title}>Caymus Calculator</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Selección de Tanque</Text>
          
          <TextInput
            style={styles.input}
            value={selectedTankId}
            onChangeText={handleSelectTank}
            placeholder="Ingrese ID del tanque"
            placeholderTextColor="#666"
            autoCapitalize="characters"
            maxLength={5}
          />

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

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === 'spaceToGallons' && styles.activeTab]}
              onPress={() => { setMode('spaceToGallons'); setResult(null); setError(null); }}
            >
              <Text style={[styles.tabText, mode === 'spaceToGallons' && styles.activeTabText]}>
                Espacio → Galones
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'gallonsToSpace' && styles.activeTab]}
              onPress={() => { setMode('gallonsToSpace'); setResult(null); setError(null); }}
            >
              <Text style={[styles.tabText, mode === 'gallonsToSpace' && styles.activeTabText]}>
                Galones → Espacio
              </Text>
            </TouchableOpacity>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  card: {
    margin: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 8,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  specsContainer: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  specLabel: {
    color: '#888',
    fontSize: 14,
  },
  specValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  tab: {
    flex: 1,
    padding: 12,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#d4af37',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#000',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#d4af37',
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
    color: '#d4af37',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  hint: {
    color: '#666',
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
    backgroundColor: '#d4af37',
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
    borderColor: '#d4af37',
  },
  resetButtonText: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 16,
  },
  resultValues: {
    marginTop: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  resultLabel: {
    color: '#888',
    fontSize: 14,
    flex: 1,
  },
  resultValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
