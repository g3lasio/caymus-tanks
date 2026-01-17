import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TankVisualProps {
  fillPercentage: number;
}

export default function TankVisual({ fillPercentage }: TankVisualProps) {
  const fillHeight = Math.max(0, Math.min(100, fillPercentage));

  return (
    <View style={styles.container}>
      <View style={styles.tankContainer}>
        <View style={styles.tank}>
          <View style={[styles.fill, { height: `${fillHeight}%` }]}>
            <LinearGradient
              colors={['#8B0000', '#6B0000', '#4B0000']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
          <View style={styles.emptySpace} />
        </View>
        
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{fillHeight.toFixed(1)}%</Text>
          <Text style={styles.percentageLabel}>Llenado</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  tankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  tank: {
    width: 100,
    height: 200,
    borderWidth: 2,
    borderColor: '#d4af37',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 4,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  emptySpace: {
    flex: 1,
  },
  percentageContainer: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  percentageLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});
