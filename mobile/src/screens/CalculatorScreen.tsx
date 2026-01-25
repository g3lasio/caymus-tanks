import { useState, useEffect, useRef } from 'react';
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
import { TRANSLATIONS, Language } from '../i18n/translations';

interface HistoryItem {
  tankId: string;
  info: string;
  timestamp: number;
}

interface CalculatorScreenProps {
  userName?: string;
  isOwner?: boolean;
  onLogout?: () => void;
}

export default function CalculatorScreen({
  userName = '',
  isOwner = false,
  onLogout,
}: CalculatorScreenProps) {
  const [selectedTankId, setSelectedTankId] = useState<string>('');
  const [selectedTank, setSelectedTank] = useState<TankData | null>(null);
  const [fillPercentage, setFillPercentage] = useState<number>(50);
  const [inchesSpace, setInchesSpace] = useState<string>('');
  const [desiredGallons, setDesiredGallons] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
  const [showTankList, setShowTankList] = useState<boolean>(false);
  const [tankSearch, setTankSearch] = useState<string>('');
  const [language, setLanguage] = useState<Language>('es');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[language];

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
    loadPreferences();
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

  const loadPreferences = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) setLanguage(savedLang as Language);
    } catch (e) {
      console.error('Error loading preferences', e);
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

  const handleChangeLanguage = async (lang: Language) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (e) {
      console.error('Error saving language', e);
    }
  };

  const handleLogoutPress = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const addToHistory = (tankId: string) => {
    if (!tankId || !tankData[tankId]) return;
    
    let info = '';
    
    if (result) {
      if (mode === 'spaceToGallons' && isSpaceToGallons(result)) {
        const inches = parseFloat(inchesSpace);
        info = `${inches} ${language === 'es' ? 'pulg.' : 'in.'} → ${formatNumber(result.totalGallons)} gal.`;
      } else if (mode === 'gallonsToSpace' && isGallonsToSpace(result)) {
        const gallons = parseFloat(desiredGallons);
        info = `${formatNumber(gallons)} gal. → ${formatNumber(result.requiredSpace)} ${language === 'es' ? 'pulg.' : 'in.'}`;
      }
    }
    
    const newHistoryItem: HistoryItem = {
      tankId,
      info,
      timestamp: Date.now()
    };
    
    // Asegurarnos de que el historial se actualice correctamente
    const filteredHistory = searchHistory.filter(item => item.tankId !== tankId);
    const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 10);
    
    setSearchHistory(updatedHistory);
    // Guardar inmediatamente en AsyncStorage
    AsyncStorage.setItem('tankSearchHistory', JSON.stringify(updatedHistory))
      .catch(e => console.error('Error saving history', e));
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
      setError(t.selectTankFirst);
      return;
    }

    try {
      if (mode === 'spaceToGallons') {
        const spaceValue = parseFloat(inchesSpace);
        if (isNaN(spaceValue) || spaceValue < 0) {
          setError(t.invalidInches);
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
          setError(`${t.invalidGallons} ${selectedTank.TOTAL_GALS.toFixed(2)}`);
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
      
      {/* Header con menú hamburguesa integrado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setMenuOpen(true)}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Image 
          source={require('../../assets/caymus-logo.jpeg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerSpacer} />
      </View>

      {/* Floating Menu (ahora es un sidebar) */}
      <FloatingMenu
        isVisible={menuOpen}
        onClose={() => setMenuOpen(false)}
        history={searchHistory}
        onClearHistory={clearHistory}
        onSelectHistoryItem={(tankId) => {
          handleSelectHistoryItem(tankId);
          setMenuOpen(false);
        }}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        userName={userName}
        isOwner={isOwner}
        onLogout={handleLogoutPress}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t.tankSelection}</Text>
          
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
                {showTankList ? `▲ ${t.tanks}` : `▼ ${t.tanks}`}
              </Text>
            </TouchableOpacity>
          </View>

          {showTankList && (
            <View style={styles.tankListWrapper}>
              <TextInput
                style={styles.tankSearchInput}
                value={tankSearch}
                onChangeText={setTankSearch}
                placeholder={t.searchTank}
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
                    ]}>{tankId}</Text>
                  </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {selectedTank && (
            <View style={styles.specsContainer}>
              <Text style={styles.specsTitle}>{t.tankSpecs}: {selectedTankId}</Text>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>{t.totalCapacity}:</Text>
                <Text style={styles.specValue}>{formatNumber(selectedTank.TOTAL_GALS)} gal</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>{t.gallonsPerInch}:</Text>
                <Text style={styles.specValue}>{formatNumber(selectedTank.GALS_PER_INCH)} gal/in</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>{t.bellCapacity}:</Text>
                <Text style={styles.specValue}>{formatNumber(selectedTank.GALS_IN_TOP)} gal</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>{t.bellHeight}:</Text>
                <Text style={styles.specValue}>{formatNumber(selectedTank.TOP_INCHES)} in</Text>
              </View>
            </View>
          )}

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>{t.calculationMode}</Text>
            <View style={styles.toggleSwitch}>
              <TouchableOpacity
                style={[styles.toggleOption, mode === 'spaceToGallons' && styles.toggleOptionActive]}
                onPress={() => { setMode('spaceToGallons'); setResult(null); }}
              >
                <Text style={[styles.toggleText, mode === 'spaceToGallons' && styles.toggleTextActive]}>
                  {t.spaceToGallons}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, mode === 'gallonsToSpace' && styles.toggleOptionActive]}
                onPress={() => { setMode('gallonsToSpace'); setResult(null); }}
              >
                <Text style={[styles.toggleText, mode === 'gallonsToSpace' && styles.toggleTextActive]}>
                  {t.gallonsToSpace}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'spaceToGallons' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.inchesOfSpace}</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.inputField}
                  value={inchesSpace}
                  onChangeText={setInchesSpace}
                  placeholder="0.00"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
                <Text style={styles.unit}>in</Text>
              </View>
              <Text style={styles.hint}>{t.enterSpaceHint}</Text>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.desiredGallons}</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.inputField}
                  value={desiredGallons}
                  onChangeText={setDesiredGallons}
                  placeholder="0.00"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
                <Text style={styles.unit}>gal</Text>
              </View>
              <Text style={styles.hint}>{t.enterGallonsHint}</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>{t.calculate}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>{t.reset}</Text>
            </TouchableOpacity>
          </View>

          {result && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>{t.results}</Text>
              
              {isSpaceToGallons(result) && (
                <>
                  {result.isInCampana ? (
                    <View style={[styles.warningContainer, styles.campanaWarning]}>
                      <Text style={styles.warningText}>{t.bellZoneWarning}</Text>
                    </View>
                  ) : (
                    <View style={[styles.warningContainer, styles.bodySuccess]}>
                      <Text style={[styles.warningText, styles.successText]}>{t.bodyZoneSuccess}</Text>
                    </View>
                  )}
                  
                  <View style={styles.resultValues}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>{t.wineGallons}:</Text>
                      <Text style={styles.resultValue}>{formatNumber(result.totalGallons)} gal</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>{t.emptySpace}:</Text>
                      <Text style={styles.resultValue}>{formatNumber(result.remainingGallons)} gal</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>{t.fillPercentage}:</Text>
                      <Text style={styles.resultValue}>{result.fillPercentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                </>
              )}
              
              {isGallonsToSpace(result) && (
                <>
                  {result.isInCampana ? (
                    <View style={[styles.warningContainer, styles.campanaWarning]}>
                      <Text style={styles.warningText}>{t.bellZoneWarning}</Text>
                    </View>
                  ) : (
                    <View style={[styles.warningContainer, styles.bodySuccess]}>
                      <Text style={[styles.warningText, styles.successText]}>{t.bodyZoneSuccess}</Text>
                    </View>
                  )}
                  
                  <View style={styles.resultValues}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>{t.requiredSpace}:</Text>
                      <Text style={styles.resultValue}>{formatNumber(result.requiredSpace)} in</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>{t.wineGallons}:</Text>
                      <Text style={styles.resultValue}>{formatNumber(parseFloat(desiredGallons) || 0)} gal</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>{t.fillPercentage}:</Text>
                      <Text style={styles.resultValue}>{result.fillPercentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Chyrris Technologies</Text>
        <Text style={styles.footerSubtext}>{t.allRightsReserved}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#112240',
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 8,
    borderBottomWidth: 2,
    borderBottomColor: '#00d4ff',
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    // Aumentar área de toque para iOS
    zIndex: 1000,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  logo: {
    width: '50%',
    height: 50,
    maxWidth: 200,
  },
  headerSpacer: {
    width: 40,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
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
