import styles from "@/stylesheets/homeScreenEmptyStateStylesheet";
import React from "react";
import { Image, Text, View } from "react-native";

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/empty.png")} 
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>No recent audit yet</Text>
    </View>
  );
}

