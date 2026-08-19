import { View } from "react-native";
import { Tabs } from "expo-router/js-tabs";
import { CleanButton } from "@/components/tabbar/clean-button";
import { MapTabIcon, FeedTabIcon, BoardTabIcon, YouTabIcon } from "@/components/tabbar/tab-icon";
import { colors } from "@/lib/theme/tokens";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accentActive,
          tabBarInactiveTintColor: colors.inkFaint,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 94,
            paddingTop: 14,
            paddingBottom: 14,
            paddingHorizontal: 16,
          },
          tabBarItemStyle: { justifyContent: "center" },
          tabBarLabelStyle: {
            fontFamily: "Figtree_700Bold",
            fontSize: 10,
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Map",
            tabBarIcon: ({ focused }) => <MapTabIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: "Feed",
            tabBarIcon: ({ focused }) => <FeedTabIcon focused={focused} />,
            tabBarItemStyle: { justifyContent: "center", alignItems: "flex-start", paddingLeft: 8 },
          }}
        />
        <Tabs.Screen
          name="board"
          options={{
            title: "Board",
            tabBarIcon: ({ focused }) => <BoardTabIcon focused={focused} />,
            tabBarItemStyle: { justifyContent: "center", alignItems: "flex-end", paddingRight: 8 },
          }}
        />
        <Tabs.Screen
          name="you"
          options={{
            title: "You",
            tabBarIcon: ({ focused }) => <YouTabIcon focused={focused} />,
          }}
        />
      </Tabs>
      <CleanButton />
    </View>
  );
}
