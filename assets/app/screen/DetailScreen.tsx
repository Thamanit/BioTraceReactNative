import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, View, Text } from "react-native";

export default function DetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Detail Screen</Text>
            <Text>Name: {params.name}</Text>
            <Text>Age: {params.age}</Text>
            <Button title='กลับหน้าแรก' onPress={() => router.back()} />
        </View>
    )
}