import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";
import { colors } from "../theme/colors";

// Screens
import { SignInScreen } from "../screens/SignInScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ShipmentListScreen } from "../screens/ShipmentListScreen";
import { ShipmentDetailScreen } from "../screens/ShipmentDetailScreen";
import { AnalyticsScreen } from "../screens/AnalyticsScreen";
import { AlertsScreen } from "../screens/AlertsScreen";
import { AIAssistantScreen } from "../screens/AIAssistantScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Shipments")
            iconName = focused ? "cube" : "cube-outline";
          else if (route.name === "Analytics")
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          else if (route.name === "Alerts")
            iconName = focused ? "notifications" : "notifications-outline";
          else if (route.name === "AI")
            iconName = focused ? "sparkles" : "sparkles-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Shipments" component={ShipmentListScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen
        name="AI"
        component={AIAssistantScreen}
        options={{ title: "AI Assistant" }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
