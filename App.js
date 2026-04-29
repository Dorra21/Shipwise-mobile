import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { LanguageProvider, useLanguage } from "./src/context/LanguageContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

// Screens
import { SignInScreen } from "./src/screens/SignInScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { ShipmentListScreen } from "./src/screens/ShipmentListScreen";
import { ShipmentDetailScreen } from "./src/screens/ShipmentDetailScreen";
import { AnalyticsScreen } from "./src/screens/AnalyticsScreen";
import { AlertsScreen } from "./src/screens/AlertsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { ChangePasswordScreen } from "./src/screens/ChangePasswordScreen";

const colors = {
  primary: "#2563eb",
  textSecondary: "#64748b",
  card: "#ffffff",
  border: "#e2e8f0",
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStackNav = createStackNavigator();

// Shipment Stack Navigator
function ShipmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShipmentList" component={ShipmentListScreen} />
      <Stack.Screen name="ShipmentDetail" component={ShipmentDetailScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStackNav.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />
      <ProfileStackNav.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
    </ProfileStackNav.Navigator>
  );
}

// Main App Content
function AppContent() {
  const { isLoggedIn } = useAuth();
  const { t } = useLanguage();

  // ADD THIS: Debug log
  useEffect(() => {
    console.log("📱 AppContent sees isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="SignIn" component={SignInScreen} />
          ) : (
            <Stack.Screen name="Main">
              {(props) => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === "Dashboard") {
                        iconName = focused ? "home" : "home-outline";
                      } else if (route.name === "Shipments") {
                        iconName = focused ? "cube" : "cube-outline";
                      } else if (route.name === "Analytics") {
                        iconName = focused
                          ? "stats-chart"
                          : "stats-chart-outline";
                      } else if (route.name === "Alerts") {
                        iconName = focused
                          ? "notifications"
                          : "notifications-outline";
                      } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                      }

                      return (
                        <Ionicons name={iconName} size={size} color={color} />
                      );
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarStyle: {
                      backgroundColor: colors.card,
                      borderTopColor: colors.border,
                      paddingBottom: 5,
                      paddingTop: 5,
                      height: 60,
                    },
                    tabBarLabelStyle: {
                      fontSize: 12,
                      fontWeight: "600",
                    },
                  })}
                >
                  <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{ title: t("dashboard") }}
                  />
                  <Tab.Screen
                    name="Shipments"
                    component={ShipmentStack}
                    options={{ title: t("shipments") }}
                  />
                  <Tab.Screen
                    name="Analytics"
                    component={AnalyticsScreen}
                    options={{ title: t("analytics") }}
                  />
                  <Tab.Screen
                    name="Alerts"
                    component={AlertsScreen}
                    options={{ title: t("alerts") }}
                  />
                  <Tab.Screen
                    name="Profile"
                    component={ProfileStack}
                    options={{ title: t("profile") }}
                  />
                </Tab.Navigator>
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// Main App Component with Providers
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
