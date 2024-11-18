import React, { useState, useEffect } from "react";
import { Marker, Callout } from "react-native-maps";
import { View, Text, StyleSheet } from "react-native";
import colorPalette from "@/utils/colorPalette";
import LottieView from "lottie-react-native";

export const CustomMapMarker = ({
  marker,
}: {
  marker: { id: string; title: string; latitude: number; longitude: number };
}) => {
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${marker.title}?fullText=true`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setCountryData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryData();
  }, [marker.title]);

  return (
    <Marker
      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
      title={marker.title}
    >
      <Callout style={styles.calloutContainer}>
        <View style={{ width: "100%", height: "100%" }}>
          <Text style={styles.calloutTitle}>{marker.title}</Text>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                source={require("../assets/animations/coffee_pour.json")}
                autoPlay
                loop
                style={{ width: 50, height: 50 }}
              />
              <Text style={styles.calloutDescription}>Loading data...</Text>
            </View>
          ) : (
            countryData && (
              <>
                {countryData.currencies &&
                  Object.keys(countryData.currencies).map((currencyKey) => (
                    <View key={currencyKey}>
                      <Text style={styles.calloutDescription}>
                        <Text style={{ fontWeight: "bold" }}>Currency:</Text>{" "}
                        {countryData.currencies[currencyKey].name}
                      </Text>
                      <Text style={styles.calloutDescription}>
                        <Text style={{ fontWeight: "bold" }}>Code:</Text>{" "}
                        {currencyKey}
                      </Text>
                      <Text style={styles.calloutDescription}>
                        <Text style={{ fontWeight: "bold" }}>Symbol:</Text>{" "}
                        {countryData.currencies[currencyKey].symbol}
                      </Text>
                    </View>
                  ))}
              </>
            )
          )}
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    height: 100,
  },
  calloutTitle: {
    fontWeight: "bold",
    color: colorPalette.accent,
    marginBottom: 4,
    fontSize: 18,
    textAlign: "center",
  },
  calloutDescription: {
    color: colorPalette.primary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
});
