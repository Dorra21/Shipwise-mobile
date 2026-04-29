import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";

// Define colors directly in this file
const colors = {
  primary: "#2563eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#1e293b",
  textSecondary: "#64748b",
};

export const MetricCard = ({ title, value, icon, iconColor, trend, style }) => {
  return (
    <Card style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconColor + "20" },
            ]}
          >
            <Ionicons name={icon} size={28} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        </View>
        {trend && (
          <View style={styles.trend}>
            <Ionicons
              name={trend > 0 ? "trending-up" : "trending-down"}
              size={18}
              color={trend > 0 ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.trendText,
                { color: trend > 0 ? colors.success : colors.danger },
              ]}
            >
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  trend: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});
