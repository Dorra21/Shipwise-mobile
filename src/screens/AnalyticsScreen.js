import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/common/Card";
import { mlService } from "../api/mlService";

const colors = {
  primary: "#2563eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#7c3aed",
  background: "#f8fafc",
  card: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
};

export const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await mlService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const totalIncidents = analytics.incidentsByType
    .filter((i) => i.name !== "No Incident")
    .reduce((sum, i) => sum + i.incidents, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Performance Analytics</Text>
          <Text style={styles.subtitle}>Last 30 Days</Text>
        </View>

        {/* On-Time Delivery Rate */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>On-Time Delivery Rate</Text>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.success}
            />
          </View>
          <View style={styles.bigMetric}>
            <Text style={[styles.bigMetricValue, { color: colors.success }]}>
              {analytics.onTimeRate}%
            </Text>
            <Text style={styles.bigMetricLabel}>
              {analytics.onTimeCount} of {analytics.totalShipments} shipments
              delivered on time
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${analytics.onTimeRate}%`,
                  backgroundColor: colors.success,
                },
              ]}
            />
          </View>
          {/* Weekly Breakdown */}
          <View style={styles.weeklyContainer}>
            <Text style={styles.weeklyTitle}>Weekly Breakdown</Text>
            {analytics.weeklyOnTimeRate.map((rate, index) => (
              <View key={index} style={styles.weeklyRow}>
                <Text style={styles.weeklyLabel}>Week {index + 1}</Text>
                <View style={styles.weeklyBarContainer}>
                  <View
                    style={[
                      styles.weeklyBar,
                      {
                        width: `${rate}%`,
                        backgroundColor:
                          rate >= 90
                            ? colors.success
                            : rate >= 80
                            ? colors.warning
                            : colors.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.weeklyValue}>{rate}%</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Cost Variance */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Cost Variance</Text>
            <Ionicons name="cash" size={24} color={colors.primary} />
          </View>
          <View style={styles.bigMetric}>
            <Text
              style={[
                styles.bigMetricValue,
                {
                  color:
                    analytics.avgCostVariance > 0
                      ? colors.danger
                      : colors.success,
                },
              ]}
            >
              {analytics.avgCostVariance > 0 ? "+" : ""}$
              {analytics.avgCostVariance}
            </Text>
            <Text style={styles.bigMetricLabel}>
              Average variance per shipment
            </Text>
          </View>
          {/* Weekly Cost Variance */}
          <View style={styles.weeklyContainer}>
            <Text style={styles.weeklyTitle}>Weekly Cost Variance</Text>
            {analytics.weeklyCostVariance.map((variance, index) => (
              <View key={index} style={styles.weeklyRow}>
                <Text style={styles.weeklyLabel}>Week {index + 1}</Text>
                <View style={styles.weeklyBarContainer}>
                  <View
                    style={[
                      styles.weeklyBar,
                      {
                        width: `${Math.abs(variance) / 3}%`,
                        backgroundColor:
                          variance > 0 ? colors.danger : colors.success,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.weeklyValue,
                    { color: variance > 0 ? colors.danger : colors.success },
                  ]}
                >
                  {variance > 0 ? "+" : ""}${variance}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Incident Rate by Type */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Incidents by Type</Text>
            <Ionicons name="pie-chart" size={24} color={colors.danger} />
          </View>
          <Text style={styles.totalIncidents}>
            {totalIncidents} total incidents
          </Text>
          {analytics.incidentsByType.map((incident, index) => (
            <View key={index} style={styles.incidentTypeRow}>
              <View style={styles.incidentTypeLeft}>
                <View
                  style={[
                    styles.incidentTypeDot,
                    { backgroundColor: incident.color },
                  ]}
                />
                <Text style={styles.incidentTypeName}>{incident.name}</Text>
              </View>
              <View style={styles.incidentTypeRight}>
                <View style={styles.incidentTypeBarContainer}>
                  <View
                    style={[
                      styles.incidentTypeBar,
                      {
                        width: `${
                          (incident.incidents / analytics.totalShipments) * 100
                        }%`,
                        backgroundColor: incident.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.incidentTypeCount}>
                  {incident.incidents}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Delay Trends */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Delay Trends</Text>
            <Ionicons name="trending-up" size={24} color={colors.warning} />
          </View>
          <View style={styles.trendRow}>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>This Month</Text>
              <Text style={[styles.trendValue, { color: colors.danger }]}>
                {analytics.delaysThisMonth}
              </Text>
              <Text style={styles.trendUnit}>delays</Text>
            </View>
            <View style={styles.trendDivider} />
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Last Month</Text>
              <Text style={styles.trendValue}>{analytics.delaysLastMonth}</Text>
              <Text style={styles.trendUnit}>delays</Text>
            </View>
            <View style={styles.trendDivider} />
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Change</Text>
              <View style={styles.trendChangeRow}>
                <Ionicons
                  name={
                    analytics.delayChange > 0 ? "trending-up" : "trending-down"
                  }
                  size={20}
                  color={
                    analytics.delayChange > 0 ? colors.danger : colors.success
                  }
                />
                <Text
                  style={[
                    styles.trendValue,
                    {
                      color:
                        analytics.delayChange > 0
                          ? colors.danger
                          : colors.success,
                    },
                  ]}
                >
                  {analytics.delayChange > 0 ? "+" : ""}
                  {analytics.delayChange}%
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  bigMetric: {
    alignItems: "center",
    marginBottom: 16,
  },
  bigMetricValue: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bigMetricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  weeklyContainer: {
    marginTop: 8,
  },
  weeklyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  weeklyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  weeklyLabel: {
    width: 60,
    fontSize: 13,
    color: colors.textSecondary,
  },
  weeklyBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  weeklyBar: {
    height: "100%",
    borderRadius: 4,
  },
  weeklyValue: {
    width: 50,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
  },
  totalIncidents: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  incidentTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  incidentTypeLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  incidentTypeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  incidentTypeName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  incidentTypeRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  incidentTypeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  incidentTypeBar: {
    height: "100%",
    borderRadius: 4,
  },
  incidentTypeCount: {
    width: 30,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "right",
  },
  trendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  trendItem: {
    alignItems: "center",
    flex: 1,
  },
  trendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  trendValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  trendUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  trendDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
  },
  trendChangeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
