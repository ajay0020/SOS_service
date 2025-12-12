// DriverTracker.js
// SIMPLE MVP VERSION — Driver live GPS → Firebase RTDB

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Temporary driver ID (Replace with login ID later)
const DRIVER_ID = "driver_" + Math.floor(Math.random() * 100000);

export default function DriverTracker() {
  const [tracking, setTracking] = useState(false);
  const watchIdRef = useRef(null);

  useEffect(() => {
    // Create a driver entry in Firebase
    database()
      .ref(`/drivers/${DRIVER_ID}`)
      .set({ online: false, createdAt: Date.now() });

    return () => stopTracking();
  }, []);

  const requestPermissions = async () => {
    const permission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_ALWAYS;

    try {
      const res = await request(permission);
      return res === RESULTS.GRANTED;
    } catch (err) {
      console.log("Permission Error:", err);
      return false;
    }
  };

  const startTracking = async () => {
    const allowed = await requestPermissions();

    if (!allowed) {
      return Alert.alert(
        "Permission Required",
        "Location permission is required to start tracking."
      );
    }

    // Mark driver online
    database().ref(`/drivers/${DRIVER_ID}`).update({
      online: true,
      lastSeen: Date.now(),
    });

    setTracking(true);

    // Start live location updates
    watchIdRef.current = Geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed } = pos.coords;
        const timestamp = pos.timestamp || Date.now();

        // Send location to Firebase
        database()
          .ref(`/drivers/${DRIVER_ID}/location`)
          .set({
            latitude,
            longitude,
            accuracy,
            speed: speed || 0,
            timestamp,
          });

        // Update last seen
        database()
          .ref(`/drivers/${DRIVER_ID}`)
          .update({
            lastSeen: timestamp,
            online: true,
          });
      },
      (error) => {
        console.log("Location Error:", error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 3000,
        fastestInterval: 2000,
        forceRequestLocation: true,
      }
    );
  };

  const stopTracking = () => {
    setTracking(false);

    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    database().ref(`/drivers/${DRIVER_ID}`).update({
      online: false,
      lastSeen: Date.now(),
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        Driver ID: {DRIVER_ID}
      </Text>

      <Text style={{ marginBottom: 15, fontSize: 16 }}>
        Tracking: {tracking ? "ON" : "OFF"}
      </Text>

      <Button
        title={tracking ? "Stop Tracking" : "Start Tracking"}
        onPress={tracking ? stopTracking : startTracking}
      />
    </View>
  );
}
