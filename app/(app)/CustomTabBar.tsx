// app/(app)/CustomTabBar.tsx

import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"

export default function CustomTabBar({ state, descriptors, navigation }: {
    state: any,
    descriptors: any,
    navigation: any
}) {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLable !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;
                const isFocused = state.index === index;

                if (route.name === 'profile') {
                    return (
                        <TouchableOpacity key={route.key}
                            accessibilityRole="button"
                            style={styles.fabButton}
                            onPress={() => navigation.navigate(route.name)}
                        >
                            <Ionicons name="add" size={35} color='#fff' />
                        </TouchableOpacity>
                    )
                }

                return (
                    <TouchableOpacity key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        style={styles.tabButton}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        {options.tabBarIcon &&
                            options.tabBarIcon({
                                focused: isFocused,
                                color: isFocused ? '#1976d2' : '#888',
                                size: 24
                            })}
                        <Text style={{ color: isFocused ? '#1976d2' : '#888', fontSize: 12 }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: '#222',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 10
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    fabButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#e91e63',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    }
})