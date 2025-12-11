import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getIconName = (routeName: string): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case "ToDos":
      return "checkmark-done-outline";
    case "Habits":
      return "repeat-outline";
    case "Blog":
      return "book-outline";
    case "Profile":
      return "person-circle-outline";
    default:
      return "ellipse-outline";
  }
};

const getFocusedRouteName = (route: any): string => {
  if (!route.state || !route.state.routes) {
    return route.name;
  }
  const index = route.state.index;
  const nestedRoute = route.state.routes[index];
  return nestedRoute.name;
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const handleCreatePress = () => {
    const currentRoute = state.routes[state.index].name;

    if (currentRoute === "ToDos") {
      navigation.navigate("ToDos", {
        screen: "CreateToDo",
      } as never);
    } else if (currentRoute === "Habits") {
      console.log("Create Habit not implemented yet");
    } else if (currentRoute === "Blog") {
      console.log("Create Blog not implemented yet");
    } else if (currentRoute === "Profile") {
      console.log("Create action for Profile not implemented yet");
    }
  };

  const bottomOffset = (insets.bottom || 0) + 8;

  const currentTab = state.routes[state.index];
  const focusedRoute = getFocusedRouteName(currentTab);

  const hideFabRoutes = ["CreateToDo", "EditToDo"];
  const shouldShowFab = !hideFabRoutes.includes(focusedRoute);

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <Ionicons
                name={getIconName(route.name)}
                size={22}
                color={isFocused ? "#22c55e" : "#9ca3af"}
              />
              <Text style={[styles.label, isFocused && styles.labelFocused]}>
                {String(label)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Center "+" button */}
      {shouldShowFab && (
        <TouchableOpacity
          style={[
            styles.fab,
            {
              bottom:
                (insets.bottom || 0) +
                (Platform.OS === "ios" ? -10 : -6),
            },
          ]}
          onPress={handleCreatePress}
          activeOpacity={0.9}
        >
          <Ionicons name="add" size={28} color="#022c22" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#020617",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#1f2933",
    paddingBottom: Platform.OS === "ios" ? 18 : 10,
    paddingTop: 8,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    color: "#9ca3af",
  },
  labelFocused: {
    color: "#22c55e",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
