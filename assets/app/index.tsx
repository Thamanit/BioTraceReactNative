import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
            <Button title='ไปหน้า Home' onPress={() => router.push('/screen/HomeScreen')} />
            <Button title='ไปหน้า Detail'
                onPress={() => router.push({
                    pathname: '/screen/DetailScreen',
                    params: {
                        name: 'anda',
                        age: 15
                    }
                })} />
        </View>
    )
}