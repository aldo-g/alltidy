import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FilterChips, type FeedFilter } from "@/components/feed/filter-chips";
import { CleanupListItem } from "@/components/feed/cleanup-list-item";
import { MOCK_FEED } from "@/lib/mock/mockFeed";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export default function FeedScreen() {
  const [filter, setFilter] = useState<FeedFilter>("Nearby");

  function handleFilterChange(next: FeedFilter) {
    if (next === "Events") {
      router.push("/challenges");
      return;
    }
    setFilter(next);
  }

  // "Following" has no real content yet — AllTidy has no follow graph
  // (per product direction: read-only feed, no likes/comments/follows) —
  // so it renders an honest empty state rather than silently reusing the
  // Nearby list.
  const items = filter === "Nearby" ? MOCK_FEED : [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <ScreenHeader title="Around you" subtitle={`${MOCK_FEED.length * 30} cleanups within 3 km this week`} />
            <View style={styles.headerRow}>
              <FilterChips active={filter} onChange={handleFilterChange} />
              <Pressable onPress={() => router.push("/challenges")} style={styles.whatsOn}>
                <Text style={styles.whatsOnLabel}>What&apos;s on</Text>
              </Pressable>
            </View>
            <View style={{ height: spacing.lg }} />
          </>
        }
        renderItem={({ item }) => <CleanupListItem item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={typography.bodyStrong}>Nobody to follow yet</Text>
            <Text style={styles.emptyBody}>
              Following isn&apos;t built yet — check back soon, or browse cleanups nearby.
            </Text>
          </View>
        }
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
  empty: {
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyBody: {
    ...typography.body,
    color: colors.inkFaint,
    textAlign: "center",
  },
});
