import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'available' | 'trade' | 'rented';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'available' }) => {
  const getColors = () => {
    switch (variant) {
      case 'available':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'trade':
        return { bg: '#FFF8E1', text: '#F57F17' };
      case 'rented':
      default:
        return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
