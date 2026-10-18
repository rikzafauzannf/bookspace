import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Page() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>TukarBuku</Text>
      <Text style={styles.subtitle}>
        Sirkulasi buku fisik dengan hangat, aman, dan mudah.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Jelajahi Buku Terdekat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C4033',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7A685D',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#5C4033',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
