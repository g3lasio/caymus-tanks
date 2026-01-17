/**
 * Pantalla de Historial de Cálculos
 * 
 * Muestra el historial de cálculos del usuario con
 * opciones de filtrado y eliminación.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import historyService, { CalculationRecord, HistoryStats } from '../services/historyService';

interface HistoryScreenProps {
  onBack: () => void;
  onSelectCalculation?: (record: CalculationRecord) => void;
  isPro?: boolean;
}

export default function HistoryScreen({
  onBack,
  onSelectCalculation,
  isPro = false,
}: HistoryScreenProps) {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        historyService.getHistory(isPro),
        historyService.getHistoryStats(),
      ]);
      setHistory(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [isPro]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar registro',
      '¿Estás seguro de que quieres eliminar este cálculo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await historyService.deleteFromHistory(id);
            loadHistory();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar historial',
      '¿Estás seguro de que quieres eliminar TODO el historial? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todo',
          style: 'destructive',
          onPress: async () => {
            await historyService.clearHistory();
            loadHistory();
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: CalculationRecord }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => onSelectCalculation?.(item)}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.itemHeader}>
        <View style={styles.tankBadge}>
          <Text style={styles.tankBadgeText}>{item.tankId}</Text>
        </View>
        <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>
            {item.mode === 'space_to_gallons' ? 'Espacio:' : 'Galones deseados:'}
          </Text>
          <Text style={styles.itemValue}>
            {item.input.toFixed(2)} {item.mode === 'space_to_gallons' ? 'pulg' : 'gal'}
          </Text>
        </View>
        
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>
            {item.mode === 'space_to_gallons' ? 'Galones:' : 'Espacio necesario:'}
          </Text>
          <Text style={[styles.itemValue, styles.resultValue]}>
            {item.result.toFixed(2)} {item.mode === 'space_to_gallons' ? 'gal' : 'pulg'}
          </Text>
        </View>
        
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Llenado:</Text>
          <Text style={styles.itemValue}>{item.percentage.toFixed(1)}%</Text>
        </View>
      </View>

      {item.isInDome && (
        <View style={styles.domeWarning}>
          <Text style={styles.domeWarningText}>🍷 En zona de campana (~97.99%)</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📜</Text>
      <Text style={styles.emptyTitle}>Sin historial</Text>
      <Text style={styles.emptyText}>
        Tus cálculos aparecerán aquí después de usar la calculadora.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      {stats && stats.totalCalculations > 0 && (
        <>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalCalculations}</Text>
            <Text style={styles.statLabel}>Cálculos</Text>
          </View>
          {stats.mostUsedTank && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.mostUsedTank}</Text>
              <Text style={styles.statLabel}>Más usado</Text>
            </View>
          )}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.averagePercentage.toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Promedio</Text>
          </View>
        </>
      )}
      
      {!isPro && history.length > 0 && (
        <View style={styles.proPrompt}>
          <Text style={styles.proPromptText}>
            ⭐ Actualiza a Pro para ver historial completo
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={history.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#d4af37"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#d4af37',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#ff4444',
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  proPrompt: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  proPromptText: {
    fontSize: 12,
    color: '#d4af37',
  },
  historyItem: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tankBadge: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tankBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemDate: {
    color: '#666',
    fontSize: 12,
  },
  itemContent: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLabel: {
    color: '#888',
    fontSize: 14,
  },
  itemValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  resultValue: {
    color: '#d4af37',
  },
  domeWarning: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#1a1a0a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333300',
  },
  domeWarningText: {
    color: '#d4af37',
    fontSize: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
