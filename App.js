import React, { useRef, useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import MapViewDirections from 'react-native-maps-directions';

export default function App() {
  const mapViewRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAiBEqg34lth8sXzOZZj__e7n9S4JUNJJE';
  useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  const CustomMarker = () => (
    <MaterialIcons name="location-on" size={32} color="red" />
  );
 
  const handleCurrentLocationPress = async () => {
    if (mapViewRef.current && location) {
      mapViewRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const destination = {latitude: 37.771707, longitude: -122.4053769};

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        initialRegion={region}
        showCompass={true}
        rotateEnabled={false}
        showUserLocation={true}
      >

        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Custom Marker"
          >
            <CustomMarker title="Your Location" />
          </Marker>
        )}
 {/* <MapViewDirections
    origin={location}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}

    
  /> */}
      </MapView>
 
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleCurrentLocationPress}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Current Location</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 8,
  },
  customMarkerContainer: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  customMarkerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
