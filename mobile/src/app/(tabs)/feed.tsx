import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FilterChips } from "@/components/feed/filter-chips";
import { CleanupListItem } from "@/components/feed/cleanup-list-item";
import { MOCK_FEED } from "@/lib/mock/mockFeed";
import { colors, radii, spacing } from "@/lib/theme/tokens";

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={MOCK_FEED}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <ScreenHeader title="Around you" subtitle={`${MOCK_FEED.length * 30} cleanups within 3 km this week`} />
            <View style={styles.headerRow}>
              <FilterChips />
              <Pressable onPress={() => router.push("/challenges")} style={styles.whatsOn}>
                <Text style={styles.whatsOnLabel}>What&apos;s on</Text>
              </Pressable>
            </View>
            <View style={{ height: spacing.lg }} />
          </>
        }
        renderItem={({ item }) => <CleanupListItem item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 140 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  whatsOn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.oliveSoft,
  },
  whatsOnLabel: {
    fontFamily: "Figtree_700Bold",
    fontSize: 11.5,
    color: colors.olive,
  },
});
