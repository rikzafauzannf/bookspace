import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FDFBF7',
        },
        headerTintColor: '#5C4033',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}
