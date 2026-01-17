/**
 * Pantalla de Suscripción / Paywall
 * 
 * Muestra los planes de suscripción disponibles y permite
 * al usuario comprar o restaurar suscripciones.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '../hooks/useSubscription';

interface SubscriptionScreenProps {
  onClose: () => void;
  onSubscribed?: () => void;
}

export default function SubscriptionScreen({
  onClose,
  onSubscribed,
}: SubscriptionScreenProps) {
  const {
    status,
    packages,
    isLoading,
    error,
    loadPackages,
    purchase,
    restore,
    isPro,
  } = useSubscription();

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [processingPurchase, setProcessingPurchase] = useState(false);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Si ya es Pro, mostrar mensaje de agradecimiento
  if (isPro) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.thankYouContainer}>
          <Text style={styles.thankYouEmoji}>🎉</Text>
          <Text style={styles.thankYouTitle}>¡Gracias por ser Pro!</Text>
          <Text style={styles.thankYouText}>
            Tienes acceso completo a todas las funciones de Caymus Tanks.
          </Text>
          {status.expiresAt && (
            <Text style={styles.expiresText}>
              Tu suscripción {status.willRenew ? 'se renueva' : 'expira'} el{' '}
              {status.expiresAt.toLocaleDateString()}
            </Text>
          )}
          <TouchableOpacity style={styles.closeFullButton} onPress={onClose}>
            <Text style={styles.closeFullButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setProcessingPurchase(true);
    const success = await purchase(pkg);
    setProcessingPurchase(false);

    if (success) {
      Alert.alert(
        '¡Bienvenido a Pro!',
        'Ahora tienes acceso a todas las funciones premium.',
        [{ text: 'OK', onPress: onSubscribed }]
      );
    }
  };

  const handleRestore = async () => {
    setProcessingPurchase(true);
    const restored = await restore();
    setProcessingPurchase(false);

    if (restored) {
      Alert.alert(
        'Compras restauradas',
        'Tu suscripción ha sido restaurada exitosamente.',
        [{ text: 'OK', onPress: onSubscribed }]
      );
    } else {
      Alert.alert(
        'Sin compras previas',
        'No encontramos suscripciones anteriores asociadas a tu cuenta.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Caymus Tanks Pro</Text>
          <Text style={styles.heroSubtitle}>
            Desbloquea todo el potencial de tu calculadora de tanques
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Incluye:</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Historial de Cálculos</Text>
              <Text style={styles.featureDesc}>Guarda y revisa todos tus cálculos anteriores</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>☁️</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Sincronización en la Nube</Text>
              <Text style={styles.featureDesc}>Accede a tus datos desde cualquier dispositivo</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📄</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Exportar Reportes</Text>
              <Text style={styles.featureDesc}>Genera reportes PDF de tus cálculos</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Múltiples Dispositivos</Text>
              <Text style={styles.featureDesc}>Usa la app en todos tus dispositivos</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Modo Sin Conexión</Text>
              <Text style={styles.featureDesc}>Funciona sin internet</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Soporte Prioritario</Text>
              <Text style={styles.featureDesc}>Respuesta rápida a tus consultas</Text>
            </View>
          </View>
        </View>

        {/* Packages */}
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>Elige tu plan:</Text>

          {isLoading && packages.length === 0 ? (
            <ActivityIndicator color="#d4af37" size="large" style={styles.loader} />
          ) : (
            <>
              {packages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.packageCard,
                    selectedPackage === pkg.id && styles.packageCardSelected,
                  ]}
                  onPress={() => setSelectedPackage(pkg.id)}
                  disabled={processingPurchase}
                >
                  <View style={styles.packageHeader}>
                    <Text style={styles.packageTitle}>{pkg.title}</Text>
                    {pkg.id.includes('yearly') && (
                      <View style={styles.saveBadge}>
                        <Text style={styles.saveBadgeText}>AHORRA 40%</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                  {pkg.pricePerMonth && (
                    <Text style={styles.packagePricePerMonth}>{pkg.pricePerMonth}</Text>
                  )}
                  <Text style={styles.packageDesc}>{pkg.description}</Text>
                </TouchableOpacity>
              ))}

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.purchaseButton,
                  (!selectedPackage || processingPurchase) && styles.purchaseButtonDisabled,
                ]}
                onPress={() => {
                  const pkg = packages.find((p) => p.id === selectedPackage);
                  if (pkg) handlePurchase(pkg.package);
                }}
                disabled={!selectedPackage || processingPurchase}
              >
                {processingPurchase ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.purchaseButtonText}>SUSCRIBIRSE</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Restore & Terms */}
        <View style={styles.footerSection}>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={processingPurchase}
          >
            <Text style={styles.restoreButtonText}>Restaurar compras</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            La suscripción se renueva automáticamente. Puedes cancelar en cualquier momento
            desde la configuración de tu dispositivo.{'\n\n'}
            Al suscribirte, aceptas nuestros{' '}
            <Text style={styles.termsLink}>Términos de Servicio</Text> y{' '}
            <Text style={styles.termsLink}>Política de Privacidad</Text>.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Chyrris Technologies</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 50,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  featureDesc: {
    fontSize: 14,
    color: '#888',
  },
  packagesSection: {
    marginBottom: 24,
  },
  loader: {
    marginVertical: 40,
  },
  packageCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  packageCardSelected: {
    borderColor: '#d4af37',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  saveBadge: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saveBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 4,
  },
  packagePricePerMonth: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  packageDesc: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#331111',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  purchaseButton: {
    backgroundColor: '#d4af37',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerSection: {
    alignItems: 'center',
  },
  restoreButton: {
    padding: 16,
  },
  restoreButtonText: {
    color: '#d4af37',
    fontSize: 14,
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#d4af37',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  thankYouContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  thankYouEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  thankYouTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 16,
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  expiresText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  closeFullButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  closeFullButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
