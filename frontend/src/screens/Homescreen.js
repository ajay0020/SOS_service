import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const SOS_HOLD_TIME = 3000; // 3 seconds

export default function HomeScreen() {
  const timerRef = useRef(null);

  const startPress = () => {
    timerRef.current = setTimeout(triggerSOS, SOS_HOLD_TIME);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const triggerSOS = async () => {
    try {
      // 1️⃣ Location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Location permission is required for SOS");
        return;
      }

      // 2️⃣ Get live location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 3️⃣ Call backend SOS API
      await axios.post("http://YOUR_LOCAL_IP:5000/api/sos", {
        userId: "64b123456789abcdef123456",
        latitude,
        longitude
      });

      Alert.alert("SOS Sent", "Emergency contacts have been notified.");
    } catch (error) {
      Alert.alert("Error", "Failed to send SOS.");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={startPress}
        onPressOut={cancelPress}
        style={styles.sosButton}
      >
        <Text style={styles.sosText}>HOLD SOS</Text>
      </Pressable>

      <Text style={styles.info}>
        Hold for 3 seconds to send SOS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  },
  sosText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold"
  },
  info: {
    marginTop: 20,
    fontSize: 16,
    color: "#333"
  }
});
