import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";
import { StatusBadge } from "../common/StatusBadge";
import { colors } from "../../theme/colors";

export const ShipmentCard = ({ shipment, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.shipmentId}>{shipment.id}</Text>
          <StatusBadge status={shipment.status} />
        </View>

        <View style={styles.route}>
          <View style={styles.location}>
            <Ionicons name="location" size={16} color={colors.success} />
            <Text style={styles.locationText}>{shipment.origin}</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.textSecondary}
          />
          <View style={styles.location}>
            <Ionicons name="location" size={16} color={colors.danger} />
            <Text style={styles.locationText}>{shipment.destination}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Carrier</Text>
            <Text style={styles.detailValue}>{shipment.carrier}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ETA</Text>
            <Text style={styles.detailValue}>{shipment.eta}</Text>
          </View>
        </View>

        {shipment.mlPrediction && (
          <View style={styles.mlSection}>
            <View style={styles.mlItem}>
              <Text style={styles.mlLabel}>Delay Risk</Text>
              <Text
                style={[
                  styles.mlValue,
                  {
                    color:
                      shipment.mlPrediction.delayRisk > 50
                        ? colors.danger
                        : colors.success,
                  },
                ]}
              >
                {shipment.mlPrediction.delayRisk}%
              </Text>
            </View>
            <View style={styles.mlItem}>
              <Text style={styles.mlLabel}>Risk Score</Text>
              <Text
                style={[
                  styles.mlValue,
                  {
                    color:
                      shipment.mlPrediction.riskScore > 50
                        ? colors.danger
                        : colors.success,
                  },
                ]}
              >
                {shipment.mlPrediction.riskScore}%
              </Text>
            </View>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  shipmentId: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  route: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  mlSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  mlItem: {
    flex: 1,
  },
  mlLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  mlValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
