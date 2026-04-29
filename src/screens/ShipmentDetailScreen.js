import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
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

// Simple Map Component using iframe for web
const ShipmentMap = ({
  origin,
  destination,
  originCoords,
  destinationCoords,
}) => {
  if (Platform.OS === "web") {
    // Use Google Maps embed or OpenStreetMap for web
    const midLat = (originCoords.lat + destinationCoords.lat) / 2;
    const midLng = (originCoords.lng + destinationCoords.lng) / 2;

    // Calculate zoom based on distance
    const latDiff = Math.abs(originCoords.lat - destinationCoords.lat);
    const lngDiff = Math.abs(originCoords.lng - destinationCoords.lng);
    const maxDiff = Math.max(latDiff, lngDiff);
    let zoom = 2;
    if (maxDiff < 10) zoom = 5;
    else if (maxDiff < 30) zoom = 4;
    else if (maxDiff < 60) zoom = 3;

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      Math.min(originCoords.lng, destinationCoords.lng) - 5
    },${Math.min(originCoords.lat, destinationCoords.lat) - 5},${
      Math.max(originCoords.lng, destinationCoords.lng) + 5
    },${
      Math.max(originCoords.lat, destinationCoords.lat) + 5
    }&layer=mapnik&marker=${originCoords.lat},${originCoords.lng}&marker=${
      destinationCoords.lat
    },${destinationCoords.lng}`;

    return (
      <View style={styles.mapContainer}>
        <iframe
          src={mapUrl}
          style={{
            width: "100%",
            height: 250,
            border: "none",
            borderRadius: 12,
          }}
          title="Shipment Route Map"
        />
        <View style={styles.mapLegend}>
          <View style={styles.mapLegendItem}>
            <View
              style={[styles.mapLegendDot, { backgroundColor: colors.success }]}
            />
            <Text style={styles.mapLegendText}>{origin}</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.textSecondary}
          />
          <View style={styles.mapLegendItem}>
            <View
              style={[styles.mapLegendDot, { backgroundColor: colors.danger }]}
            />
            <Text style={styles.mapLegendText}>{destination}</Text>
          </View>
        </View>
      </View>
    );
  }

  // For mobile, you would use react-native-maps
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={40} color={colors.primary} />
        <Text style={styles.mapPlaceholderText}>Map View</Text>
        <View style={styles.mapLegend}>
          <View style={styles.mapLegendItem}>
            <View
              style={[styles.mapLegendDot, { backgroundColor: colors.success }]}
            />
            <Text style={styles.mapLegendText}>{origin}</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.textSecondary}
          />
          <View style={styles.mapLegendItem}>
            <View
              style={[styles.mapLegendDot, { backgroundColor: colors.danger }]}
            />
            <Text style={styles.mapLegendText}>{destination}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const ShipmentDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipmentDetails();
  }, [id]);

  const fetchShipmentDetails = async () => {
    try {
      const data = await shipmentService.getShipmentById(id);
      setShipment(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.danger} />
        <Text style={styles.errorText}>Shipment not found</Text>
        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipment Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Shipment ID & Status */}
        <Card style={styles.card}>
          <View style={styles.shipmentHeader}>
            <View>
              <Text style={styles.shipmentId}>{shipment.id}</Text>
              <Text style={styles.carrierInfo}>
                {shipment.carrierName} • {shipment.carrierNumber}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(shipment.status) + "15" },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(shipment.status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(shipment.status) },
                ]}
              >
                {getStatusLabel(shipment.status)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Map */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Route Map</Text>
          <ShipmentMap
            origin={`${shipment.originCity}, ${shipment.originCountry}`}
            destination={`${shipment.destinationCity}, ${shipment.destinationCountry}`}
            originCoords={shipment.originCoords}
            destinationCoords={shipment.destinationCoords}
          />
        </Card>

        {/* Route Details */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Route Details</Text>
          <View style={styles.routeContainer}>
            <View style={styles.routePointDetail}>
              <View
                style={[
                  styles.routeDotLarge,
                  { backgroundColor: colors.success },
                ]}
              >
                <Ionicons name="location" size={16} color="white" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Origin</Text>
                <Text style={styles.routeCity}>{shipment.originCity}</Text>
                <Text style={styles.routeCountry}>
                  {shipment.originCountry}
                </Text>
              </View>
            </View>

            <View style={styles.routeLineVertical} />

            <View style={styles.routePointDetail}>
              <View
                style={[
                  styles.routeDotLarge,
                  { backgroundColor: colors.danger },
                ]}
              >
                <Ionicons name="location" size={16} color="white" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Destination</Text>
                <Text style={styles.routeCity}>{shipment.destinationCity}</Text>
                <Text style={styles.routeCountry}>
                  {shipment.destinationCountry}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Shipment Info */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Shipment Information</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="business-outline"
              size={20}
              color={colors.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Carrier</Text>
              <Text style={styles.infoValue}>{shipment.carrierName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="barcode-outline"
              size={20}
              color={colors.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Carrier Number</Text>
              <Text style={styles.infoValue}>{shipment.carrierNumber}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="cube-outline"
              size={20}
              color={colors.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Quantity</Text>
              <Text style={styles.infoValue}>{shipment.quantity} units</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>
                {formatDate(shipment.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ETA</Text>
              <Text style={styles.infoValue}>{formatDate(shipment.eta)}</Text>
            </View>
          </View>
        </Card>

        {/* Cost Information */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Cost Information</Text>

          <View style={styles.costContainer}>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Estimated Cost</Text>
              <Text style={styles.costValue}>
                ${shipment.estimatedCost.toLocaleString()}
              </Text>
            </View>

            {shipment.actualCost && (
              <>
                <View style={styles.costDivider} />
                <View style={styles.costItem}>
                  <Text style={styles.costLabel}>Actual Cost</Text>
                  <Text style={[styles.costValue, { color: colors.success }]}>
                    ${shipment.actualCost.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.costDivider} />
                <View style={styles.costItem}>
                  <Text style={styles.costLabel}>Variance</Text>
                  <Text
                    style={[
                      styles.costValue,
                      {
                        color:
                          shipment.actualCost - shipment.estimatedCost > 0
                            ? colors.danger
                            : colors.success,
                      },
                    ]}
                  >
                    {shipment.actualCost - shipment.estimatedCost > 0
                      ? "+"
                      : ""}
                    $
                    {(
                      shipment.actualCost - shipment.estimatedCost
                    ).toLocaleString()}
                  </Text>
                </View>
              </>
            )}
          </View>
        </Card>

        {/* Incident Section */}
        {shipment.incidentType ? (
          <Card
            style={[
              styles.card,
              {
                borderLeftWidth: 4,
                borderLeftColor: getIncidentColor(shipment.incidentType),
              },
            ]}
          >
            <View style={styles.incidentHeader}>
              <View
                style={[
                  styles.incidentIconContainer,
                  {
                    backgroundColor:
                      getIncidentColor(shipment.incidentType) + "15",
                  },
                ]}
              >
                <Ionicons
                  name={getIncidentIcon(shipment.incidentType)}
                  size={28}
                  color={getIncidentColor(shipment.incidentType)}
                />
              </View>
              <View style={styles.incidentTitleContainer}>
                <Text style={styles.cardTitle}>Incident Reported</Text>
                <View
                  style={[
                    styles.incidentTypeBadge,
                    {
                      backgroundColor:
                        getIncidentColor(shipment.incidentType) + "15",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.incidentTypeText,
                      { color: getIncidentColor(shipment.incidentType) },
                    ]}
                  >
                    {shipment.incidentType.charAt(0).toUpperCase() +
                      shipment.incidentType.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.incidentDescription}>
              {shipment.incidentDescription}
            </Text>

            <View style={styles.incidentDateContainer}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.incidentDate}>
                Reported: {formatDate(shipment.incidentDate)}
              </Text>
            </View>
          </Card>
        ) : (
          <Card
            style={[
              styles.card,
              { borderLeftWidth: 4, borderLeftColor: colors.success },
            ]}
          >
            <View style={styles.noIncidentContainer}>
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={colors.success}
              />
              <Text style={styles.noIncidentText}>No incidents reported</Text>
            </View>
          </Card>
        )}

        <View style={{ height: 30 }} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  shipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shipmentId: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  carrierInfo: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Map
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  mapLegend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: 10,
  },
  mapLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  mapLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  mapLegendText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "500",
  },

  // Route
  routeContainer: {
    paddingLeft: 8,
  },
  routePointDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeDotLarge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  routeCountry: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  routeLineVertical: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginLeft: 15,
    marginVertical: 8,
  },

  // Info
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoContent: {
    flex: 1,
    marginLeft: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  // Cost
  costContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  costItem: {
    alignItems: "center",
    flex: 1,
  },
  costLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  costValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  costDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
  },

  // Incident
  incidentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  incidentIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  incidentTitleContainer: {
    flex: 1,
  },
  incidentTypeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  incidentTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  incidentDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  incidentDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  incidentDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  noIncidentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  noIncidentText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.success,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 20,
  },
  backButtonLarge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
