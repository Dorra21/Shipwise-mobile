import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/common/Card";
import { shipmentService } from "../api/shipmentService";
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

export const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [incidents, setIncidents] = useState([]);

  const fetchData = async () => {
    try {
      const [summary, alertsData] = await Promise.all([
        shipmentService.getDashboardSummary(),
        mlService.getAlerts(),
      ]);
      setDashboard(summary);
      setIncidents(alertsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case "delayed":
        return "time-outline";
      case "damaged":
        return "alert-circle-outline";
      case "lost":
        return "help-circle-outline";
      default:
        return "information-circle-outline";
    }
  };

  const getIncidentColor = (type) => {
    switch (type) {
      case "delayed":
        return colors.warning;
      case "damaged":
        return colors.danger;
      case "lost":
        return colors.purple;
      default:
        return colors.textSecondary;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return colors.danger;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Dashboard</Text>
              <Text style={styles.subtitle}>Shipment Overview</Text>
            </View>
            <Image
              source={require("../../assets/images/shi.jpeg")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Status Overview Cards - Stacked */}
        <View style={styles.metricsContainer}>
          {/* Active Shipments */}
          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View
                style={[
                  styles.metricIcon,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Ionicons
                  name="cube-outline"
                  size={28}
                  color={colors.primary}
                />
              </View>
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>In Transit</Text>
                <Text style={styles.metricValue}>
                  {dashboard?.activeShipments || 0}
                </Text>
              </View>
              <View
                style={[styles.statusDot, { backgroundColor: colors.primary }]}
              />
            </View>
          </Card>

          {/* Pending */}
          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View
                style={[
                  styles.metricIcon,
                  { backgroundColor: colors.warning + "15" },
                ]}
              >
                <Ionicons
                  name="hourglass-outline"
                  size={28}
                  color={colors.warning}
                />
              </View>
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>Pending</Text>
                <Text style={styles.metricValue}>
                  {dashboard?.pendingShipments || 0}
                </Text>
              </View>
              <View
                style={[styles.statusDot, { backgroundColor: colors.warning }]}
              />
            </View>
          </Card>

          {/* Delivered */}
          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View
                style={[
                  styles.metricIcon,
                  { backgroundColor: colors.success + "15" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={28}
                  color={colors.success}
                />
              </View>
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>Delivered</Text>
                <Text style={styles.metricValue}>
                  {dashboard?.deliveredShipments || 0}
                </Text>
              </View>
              <View
                style={[styles.statusDot, { backgroundColor: colors.success }]}
              />
            </View>
          </Card>

          {/* Total Cost */}
          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View
                style={[
                  styles.metricIcon,
                  { backgroundColor: colors.success + "15" },
                ]}
              >
                <Ionicons
                  name="cash-outline"
                  size={28}
                  color={colors.success}
                />
              </View>
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>Total Estimated Cost</Text>
                <Text style={styles.metricValue}>
                  ${dashboard?.totalCost?.toLocaleString() || 0}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Incidents Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incidents Summary</Text>
          <View style={styles.incidentSummaryRow}>
            <Card style={styles.incidentSummaryCard}>
              <View style={styles.incidentSummaryContent}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.warning}
                />
                <Text style={styles.incidentSummaryValue}>
                  {dashboard?.delayedCount || 0}
                </Text>
                <Text style={styles.incidentSummaryLabel}>Delayed</Text>
              </View>
            </Card>
            <Card style={styles.incidentSummaryCard}>
              <View style={styles.incidentSummaryContent}>
                <Ionicons
                  name="alert-circle-outline"
                  size={24}
                  color={colors.danger}
                />
                <Text style={styles.incidentSummaryValue}>
                  {dashboard?.damagedCount || 0}
                </Text>
                <Text style={styles.incidentSummaryLabel}>Damaged</Text>
              </View>
            </Card>
            <Card style={styles.incidentSummaryCard}>
              <View style={styles.incidentSummaryContent}>
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={colors.purple}
                />
                <Text style={styles.incidentSummaryValue}>
                  {dashboard?.lostCount || 0}
                </Text>
                <Text style={styles.incidentSummaryLabel}>Lost</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Recent Incidents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Incidents</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Alerts")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {incidents.slice(0, 3).map((incident) => (
            <TouchableOpacity
              key={incident.id}
              onPress={() =>
                navigation.navigate("Alerts", { selectedIncident: incident.id })
              }
              activeOpacity={0.7}
            >
              <Card style={styles.incidentCard}>
                <View style={styles.incidentHeader}>
                  <View
                    style={[
                      styles.incidentIconContainer,
                      {
                        backgroundColor: getIncidentColor(incident.type) + "15",
                      },
                    ]}
                  >
                    <Ionicons
                      name={getIncidentIcon(incident.type)}
                      size={24}
                      color={getIncidentColor(incident.type)}
                    />
                  </View>
                  <View style={styles.incidentInfo}>
                    <Text style={styles.incidentTitle}>{incident.title}</Text>
                    <Text style={styles.incidentShipment}>
                      {incident.shipmentId} • {incident.carrierName}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.severityBadge,
                      {
                        backgroundColor:
                          getSeverityColor(incident.severity) + "15",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        { color: getSeverityColor(incident.severity) },
                      ]}
                    >
                      {incident.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.incidentMessage} numberOfLines={2}>
                  {incident.message}
                </Text>
                <View style={styles.incidentFooter}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.incidentDate}>
                    {formatDate(incident.timestamp)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLogo: {
    width: 50,
    height: 50,
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
  metricsContainer: {
    paddingHorizontal: 20,
  },
  metricCard: {
    marginBottom: 10,
    padding: 16,
  },
  metricContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  metricText: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 12,
  },
  incidentSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  incidentSummaryCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
  },
  incidentSummaryContent: {
    alignItems: "center",
  },
  incidentSummaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
  },
  incidentSummaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  incidentCard: {
    marginBottom: 10,
    padding: 16,
  },
  incidentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  incidentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  incidentShipment: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  incidentMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  incidentFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  incidentDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});
