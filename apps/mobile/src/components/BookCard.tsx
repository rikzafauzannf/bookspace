import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Badge } from './Badge';

export interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: 'COLLECTION' | 'OPEN_TRADE' | 'AVAILABLE_FOR_RENT' | 'RENTED' | 'TRADED';
  condition: number;
  ownerName: string;
  ownerTrustScore: number;
  onPress?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  coverUrl,
  status,
  condition,
  ownerName,
  ownerTrustScore,
  onPress,
}) => {
  const getBadge = () => {
    switch (status) {
      case 'AVAILABLE_FOR_RENT':
        return <Badge label="Bisa Dipinjam" variant="available" />;
      case 'OPEN_TRADE':
        return <Badge label="Open Trade" variant="trade" />;
      case 'RENTED':
      default:
        return <Badge label="Sedang Dipinjam" variant="rented" />;
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
      {/* Cover Image Container */}
      <View style={styles.imageContainer}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📖</Text>
          </View>
        )}
        <View style={styles.badgeWrapper}>{getBadge()}</View>
      </View>

      {/* Book Metadata */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>

        <View style={styles.conditionRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.conditionText}>Kondisi {condition}/5</Text>
        </View>

        {/* Owner Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.ownerName} numberOfLines={1}>
            {ownerName}
          </Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{ownerTrustScore}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6D5C3',
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#5C4033',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F4EBE1',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  badgeWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C221E',
  },
  author: {
    fontSize: 12,
    color: '#7A685D',
    marginTop: 2,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  star: {
    color: '#D97706',
    fontSize: 12,
    marginRight: 2,
  },
  conditionText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4EBE1',
  },
  ownerName: {
    fontSize: 11,
    color: '#5C4033',
    fontWeight: '600',
    flex: 1,
  },
  scoreBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});
