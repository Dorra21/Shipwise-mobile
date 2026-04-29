import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/common/Card";
import { shipmentService } from "../api/shipmentService";

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

export const ShipmentListScreen = ({ navigation }) => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [searchQuery, statusFilter, shipments]);

  const fetchShipments = async () => {
    try {
      const data = await shipmentService.getShipments();
      setShipments(data);
      setFilteredShipments(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = shipments;

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.carrierName.toLowerCase().includes(q) ||
          s.originCountry.toLowerCase().includes(q) ||
          s.destinationCountry.toLowerCase().includes(q)
      );
    }

    setFilteredShipments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_transit":
        return colors.primary;
      case "pending":
        return colors.warning;
      case "delivered":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in_transit":
        return "In Transit";
      case "pending":
        return "Pending";
      case "delivered":
        return "Delivered";
      default:
        return status;
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
        return null;
    }
  };

  const renderShipment = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ShipmentDetail", { id: item.id })}
      activeOpacity={0.7}
    >
      <Card style={styles.shipmentCard}>
        {/* Header */}
        <View style={styles.shipmentHeader}>
          <Text style={styles.shipmentId}>{item.id}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "15" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View
              style={[styles.routeDot, { backgroundColor: colors.success }]}
            />
            <Text style={styles.routeText}>
              {item.originCity}, {item.originCountry}
            </Text>
          </View>
          <View style={styles.routeLineHorizontal}>
            <View style={styles.routeLineDash} />
            <Ionicons name="airplane" size={16} color={colors.primary} />
            <View style={styles.routeLineDash} />
          </View>
          <View style={styles.routePoint}>
            <View
              style={[styles.routeDot, { backgroundColor: colors.danger }]}
            />
            <Text style={styles.routeText}>
              {item.destinationCity}, {item.destinationCountry}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons
              name="business-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.detailText}>{item.carrierName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="cube-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.detailText}>{item.quantity} units</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="cash-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.detailText}>
              ${item.estimatedCost.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Incident Badge */}
        {item.incidentType && (
          <View
            style={[
              styles.incidentBadge,
              { backgroundColor: getIncidentColor(item.incidentType) + "15" },
            ]}
          >
            <Ionicons
              name={
                item.incidentType === "delayed"
                  ? "time-outline"
                  : item.incidentType === "damaged"
                  ? "alert-circle-outline"
                  : "help-circle-outline"
              }
              size={16}
              color={getIncidentColor(item.incidentType)}
            />
            <Text
              style={[
                styles.incidentText,
                { color: getIncidentColor(item.incidentType) },
              ]}
            >
              {item.incidentType.charAt(0).toUpperCase() +
                item.incidentType.slice(1)}
            </Text>
          </View>
        )}
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
        <Text style={styles.title}>Shipments</Text>
        <Text style={styles.subtitle}>{shipments.length} total shipments</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID, carrier, country..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter */}
      <View style={styles.filterRow}>
        {[
          { label: "All", value: "all" },
          { label: "In Transit", value: "in_transit" },
          { label: "Pending", value: "pending" },
          { label: "Delivered", value: "delivered" },
        ].map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[
              styles.filterButton,
              statusFilter === f.value && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter(f.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === f.value && styles.filterButtonTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredShipments}
        renderItem={renderShipment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="cube-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No shipments found</Text>
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 14,
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
  shipmentCard: {
    marginBottom: 10,
    padding: 16,
  },
  shipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  shipmentId: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  routeContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  routeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  routeLineHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
    marginVertical: 8,
  },
  routeLineDash: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  incidentBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  incidentText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
