import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";
import { colors } from "../../theme/colors";

export const AlertCard = ({ alert, onPress }) => {
  const getAlertIcon = () => {
    if (alert.type === "delay") return "time-outline";
    if (alert.type === "customs") return "alert-circle-outline";
    if (alert.type === "carrier") return "car-outline";
    return "information-circle-outline";
  };

  const getAlertColor = () => {
    if (alert.severity === "high") return colors.danger;
    if (alert.severity === "medium") return colors.warning;
    return colors.primary;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getAlertColor() + "20" },
          ]}
        >
          <Ionicons name={getAlertIcon()} size={24} color={getAlertColor()} />
        </View>
        <View style={styles.content}>
          <Text style={styles.message}>{alert.message}</Text>
          <Text style={styles.timestamp}>{alert.timestamp}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
