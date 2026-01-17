/**
 * Pantalla de Página Legal Genérica
 * 
 * Muestra contenido legal (Privacy, Terms, NDA, etc.)
 * en un formato legible y scrolleable.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface LegalPageScreenProps {
  title: string;
  content: string;
  onBack: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
  acceptButtonText?: string;
}

export default function LegalPageScreen({
  title,
  content,
  onBack,
  onAccept,
  showAcceptButton = false,
  acceptButtonText = 'Acepto',
}: LegalPageScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.content}>{content}</Text>
        
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Chyrris Technologies Inc.
          </Text>
          <Text style={styles.footerText}>
            Todos los derechos reservados.
          </Text>
        </View>
      </ScrollView>

      {/* Accept Button */}
      {showAcceptButton && onAccept && (
        <View style={styles.acceptContainer}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptButtonText}>{acceptButtonText}</Text>
          </TouchableOpacity>
        </View>
      )}
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
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
  },
  footerInfo: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  acceptContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  acceptButton: {
    backgroundColor: '#d4af37',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
