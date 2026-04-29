import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
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

export const AlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await mlService.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "high" || filter === "medium" || filter === "low")
      return alert.severity === filter;
    return alert.type === filter;
  });

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
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  const openDetail = (alert) => {
    setSelectedAlert(alert);
    setDetailModalVisible(true);
  };

  const renderFilterButton = (label, value) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderAlert = ({ item }) => (
    <TouchableOpacity onPress={() => openDetail(item)} activeOpacity={0.7}>
      <Card style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <View
            style={[
              styles.alertIconContainer,
              { backgroundColor: getIncidentColor(item.type) + "15" },
            ]}
          >
            <Ionicons
              name={getIncidentIcon(item.type)}
              size={24}
              color={getIncidentColor(item.type)}
            />
          </View>
          <View style={styles.alertInfo}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertShipment}>
              {item.shipmentId} • {item.carrierName} ({item.carrierNumber})
            </Text>
          </View>
        </View>

        <View style={styles.alertBadges}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getIncidentColor(item.type) + "15" },
            ]}
          >
            <Text
              style={[styles.typeText, { color: getIncidentColor(item.type) }]}
            >
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(item.severity) + "15" },
            ]}
          >
            <Text
              style={[
                styles.severityText,
                { color: getSeverityColor(item.severity) },
              ]}
            >
              {item.severity.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.alertMessage} numberOfLines={2}>
          {item.message}
        </Text>

        <View style={styles.alertFooter}>
          <View style={styles.alertRoute}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.alertRouteText}>
              {item.origin} → {item.destination}
            </Text>
          </View>
          <View style={styles.alertDate}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.alertDateText}>
              {formatDate(item.timestamp)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts & Incidents</Text>
        <Text style={styles.subtitle}>{alerts.length} total incidents</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {renderFilterButton("All", "all")}
        {renderFilterButton("🔴 High", "high")}
        {renderFilterButton("🟡 Medium", "medium")}
        {renderFilterButton("🟢 Low", "low")}
        {renderFilterButton("⏱ Delayed", "delayed")}
        {renderFilterButton("⚠️ Damaged", "damaged")}
        {renderFilterButton("❓ Lost", "lost")}
      </ScrollView>

      <FlatList
        data={filteredAlerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={colors.success}
            />
            <Text style={styles.emptyText}>No incidents found</Text>
            <Text style={styles.emptySubtext}>Everything looks good!</Text>
          </View>
        }
      />

      {/* ========== INCIDENT DETAIL MODAL ========== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Incident Details</Text>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                  <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>

              {selectedAlert && (
                <>
                  {/* Incident Type & Severity */}
                  <View style={styles.detailTypeSection}>
                    <View
                      style={[
                        styles.detailTypeIcon,
                        {
                          backgroundColor:
                            getIncidentColor(selectedAlert.type) + "15",
                        },
                      ]}
                    >
                      <Ionicons
                        name={getIncidentIcon(selectedAlert.type)}
                        size={40}
                        color={getIncidentColor(selectedAlert.type)}
                      />
                    </View>
                    <Text style={styles.detailTitle}>
                      {selectedAlert.title}
                    </Text>
                    <View style={styles.detailBadges}>
                      <View
                        style={[
                          styles.detailBadge,
                          {
                            backgroundColor:
                              getIncidentColor(selectedAlert.type) + "15",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailBadgeText,
                            { color: getIncidentColor(selectedAlert.type) },
                          ]}
                        >
                          {selectedAlert.type.charAt(0).toUpperCase() +
                            selectedAlert.type.slice(1)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.detailBadge,
                          {
                            backgroundColor:
                              getSeverityColor(selectedAlert.severity) + "15",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailBadgeText,
                            { color: getSeverityColor(selectedAlert.severity) },
                          ]}
                        >
                          {selectedAlert.severity.toUpperCase()} Severity
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Description</Text>
                    <Text style={styles.detailDescription}>
                      {selectedAlert.description}
                    </Text>
                  </View>

                  {/* Shipment Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>
                      Shipment Information
                    </Text>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="document-text-outline"
                        size={18}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.detailLabel}>Shipment ID</Text>
                      <Text style={styles.detailValue}>
                        {selectedAlert.shipmentId}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="business-outline"
                        size={18}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.detailLabel}>Carrier</Text>
                      <Text style={styles.detailValue}>
                        {selectedAlert.carrierName} (
                        {selectedAlert.carrierNumber})
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="cube-outline"
                        size={18}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailValue}>
                        {selectedAlert.quantity} units
                      </Text>
                    </View>
                  </View>

                  {/* Route */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Route</Text>
                    <View style={styles.routeContainer}>
                      <View style={styles.routePoint}>
                        <View
                          style={[
                            styles.routeDot,
                            { backgroundColor: colors.success },
                          ]}
                        />
                        <Text style={styles.routeText}>
                          {selectedAlert.origin}
                        </Text>
                      </View>
                      <View style={styles.routeLine} />
                      <View style={styles.routePoint}>
                        <View
                          style={[
                            styles.routeDot,
                            { backgroundColor: colors.danger },
                          ]}
                        />
                        <Text style={styles.routeText}>
                          {selectedAlert.destination}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Date & Time */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Date & Time</Text>
                    <View style={styles.dateTimeContainer}>
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color={colors.primary}
                      />
                      <Text style={styles.dateTimeText}>
                        {formatDate(selectedAlert.timestamp)}
                      </Text>
                    </View>
                  </View>

                  {/* View Shipment Button */}
                  <TouchableOpacity
                    style={styles.viewShipmentButton}
                    onPress={() => {
                      setDetailModalVisible(false);
                      navigation.navigate("Shipments", {
                        screen: "ShipmentDetail",
                        params: { id: selectedAlert.shipmentId },
                      });
                    }}
                  >
                    <Text style={styles.viewShipmentText}>
                      View Shipment Details
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    maxHeight: 50,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: "white",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  alertCard: {
    marginBottom: 10,
    padding: 16,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  alertShipment: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  alertBadges: {
    flexDirection: "row",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  alertMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  alertFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  alertRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  alertRouteText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  alertDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertDateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // ========== DETAIL MODAL ==========
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailModalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: "92%",
    maxWidth: 500,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  detailTypeSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  detailTypeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  detailBadges: {
    flexDirection: "row",
  },
  detailBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  routeContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginVertical: 6,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 12,
  },
  dateTimeText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 10,
  },
  viewShipmentButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  viewShipmentText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
