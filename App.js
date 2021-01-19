import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

export default function App() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userPosition, setUserPosition] = useState({});
  const [address, setAddress] = useState([]);

  const verifyLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permissão concedida');
        setHasLocationPermission(true);
      } else {
        console.error('permissão negada');
        setHasLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const getGoogleData = async () => {
    try {
      const data = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: userPosition.latitude + ',' + userPosition.longitude,
          key: '',
        }
      })

      setAddress(data.data.results[0].address_components)
    } catch (err) {
      console.warn(err)
    }

  }

  useEffect(() => {
    verifyLocationPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.log(error.code, error.message);
        }
      );
    }
  }, [hasLocationPermission]);

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <TouchableOpacity onPress={getGoogleData} style={{ height: 60, backgroundColor: '#F1575F', justifyContent: 'center', alignItems: 'center', width: 175, borderRadius: 15 }}>
        <Text style={{ color: '#FFF', fontSize: 17 }}>Geolocalização</Text>
      </TouchableOpacity>

      <Text>Latitude: {userPosition.latitude}</Text>
      <Text>longitude: {userPosition.longitude}</Text>
      {address.length > 0 &&
        <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text> Endereço: {address[1].long_name}</Text>
          <Text>Numero: {address[0].long_name}</Text>
        </View>
      }

    </View>
  );
}

