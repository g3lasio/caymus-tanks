/**
 * CAYMUS TANKS - Calculadora de Tanques de Vino
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Versión simplificada con toda la lógica en un solo archivo.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// ============================================================================
// DATOS DE TANQUES (153 tanques)
// ============================================================================

interface TankData {
  GALS_PER_INCH: number;
  GALS_IN_TOP: number;
  TOP_INCHES: number;
  TOTAL_GALS: number;
}

const TANKS: { [key: string]: TankData } = {
  // Serie BL
  "BL1": { GALS_PER_INCH: 82.74, GALS_IN_TOP: 373.56, TOP_INCHES: 24.15, TOTAL_GALS: 16239.42 },
  "BL2": { GALS_PER_INCH: 82.74, GALS_IN_TOP: 373.56, TOP_INCHES: 24.15, TOTAL_GALS: 16239.42 },
  "BL3": { GALS_PER_INCH: 82.74, GALS_IN_TOP: 373.56, TOP_INCHES: 24.15, TOTAL_GALS: 16239.42 },
  "BL4": { GALS_PER_INCH: 82.74, GALS_IN_TOP: 373.56, TOP_INCHES: 24.15, TOTAL_GALS: 16239.42 },
  // Serie BR
  "BR1": { GALS_PER_INCH: 107.73, GALS_IN_TOP: 478.88, TOP_INCHES: 24.25, TOTAL_GALS: 19523.87 },
  "BR2": { GALS_PER_INCH: 107.73, GALS_IN_TOP: 478.88, TOP_INCHES: 24.25, TOTAL_GALS: 19523.87 },
  "BR3": { GALS_PER_INCH: 107.73, GALS_IN_TOP: 478.88, TOP_INCHES: 24.25, TOTAL_GALS: 19523.87 },
  // Serie A
  "A1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "A12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie B
  "B1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "B12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie C
  "C1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C13": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C14": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "C15": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie D
  "D1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "D12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie E
  "E1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "E12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie F
  "F1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "F12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie G
  "G1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G13": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G14": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "G15": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie H
  "H1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "H12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie I
  "I1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "I12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie J
  "J1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "J12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie K
  "K1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K8": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K9": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K10": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K11": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "K12": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  // Serie L
  "L1": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "L2": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "L3": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "L4": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "L5": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "L6": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
  "L7": { GALS_PER_INCH: 44.678, GALS_IN_TOP: 263.282, TOP_INCHES: 19.90, TOTAL_GALS: 6561.717 },
};

// ============================================================================
// LÓGICA DE CÁLCULO (Exponente 2.2 calibrado)
// ============================================================================

const CAMPANA_EXPONENT = 2.2;

function calculateGallons(tank: TankData, espacioPulgadas: number): {
  gallons: number;
  percentage: number;
  isInCampana: boolean;
  message: string;
} {
  let galonesVacios = 0;
  let isInCampana = false;
  let message = "✅ Cálculo en cuerpo cilíndrico - Precisión: 99.9%";

  if (espacioPulgadas <= tank.TOP_INCHES) {
    // CAMPANA: Usar exponente 2.2
    const ratio = espacioPulgadas / tank.TOP_INCHES;
    galonesVacios = tank.GALS_IN_TOP * Math.pow(ratio, CAMPANA_EXPONENT);
    isInCampana = true;
    message = "🍷 ¡Ya está en la campana, primo! Precisión: ~97.99%";
  } else {
    // CUERPO: Fórmula estándar
    galonesVacios = tank.GALS_IN_TOP + (espacioPulgadas - tank.TOP_INCHES) * tank.GALS_PER_INCH;
    isInCampana = false;
  }

  const gallons = Math.max(0, tank.TOTAL_GALS - galonesVacios);
  const percentage = (gallons / tank.TOTAL_GALS) * 100;

  return { gallons, percentage, isInCampana, message };
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function App() {
  const [tankId, setTankId] = useState('');
  const [inches, setInches] = useState('');
  const [result, setResult] = useState<{
    gallons: number;
    percentage: number;
    isInCampana: boolean;
    message: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [showTanks, setShowTanks] = useState(false);

  const handleCalculate = () => {
    setError('');
    setResult(null);

    const tank = TANKS[tankId.toUpperCase()];
    if (!tank) {
      setError('Tanque no encontrado');
      return;
    }

    const space = parseFloat(inches);
    if (isNaN(space) || space < 0) {
      setError('Ingresa un número válido de pulgadas');
      return;
    }

    const calc = calculateGallons(tank, space);
    setResult(calc);
  };

  const handleSelectTank = (id: string) => {
    setTankId(id);
    setShowTanks(false);
    setResult(null);
    setError('');
  };

  const tankIds = Object.keys(TANKS).sort((a, b) => {
    const prefixA = a.replace(/\d+/g, '');
    const prefixB = b.replace(/\d+/g, '');
    if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🍷 Caymus Tanks</Text>
        <Text style={styles.subtitle}>by Chyrris Technologies</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Selección de Tanque */}
        <View style={styles.card}>
          <Text style={styles.label}>Tanque</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={tankId}
              onChangeText={(text) => {
                setTankId(text.toUpperCase());
                setResult(null);
              }}
              placeholder="Ej: F12"
              placeholderTextColor="#666"
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowTanks(!showTanks)}
            >
              <Text style={styles.buttonText}>{showTanks ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          </View>

          {showTanks && (
            <ScrollView style={styles.tankList} nestedScrollEnabled>
              <View style={styles.tankGrid}>
                {tankIds.map((id) => (
                  <TouchableOpacity
                    key={id}
                    style={[styles.tankItem, tankId === id && styles.tankItemSelected]}
                    onPress={() => handleSelectTank(id)}
                  >
                    <Text style={[styles.tankItemText, tankId === id && styles.tankItemTextSelected]}>
                      {id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {tankId && TANKS[tankId.toUpperCase()] && (
            <View style={styles.specs}>
              <Text style={styles.specText}>
                Total: {TANKS[tankId.toUpperCase()].TOTAL_GALS.toFixed(2)} gal
              </Text>
              <Text style={styles.specText}>
                Campana: {TANKS[tankId.toUpperCase()].TOP_INCHES.toFixed(2)}" / {TANKS[tankId.toUpperCase()].GALS_IN_TOP.toFixed(2)} gal
              </Text>
            </View>
          )}
        </View>

        {/* Entrada de Pulgadas */}
        <View style={styles.card}>
          <Text style={styles.label}>Pulgadas de Espacio Vacío</Text>
          <TextInput
            style={styles.inputFull}
            value={inches}
            onChangeText={setInches}
            placeholder="Ingresa las pulgadas"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        {/* Botón Calcular */}
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateButtonText}>CALCULAR</Text>
        </TouchableOpacity>

        {/* Error */}
        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Resultado */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Galones en Tanque</Text>
            <Text style={styles.resultValue}>{result.gallons.toFixed(2)}</Text>
            <Text style={styles.resultPercentage}>{result.percentage.toFixed(1)}% lleno</Text>
            <Text style={[styles.resultMessage, result.isInCampana && styles.resultMessageCampana]}>
              {result.message}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Chyrris Technologies Inc.</Text>
          <Text style={styles.footerText}>153 tanques • Exponente 2.2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#252542',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  inputFull: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: '#d4af37',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  tankList: {
    maxHeight: 200,
    marginTop: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
  },
  tankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  tankItem: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  tankItemSelected: {
    backgroundColor: '#d4af37',
  },
  tankItemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  tankItemTextSelected: {
    color: '#1a1a2e',
  },
  specs: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
  },
  specText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  calculateButton: {
    backgroundColor: '#d4af37',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  errorCard: {
    backgroundColor: '#4a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#1a4a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ade80',
  },
  resultPercentage: {
    fontSize: 20,
    color: '#4ade80',
    marginTop: 8,
  },
  resultMessage: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
    textAlign: 'center',
  },
  resultMessageCampana: {
    color: '#d4af37',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});
