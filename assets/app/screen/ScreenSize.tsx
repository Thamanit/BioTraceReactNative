import { router } from "expo-router";
import { useWindowDimensions, View, Text, Button } from "react-native";

export default function ScreenSize() {
    const { width, height } = useWindowDimensions();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>width {width}</Text>
            <Text>height {height}</Text>

            <Button title='กลับหน้าแรก' onPress={() => router.back()} />
        </View>
    )
}