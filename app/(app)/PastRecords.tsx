// // app/(app)/PastRecords.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiURL } from '@/lib/route';

const { height } = Dimensions.get('window');

type Result = {
  prediction: string;
  timestamp?: string;
  userEmail?: string;
  level?: string;
  description?: string;
};

export default function PastRecords() {
  const router = useRouter();
  const { username } = useLocalSearchParams();

  const [results, setResults] = useState<Result[]>([]);

  const fetchResults = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(getApiURL() + "/ml/results/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching eye results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleLogout = () => {
    router.replace('/LoginScreen');
  };

  const handleGoHome = () => {
    router.replace({ pathname: '/home', params: { username } });
  };

  const latestResult = Object.values(results)
    .sort((a, b) => new Date(b.timestamp as any).getTime() - new Date(a.timestamp as any).getTime())[0];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0fa36b" barStyle="light-content" translucent={false} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftMenu}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoHome}>
              <Text style={styles.backText}>Home</Text>
            </TouchableOpacity>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          </View>

          <View style={styles.rightMenu}>
            <Text style={styles.menuItem}>
              {username?.toString().toUpperCase() || 'USER'}
            </Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Past Records</Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          <Text style={styles.bold}>Email</Text> {latestResult?.userEmail || 'N/A'}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Prediction</Text> {latestResult?.prediction || 'N/A'}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Level</Text> {latestResult?.level || 'N/A'}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Description</Text>
        </Text>
        <Text style={styles.recommend}>{latestResult?.description || 'N/A'}</Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Timestamp</Text> {new Date(latestResult?.timestamp as any)?.toLocaleString()}
        </Text>
      </View>

      <View style={styles.greenBackground} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  header: {
    backgroundColor: '#0fa36b',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    padding: 5,
    paddingRight: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 60,
    height: 50,
    resizeMode: 'contain',
  },
  rightMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItem: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#d62828',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#277c59',
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#2ea87b',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    borderWidth: 2,
    borderColor: '#000',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  recommend: {
    color: '#fff',
    fontSize: 15,
    marginTop: -6,
    marginBottom: 6,
    paddingLeft: 10,
  },
  greenBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 2,
    backgroundColor: '#1ca06f',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: -1,
    zIndex: -1,
  },
});


// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';

// const { height } = Dimensions.get('window');

// export default function PastRecords() {
//   const router = useRouter();
//   const { username } = useLocalSearchParams();

//   const handleLogout = () => {
//     router.replace('/LoginScreen');
//   };

//   const handleGoHome = () => {
//     router.replace({ pathname: '/home', params: { username } });
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#0fa36b" barStyle="light-content" translucent={false} />

//       <View style={styles.header}>
//         <View style={styles.headerRow}>
//           <View style={styles.leftMenu}>
//             <TouchableOpacity style={styles.backButton} onPress={handleGoHome}>
//               <Text style={styles.backText}>Home</Text>
//             </TouchableOpacity>
//             <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
//           </View>

//           <View style={styles.rightMenu}>
//             <Text style={styles.menuItem}>
//               {username?.toString().toUpperCase() || 'USER'}
//             </Text>
//             <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//               <Text style={styles.logoutText}>LOGOUT</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       <Text style={styles.title}>Past Records</Text>

//       <View style={styles.card}>
//         <Text style={styles.label}>
//           <Text style={styles.bold}>Name</Text>   Habibi Mena
//         </Text>
//         <Text style={styles.label}>
//           <Text style={styles.bold}>Age</Text>   33
//         </Text>
//         <Text style={styles.label}>
//           <Text style={styles.bold}>Status</Text>   25% Chances of having diabetes
//         </Text>
//         <Text style={styles.label}>
//           <Text style={styles.bold}>Recommendation</Text>
//         </Text>
//         <Text style={styles.recommend}>Advise a healthy diet{'\n'}and exercise</Text>
//       </View>
//       <View style={styles.greenBackground} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     position: 'relative', 
//   },
//   header: {
//     backgroundColor: '#0fa36b',
//     paddingTop: Platform.OS === 'android' ? 40 : 60,
//     paddingBottom: 20,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   leftMenu: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   backButton: {
//     padding: 5,
//     paddingRight: 10,
//   },
//   backText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   logo: {
//     width: 60,
//     height: 50,
//     resizeMode: 'contain',
//   },
//   rightMenu: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   menuItem: {
//     color: '#fff',
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   logoutButton: {
//     backgroundColor: '#d62828',
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },
//   logoutText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#277c59',
//     marginTop: 30,
//     marginBottom: 20,
//     alignSelf: 'center',
//   },
//   card: {
//     backgroundColor: '#2ea87b',
//     borderRadius: 12,
//     padding: 20,
//     width: '85%',
//     borderWidth: 2,
//     borderColor: '#000',
//     alignSelf: 'center',
//   },
//   label: {
//     fontSize: 16,
//     color: '#fff',
//     marginBottom: 8,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
//   recommend: {
//     color: '#fff',
//     fontSize: 15,
//     marginTop: -6,
//     marginBottom: 6,
//     paddingLeft: 10,
//   },
//   greenBackground: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: height / 2,
//     backgroundColor: '#1ca06f',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     elevation: -1,

//     zIndex: -1,
//   },
// });
