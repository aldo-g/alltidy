import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/screen-header";
import { RankRow } from "@/components/leaderboard/rank-row";
import { NeighbourhoodCupCallout } from "@/components/leaderboard/neighbourhood-cup-callout";
import { MOCK_LEADERBOARD, NEIGHBOURHOOD_CUP } from "@/lib/mock/mockLeaderboard";
import { colors, spacing } from "@/lib/theme/tokens";

export default function BoardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={MOCK_LEADERBOARD}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <ScreenHeader title="This month" subtitle="Amsterdam · by distance cleaned" />
        }
        renderItem={({ item }) => <RankRow row={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm + 1 }} />}
        ListFooterComponent={
          <View style={{ marginTop: spacing.xxl }}>
            <NeighbourhoodCupCallout {...NEIGHBOURHOOD_CUP} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 140 },
});
