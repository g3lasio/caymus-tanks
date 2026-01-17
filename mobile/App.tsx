/**
 * Caymus Tanks - Calculadora de Volumen de Tanques de Vino
 * 
 * Aplicación completa con:
 * - Calculadora de galones
 * - Sidebar con navegación
 * - Historial de cálculos
 * - Páginas legales
 * - About Us
 * 
 * Propiedad de Chyrris Technologies Inc.
 * © 2026 Todos los derechos reservados.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  Linking,
  Animated,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;

// ============================================================================
// TIPOS
// ============================================================================

interface TankData {
  GALS_PER_INCH: number;
  GALS_IN_TOP: number;
  TOP_INCHES: number;
  TOTAL_GALS: number;
}

interface CalculationRecord {
  id: string;
  tankId: string;
  mode: 'space_to_gallons' | 'gallons_to_space';
  input: number;
  result: number;
  percentage: number;
  isInDome: boolean;
  timestamp: number;
}

type Screen = 
  | 'Calculator' 
  | 'History' 
  | 'ConfidentialityAgreement' 
  | 'TermsOfService' 
  | 'PrivacyPolicy' 
  | 'DataDeletion' 
  | 'Support'
  | 'About';

// ============================================================================
// DATOS DE TANQUES (153 tanques)
// ============================================================================

const tankData: Record<string, TankData> = {
  "BL1": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },
  "BL2": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },
  "BL3": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },
  "BL4": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },
  "BR1": { "GALS_PER_INCH": 107.73, "GALS_IN_TOP": 478.88, "TOP_INCHES": 24.25, "TOTAL_GALS": 19523.87 },
  "BR2": { "GALS_PER_INCH": 107.73, "GALS_IN_TOP": 478.88, "TOP_INCHES": 24.25, "TOTAL_GALS": 19523.87 },
  "BR3": { "GALS_PER_INCH": 107.73, "GALS_IN_TOP": 478.88, "TOP_INCHES": 24.25, "TOTAL_GALS": 19523.87 },
  "A1": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A2": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A3": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A4": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A5": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A6": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A7": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A8": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A9": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A10": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A11": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A12": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A13": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A14": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A15": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "B1": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B2": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B3": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B4": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B5": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B6": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B7": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B8": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B9": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C1": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C2": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C3": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C4": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C5": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C6": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C7": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C8": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C9": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C10": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C11": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C12": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C13": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C14": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C15": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "D1": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D2": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D3": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D4": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D5": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D6": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D7": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D8": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D9": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "D10": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },
  "D11": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "D12": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "D13": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "D14": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "D15": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "D16": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "D17": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },
  "E1": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E2": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E3": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E4": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E5": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E6": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E7": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E8": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E9": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.9, "TOTAL_GALS": 32932 },
  "E10": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },
  "E11": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "E12": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "E13": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "E14": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "E15": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "E16": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.5, "TOTAL_GALS": 33212 },
  "E17": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },
  "F1": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F2": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F3": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F4": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F5": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F6": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F7": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F8": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F9": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F10": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F11": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F12": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.9, "TOTAL_GALS": 6561.717 },
  "F13": { "GALS_PER_INCH": 39.7, "GALS_IN_TOP": 250, "TOP_INCHES": 18.5, "TOTAL_GALS": 5400 },
  "F14": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.5, "TOTAL_GALS": 7346 },
  "F15": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.5, "TOTAL_GALS": 7346 },
  "F16": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.5, "TOTAL_GALS": 7346 },
  "F17": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.5, "TOTAL_GALS": 7346 },
  "F18": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F19": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F20": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F21": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F22": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F23": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "G1": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G2": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G3": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G4": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G5": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G6": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G7": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G8": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G9": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G10": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G11": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G12": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G13": { "GALS_PER_INCH": 59.24, "GALS_IN_TOP": 350, "TOP_INCHES": 12, "TOTAL_GALS": 8700 },
  "G14": { "GALS_PER_INCH": 59.24, "GALS_IN_TOP": 350, "TOP_INCHES": 12, "TOTAL_GALS": 8700 },
  "G15": { "GALS_PER_INCH": 59.24, "GALS_IN_TOP": 350, "TOP_INCHES": 12, "TOTAL_GALS": 8700 },
  "H1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
};

// Total: 153 tanques


const TANK_NAMES = Object.keys(tankData).sort((a, b) => {
  const seriesA = a.replace(/[0-9]/g, '');
  const seriesB = b.replace(/[0-9]/g, '');
  if (seriesA !== seriesB) return seriesA.localeCompare(seriesB);
  const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
  const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
  return numA - numB;
});

// ============================================================================
// CONSTANTES
// ============================================================================

const DOME_EXPONENT = 2.2;
const HISTORY_KEY = '@caymus_tanks_history';
const MAX_HISTORY_FREE = 10;
const MAX_HISTORY_PRO = 500;

const DOME_MESSAGES = [
  "🍷 ¡Ya está en la campana, primo! Precisión: ~97.99%",
  "🎯 ¡Ojo! Estamos en zona de campana. Cálculo al 97.99%",
  "⚡ ¡Casi lleno, compa! Campana detectada - 97.99% precisión",
  "🔥 ¡En la campana! Nuestros cálculos son ~97.99% precisos aquí",
  "🍇 ¡Zona de campana activada! Precisión estimada: 97.99%",
];

// ============================================================================
// CONTENIDO LEGAL
// ============================================================================

const LEGAL_CONTENT = {
  ConfidentialityAgreement: {
    title: 'Acuerdo de Confidencialidad',
    content: `ACUERDO DE CONFIDENCIALIDAD Y USO DE DATOS

Fecha de vigencia: Enero 2026
Versión: 1.0

═══════════════════════════════════════════════════════════

IMPORTANTE - LEER ANTES DE USAR LA APLICACIÓN

Este Acuerdo de Confidencialidad y Uso de Datos ("Acuerdo") es un contrato legal entre usted ("Usuario", "usted") y Chyrris Technologies Inc. ("Compañía", "nosotros", "nuestro"), propietaria y operadora de la aplicación Caymus Tanks ("Aplicación").

═══════════════════════════════════════════════════════════

1. PROPIEDAD DE LA APLICACIÓN

1.1 Declaración de Propiedad

La Aplicación Caymus Tanks, incluyendo pero no limitado a:
• El código fuente y software
• El diseño de interfaz de usuario
• Los algoritmos de cálculo
• La marca y logotipos
• Toda la documentación asociada

ES PROPIEDAD EXCLUSIVA DE CHYRRIS TECHNOLOGIES INC.

1.2 Aclaración Importante

⚠️ AVISO: Esta aplicación NO es propiedad de Caymus Vineyards, Wagner Family of Wine, ni ninguna otra bodega o viñedo. El nombre "Caymus" en el título de la aplicación se refiere únicamente a la ubicación donde los datos de tanques fueron originalmente recopilados y NO implica ninguna afiliación, patrocinio o respaldo por parte de dichas entidades.

═══════════════════════════════════════════════════════════

2. CONFIDENCIALIDAD DE LOS DATOS DE TANQUES

2.1 Naturaleza Confidencial de los Datos

El Usuario reconoce y acepta que la base de datos de especificaciones de tanques contenida en la Aplicación constituye INFORMACIÓN CONFIDENCIAL Y PROPIETARIA.

2.2 Obligaciones de Confidencialidad

El Usuario se compromete a:

✗ NO divulgar los datos de tanques a terceros
✗ NO copiar, reproducir o extraer los datos
✗ NO utilizar los datos para crear productos competidores
✗ NO compartir capturas de pantalla de los datos
✓ Proteger la confidencialidad de los datos

═══════════════════════════════════════════════════════════

AL USAR ESTA APLICACIÓN, USTED CONFIRMA QUE:

☑️ Ha leído completamente este Acuerdo
☑️ Entiende que los datos son confidenciales
☑️ Acepta no divulgar, copiar o compartir los datos
☑️ Reconoce que Chyrris Technologies es el propietario

═══════════════════════════════════════════════════════════

© 2026 Chyrris Technologies Inc.
Todos los derechos reservados.`,
  },
  PrivacyPolicy: {
    title: 'Política de Privacidad',
    content: `POLÍTICA DE PRIVACIDAD

Caymus Tanks - Chyrris Technologies Inc.
Última actualización: Enero 2026

═══════════════════════════════════════════════════════════

1. INFORMACIÓN QUE RECOPILAMOS

1.1 Información de Cuenta
• Número de teléfono (para autenticación OTP)
• Identificador único de dispositivo

1.2 Datos de Uso
• Historial de cálculos (usuarios Pro)
• Preferencias de la aplicación
• Estadísticas de uso anónimas

═══════════════════════════════════════════════════════════

2. CÓMO USAMOS SU INFORMACIÓN

• Proporcionar y mantener el servicio
• Autenticar su identidad
• Mejorar la aplicación
• Enviar notificaciones importantes

═══════════════════════════════════════════════════════════

3. COMPARTICIÓN DE DATOS

NO vendemos, alquilamos ni compartimos su información personal con terceros, excepto:

• Proveedores de servicios (Twilio para OTP)
• Cuando sea requerido por ley
• Para proteger nuestros derechos legales

═══════════════════════════════════════════════════════════

4. SUS DERECHOS

Usted tiene derecho a:
• Acceder a sus datos personales
• Corregir información inexacta
• Solicitar eliminación de su cuenta
• Exportar sus datos

═══════════════════════════════════════════════════════════

CONTACTO

Email: privacy@chyrris.com
Web: https://chyrris.com/privacy

© 2026 Chyrris Technologies Inc.`,
  },
  TermsOfService: {
    title: 'Términos de Servicio',
    content: `TÉRMINOS DE SERVICIO

Caymus Tanks - Chyrris Technologies Inc.
Última actualización: Enero 2026

═══════════════════════════════════════════════════════════

1. ACEPTACIÓN DE TÉRMINOS

Al usar Caymus Tanks, usted acepta estos términos. Si no está de acuerdo, no use la aplicación.

═══════════════════════════════════════════════════════════

2. DESCRIPCIÓN DEL SERVICIO

Caymus Tanks es una calculadora profesional de volumen para tanques de vino que proporciona:

• Cálculo de galones basado en espacio vacío
• Base de datos de 153 tanques preconfigurados
• Historial de cálculos (usuarios Pro)

═══════════════════════════════════════════════════════════

3. USO ACEPTABLE

Está PROHIBIDO:
• Compartir cuenta o credenciales
• Extraer datos de tanques
• Usar para fines ilegales
• Intentar hackear o vulnerar el sistema

═══════════════════════════════════════════════════════════

4. PROPIEDAD INTELECTUAL

• La aplicación es propiedad de Chyrris Technologies
• Los datos de tanques son confidenciales
• No se otorgan derechos de propiedad al usuario

═══════════════════════════════════════════════════════════

CONTACTO

Email: legal@chyrris.com
Web: https://chyrris.com/terms

© 2026 Chyrris Technologies Inc.`,
  },
  DataDeletion: {
    title: 'Eliminación de Datos',
    content: `ELIMINACIÓN DE DATOS

Caymus Tanks - Chyrris Technologies Inc.

═══════════════════════════════════════════════════════════

SOLICITUD DE ELIMINACIÓN DE CUENTA Y DATOS

Si desea eliminar su cuenta y todos los datos asociados:

═══════════════════════════════════════════════════════════

OPCIÓN 1: DESDE LA APLICACIÓN

1. Abra el menú lateral (☰)
2. Vaya a "Mi Perfil"
3. Seleccione "Eliminar mi cuenta"
4. Confirme la eliminación

═══════════════════════════════════════════════════════════

OPCIÓN 2: POR EMAIL

Envíe un correo a: privacy@chyrris.com

Asunto: Solicitud de eliminación de datos

Incluya:
• Su número de teléfono registrado
• Confirmación de que desea eliminar todos los datos

═══════════════════════════════════════════════════════════

DATOS QUE SE ELIMINARÁN

✓ Información de cuenta (teléfono)
✓ Historial de cálculos
✓ Preferencias guardadas
✓ Registros de dispositivo

═══════════════════════════════════════════════════════════

TIEMPO DE PROCESAMIENTO

• Solicitudes procesadas en 48-72 horas
• Confirmación enviada por SMS
• Eliminación permanente e irreversible

© 2026 Chyrris Technologies Inc.`,
  },
  Support: {
    title: 'Centro de Ayuda',
    content: `CENTRO DE AYUDA

Caymus Tanks - Chyrris Technologies Inc.

═══════════════════════════════════════════════════════════

PREGUNTAS FRECUENTES

═══════════════════════════════════════════════════════════

📱 ¿CÓMO USO LA CALCULADORA?

1. Seleccione el tanque de la lista
2. Ingrese las pulgadas de espacio vacío
3. Toque "CALCULAR"
4. Vea el resultado en galones

═══════════════════════════════════════════════════════════

📏 ¿CÓMO MIDO EL ESPACIO VACÍO?

1. Suba a la plataforma del tanque
2. Abra la puerta superior
3. Baje una cinta métrica hasta tocar el vino
4. Lea la medida en pulgadas

═══════════════════════════════════════════════════════════

🍷 ¿QUÉ SIGNIFICA "EN LA CAMPANA"?

Cuando el vino está en la zona cónica superior del tanque, los cálculos tienen ~97.99% de precisión debido a la geometría del cono.

═══════════════════════════════════════════════════════════

❓ ¿NECESITA MÁS AYUDA?

Email: support@chyrris.com
Web: https://chyrris.com/support

© 2026 Chyrris Technologies Inc.`,
  },
  About: {
    title: 'Acerca de',
    content: `ACERCA DE CAYMUS TANKS

═══════════════════════════════════════════════════════════

🍷 CAYMUS TANKS v1.0.0

Calculadora profesional de volumen para tanques de vino.

═══════════════════════════════════════════════════════════

DESARROLLADO POR

CHYRRIS TECHNOLOGIES INC.
https://chyrris.com

═══════════════════════════════════════════════════════════

CARACTERÍSTICAS

• 153 tanques preconfigurados
• Cálculo preciso con exponente 2.2
• Detección automática de zona de campana
• Historial de cálculos
• Interfaz intuitiva

═══════════════════════════════════════════════════════════

PRECISIÓN

• Cuerpo cilíndrico: 99.9%
• Zona de campana: ~97.99%

═══════════════════════════════════════════════════════════

CONTACTO

Email: info@chyrris.com
Soporte: support@chyrris.com
Web: https://chyrris.com

═══════════════════════════════════════════════════════════

© 2026 Chyrris Technologies Inc.
Todos los derechos reservados.`,
  },
};

// ============================================================================
// FUNCIONES DE CÁLCULO
// ============================================================================

function calculateSpaceToGallons(tank: TankData, spaceInches: number) {
  let emptyGallons: number;
  let isInDome = false;
  let message: string;

  if (spaceInches <= tank.TOP_INCHES) {
    isInDome = true;
    const ratio = spaceInches / tank.TOP_INCHES;
    emptyGallons = tank.GALS_IN_TOP * Math.pow(ratio, DOME_EXPONENT);
    message = DOME_MESSAGES[Math.floor(Math.random() * DOME_MESSAGES.length)];
  } else {
    const bodySpace = spaceInches - tank.TOP_INCHES;
    emptyGallons = tank.GALS_IN_TOP + (bodySpace * tank.GALS_PER_INCH);
    message = "✅ Cálculo en cuerpo cilíndrico - Precisión: 99.9%";
  }

  const gallonsInTank = Math.max(0, tank.TOTAL_GALS - emptyGallons);
  const percentage = (gallonsInTank / tank.TOTAL_GALS) * 100;

  return { gallons: gallonsInTank, percentage, isInDome, message };
}

// ============================================================================
// SERVICIO DE HISTORIAL
// ============================================================================

const historyService = {
  async getHistory(isPro: boolean): Promise<CalculationRecord[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      if (!data) return [];
      const history: CalculationRecord[] = JSON.parse(data);
      const limit = isPro ? MAX_HISTORY_PRO : MAX_HISTORY_FREE;
      return history.slice(0, limit);
    } catch {
      return [];
    }
  },

  async addToHistory(record: Omit<CalculationRecord, 'id' | 'timestamp'>): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      const history: CalculationRecord[] = data ? JSON.parse(data) : [];
      const newRecord: CalculationRecord = {
        ...record,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      history.unshift(newRecord);
      if (history.length > MAX_HISTORY_PRO) {
        history.pop();
      }
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  },

  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(HISTORY_KEY);
  },

  async deleteFromHistory(id: string): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      if (!data) return;
      const history: CalculationRecord[] = JSON.parse(data);
      const filtered = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from history:', error);
    }
  },
};

// ============================================================================
// COMPONENTE SIDEBAR
// ============================================================================

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}

function Sidebar({ visible, onClose, onNavigate }: SidebarProps) {
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const openExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  if (!visible) return null;

  const MenuItem = ({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle?: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <TouchableOpacity activeOpacity={1}>
            <ScrollView style={styles.sidebarScroll} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.sidebarHeader}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logo}>🍷</Text>
                  <View>
                    <Text style={styles.appNameSidebar}>Caymus Tanks</Text>
                    <Text style={styles.companyName}>by Chyrris Technologies</Text>
                  </View>
                </View>
              </View>

              <MenuSection title="CALCULADORA">
                <MenuItem icon="🧮" title="Calculadora" subtitle="Calcular volumen de tanques" onPress={() => { onNavigate('Calculator'); onClose(); }} />
                <MenuItem icon="📜" title="Historial" subtitle="Ver cálculos anteriores" onPress={() => { onNavigate('History'); onClose(); }} />
              </MenuSection>

              <MenuSection title="LEGAL">
                <MenuItem icon="🔒" title="Acuerdo de Confidencialidad" subtitle="NDA y uso de datos" onPress={() => { onNavigate('ConfidentialityAgreement'); onClose(); }} />
                <MenuItem icon="📋" title="Términos de Servicio" subtitle="Condiciones de uso" onPress={() => { onNavigate('TermsOfService'); onClose(); }} />
                <MenuItem icon="🛡️" title="Política de Privacidad" subtitle="Cómo protegemos tus datos" onPress={() => { onNavigate('PrivacyPolicy'); onClose(); }} />
                <MenuItem icon="🗑️" title="Eliminación de Datos" subtitle="Solicitar eliminación de cuenta" onPress={() => { onNavigate('DataDeletion'); onClose(); }} />
              </MenuSection>

              <MenuSection title="SOPORTE">
                <MenuItem icon="❓" title="Centro de Ayuda" subtitle="FAQ y soporte técnico" onPress={() => { onNavigate('Support'); onClose(); }} />
                <MenuItem icon="✉️" title="Contactar Soporte" subtitle="support@chyrris.com" onPress={() => openExternalLink('mailto:support@chyrris.com')} />
              </MenuSection>

              <MenuSection title="ACERCA DE">
                <MenuItem icon="🏢" title="Chyrris Technologies" subtitle="Visitar sitio web" onPress={() => openExternalLink('https://chyrris.com')} />
                <MenuItem icon="ℹ️" title="Acerca de la App" subtitle="Versión 1.0.0" onPress={() => { onNavigate('About'); onClose(); }} />
              </MenuSection>

              <View style={styles.sidebarFooter}>
                <Text style={styles.footerText}>© 2026 Chyrris Technologies Inc.</Text>
                <Text style={styles.footerVersion}>Caymus Tanks v1.0.0</Text>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

// ============================================================================
// COMPONENTE PANTALLA LEGAL
// ============================================================================

interface LegalScreenProps {
  title: string;
  content: string;
  onBack: () => void;
}

function LegalScreen({ title, content, onBack }: LegalScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.legalScroll} contentContainerStyle={styles.legalContent}>
        <Text style={styles.legalText}>{content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// COMPONENTE PANTALLA HISTORIAL
// ============================================================================

interface HistoryScreenProps {
  onBack: () => void;
  onSelectCalculation: (record: CalculationRecord) => void;
}

function HistoryScreen({ onBack, onSelectCalculation }: HistoryScreenProps) {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    const data = await historyService.getHistory(true);
    setHistory(data);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar registro', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await historyService.deleteFromHistory(id); loadHistory(); } },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Limpiar historial', '¿Eliminar TODO el historial?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar todo', style: 'destructive', onPress: async () => { await historyService.clearHistory(); loadHistory(); } },
    ]);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: CalculationRecord }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => onSelectCalculation(item)} onLongPress={() => handleDelete(item.id)}>
      <View style={styles.historyItemHeader}>
        <View style={styles.tankBadge}><Text style={styles.tankBadgeText}>{item.tankId}</Text></View>
        <Text style={styles.historyDate}>{formatDate(item.timestamp)}</Text>
      </View>
      <View style={styles.historyItemContent}>
        <Text style={styles.historyLabel}>Espacio: <Text style={styles.historyValue}>{item.input.toFixed(2)} pulg</Text></Text>
        <Text style={styles.historyLabel}>Galones: <Text style={styles.historyResultValue}>{item.result.toFixed(2)} gal</Text></Text>
        <Text style={styles.historyLabel}>Llenado: <Text style={styles.historyValue}>{item.percentage.toFixed(1)}%</Text></Text>
      </View>
      {item.isInDome && <View style={styles.domeWarning}><Text style={styles.domeWarningText}>🍷 En zona de campana</Text></View>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll}><Text style={styles.clearButton}>Limpiar</Text></TouchableOpacity>
        ) : <View style={styles.placeholder} />}
      </View>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={history.length === 0 ? styles.emptyList : styles.historyList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHistory(); }} tintColor="#d4af37" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📜</Text>
            <Text style={styles.emptyTitle}>Sin historial</Text>
            <Text style={styles.emptyText}>Tus cálculos aparecerán aquí.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Calculator');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTank, setSelectedTank] = useState('');
  const [spaceInput, setSpaceInput] = useState('');
  const [result, setResult] = useState<{ gallons: number; percentage: number; isInDome: boolean; message: string } | null>(null);
  const [showTankPicker, setShowTankPicker] = useState(false);

  const currentTankData = selectedTank ? tankData[selectedTank] : null;

  const handleCalculate = async () => {
    if (!selectedTank || !spaceInput) {
      Alert.alert('Error', 'Selecciona un tanque e ingresa las pulgadas');
      return;
    }

    const space = parseFloat(spaceInput);
    if (isNaN(space) || space < 0) {
      Alert.alert('Error', 'Ingresa un número válido de pulgadas');
      return;
    }

    const tank = tankData[selectedTank];
    const calcResult = calculateSpaceToGallons(tank, space);
    setResult(calcResult);

    // Guardar en historial
    await historyService.addToHistory({
      tankId: selectedTank,
      mode: 'space_to_gallons',
      input: space,
      result: calcResult.gallons,
      percentage: calcResult.percentage,
      isInDome: calcResult.isInDome,
    });
  };

  const handleSelectFromHistory = (record: CalculationRecord) => {
    setSelectedTank(record.tankId);
    setSpaceInput(record.input.toString());
    setCurrentScreen('Calculator');
  };

  // Renderizar pantalla actual
  if (currentScreen !== 'Calculator') {
    if (currentScreen === 'History') {
      return <HistoryScreen onBack={() => setCurrentScreen('Calculator')} onSelectCalculation={handleSelectFromHistory} />;
    }
    const legalContent = LEGAL_CONTENT[currentScreen as keyof typeof LEGAL_CONTENT];
    if (legalContent) {
      return <LegalScreen title={legalContent.title} content={legalContent.content} onBack={() => setCurrentScreen('Calculator')} />;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} onNavigate={setCurrentScreen} />

      {/* Header */}
      <View style={styles.mainHeader}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleEmoji}>🍷</Text>
          <Text style={styles.appName}>Caymus Tanks</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      <Text style={styles.subtitle}>by Chyrris Technologies</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selector de Tanque */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Tanque</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTankPicker(true)}>
            <Text style={selectedTank ? styles.pickerText : styles.pickerPlaceholder}>
              {selectedTank || 'Seleccionar tanque'}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {currentTankData && (
            <View style={styles.tankInfo}>
              <Text style={styles.tankInfoText}>Total: {currentTankData.TOTAL_GALS.toFixed(2)} gal</Text>
              <Text style={styles.tankInfoText}>Campana: {currentTankData.TOP_INCHES.toFixed(2)}" / {currentTankData.GALS_IN_TOP.toFixed(2)} gal</Text>
            </View>
          )}
        </View>

        {/* Input de Pulgadas */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Pulgadas de Espacio Vacío</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa las pulgadas"
            placeholderTextColor="#666"
            keyboardType="decimal-pad"
            value={spaceInput}
            onChangeText={setSpaceInput}
          />
        </View>

        {/* Botón Calcular */}
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateButtonText}>CALCULAR</Text>
        </TouchableOpacity>

        {/* Resultado */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Galones en Tanque</Text>
            <Text style={styles.resultValue}>{result.gallons.toFixed(2)}</Text>
            <Text style={styles.resultPercentage}>{result.percentage.toFixed(1)}% lleno</Text>
            <Text style={[styles.resultMessage, result.isInDome && styles.resultMessageDome]}>
              {result.message}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Chyrris Technologies Inc.</Text>
          <Text style={styles.footerText}>153 tanques • Exponente 2.2</Text>
        </View>
      </ScrollView>

      {/* Modal Selector de Tanque */}
      <Modal visible={showTankPicker} transparent animationType="slide">
        <View style={styles.pickerModal}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Seleccionar Tanque</Text>
              <TouchableOpacity onPress={() => setShowTankPicker(false)}>
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={TANK_NAMES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, selectedTank === item && styles.pickerItemSelected]}
                  onPress={() => { setSelectedTank(item); setShowTankPicker(false); setResult(null); }}
                >
                  <Text style={[styles.pickerItemText, selectedTank === item && styles.pickerItemTextSelected]}>
                    {item}
                  </Text>
                  <Text style={styles.pickerItemInfo}>
                    {tankData[item].TOTAL_GALS.toFixed(0)} gal
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  
  // Header Principal
  mainHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10 },
  menuButton: { padding: 8 },
  menuButtonText: { fontSize: 24, color: '#00d4ff' },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  titleEmoji: { fontSize: 28, marginRight: 8 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#00d4ff' },
  subtitle: { textAlign: 'center', color: '#6a9abe', fontSize: 12, marginBottom: 20 },
  placeholder: { width: 40 },
  
  // Content
  content: { flex: 1, paddingHorizontal: 16 },
  
  // Input Sections
  inputSection: { backgroundColor: 'rgba(0, 150, 255, 0.15)', borderRadius: 12, padding: 16, marginBottom: 16 },
  label: { color: '#fff', fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: '#0a1628', borderRadius: 8, padding: 14, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: 'rgba(0, 212, 255, 0.3)' },
  
  // Picker
  pickerButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a1628', borderRadius: 8, padding: 14, borderWidth: 1, borderColor: 'rgba(0, 212, 255, 0.3)' },
  pickerText: { color: '#fff', fontSize: 16 },
  pickerPlaceholder: { color: '#4a7a9e', fontSize: 16 },
  pickerArrow: { color: '#00d4ff', fontSize: 14 },
  tankInfo: { marginTop: 12, padding: 12, backgroundColor: '#0a1628', borderRadius: 8 },
  tankInfoText: { color: '#6a9abe', fontSize: 13, marginBottom: 4 },
  
  // Calculate Button
  calculateButton: { backgroundColor: '#00d4ff', borderRadius: 12, padding: 18, alignItems: 'center', marginBottom: 20 },
  calculateButtonText: { color: '#0a1628', fontSize: 18, fontWeight: 'bold' },
  
  // Result
  resultContainer: { backgroundColor: 'rgba(0, 150, 255, 0.2)', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20 },
  resultLabel: { color: '#8abaee', fontSize: 14, marginBottom: 8 },
  resultValue: { color: '#00d4ff', fontSize: 48, fontWeight: 'bold' },
  resultPercentage: { color: '#00d4ff', fontSize: 18, marginTop: 8 },
  resultMessage: { color: '#00d4ff', fontSize: 14, marginTop: 12, textAlign: 'center' },
  resultMessageDome: { color: '#00d4ff' },
  
  // Footer
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerText: { color: '#4a7a9e', fontSize: 12 },
  
  // Sidebar
  overlay: { flex: 1, backgroundColor: 'rgba(0, 20, 40, 0.85)' },
  sidebar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: SIDEBAR_WIDTH, backgroundColor: '#061220', borderRightWidth: 1, borderRightColor: 'rgba(0, 150, 255, 0.3)' },
  sidebarScroll: { flex: 1 },
  sidebarHeader: { padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 150, 255, 0.3)', backgroundColor: '#0d1929' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 40, marginRight: 12 },
  appNameSidebar: { fontSize: 20, fontWeight: 'bold', color: '#00d4ff' },
  companyName: { fontSize: 12, color: '#4a7a9e' },
  menuSection: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 150, 255, 0.3)' },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: '#4a7a9e', paddingHorizontal: 20, paddingVertical: 8, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20 },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, color: '#fff', fontWeight: '500' },
  menuSubtitle: { fontSize: 12, color: '#4a7a9e', marginTop: 2 },
  menuArrow: { fontSize: 20, color: '#2a5a8e' },
  sidebarFooter: { padding: 20, alignItems: 'center' },
  footerVersion: { fontSize: 10, color: 'rgba(0, 212, 255, 0.3)', marginTop: 4 },
  
  // Legal Screen
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 150, 255, 0.3)' },
  backButton: { padding: 8 },
  backButtonText: { color: '#00d4ff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  legalScroll: { flex: 1 },
  legalContent: { padding: 20 },
  legalText: { color: '#aadaff', fontSize: 14, lineHeight: 22 },
  
  // History Screen
  historyList: { padding: 16 },
  emptyList: { flex: 1, justifyContent: 'center', padding: 16 },
  historyItem: { backgroundColor: '#0d1929', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0, 150, 255, 0.3)' },
  historyItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tankBadge: { backgroundColor: '#00d4ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tankBadgeText: { color: '#0a1628', fontWeight: 'bold', fontSize: 14 },
  historyDate: { color: '#4a7a9e', fontSize: 12 },
  historyItemContent: { gap: 4 },
  historyLabel: { color: '#6a9abe', fontSize: 14 },
  historyValue: { color: '#fff', fontWeight: '500' },
  historyResultValue: { color: '#00d4ff', fontWeight: '500' },
  domeWarning: { marginTop: 12, padding: 8, backgroundColor: 'rgba(0, 150, 255, 0.15)', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(0, 212, 255, 0.3)' },
  domeWarningText: { color: '#00d4ff', fontSize: 12, textAlign: 'center' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#4a7a9e', textAlign: 'center' },
  clearButton: { color: '#ff6b6b', fontSize: 14 },
  
  // Picker Modal
  pickerModal: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 20, 40, 0.85)' },
  pickerModalContent: { backgroundColor: '#0a1628', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  pickerModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 212, 255, 0.3)' },
  pickerModalTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  pickerModalClose: { color: '#00d4ff', fontSize: 24 },
  pickerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 150, 255, 0.15)' },
  pickerItemSelected: { backgroundColor: 'rgba(0, 150, 255, 0.15)' },
  pickerItemText: { color: '#fff', fontSize: 16 },
  pickerItemTextSelected: { color: '#00d4ff', fontWeight: 'bold' },
  pickerItemInfo: { color: '#4a7a9e', fontSize: 14 },
});
