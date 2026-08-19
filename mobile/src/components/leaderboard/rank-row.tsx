import { StyleSheet, Text, View } from "react-native";
import type { LeaderboardRow } from "@/lib/mock/mockLeaderboard";
import { colors, radii, spacing } from "@/lib/theme/tokens";

export function RankRow({ row }: { row: LeaderboardRow }) {
  const isTop = row.rank === 1;
  const isYou = row.isYou;

  const backgroundColor = isTop ? colors.olive : isYou ? colors.accentSoft : colors.card;
  const textColor = isTop ? colors.oliveText : colors.ink;
  const rankColor = isTop ? colors.oliveSofter : colors.inkFaint;

  return (
    <View style={[styles.row, { backgroundColor }]}>
      <Text style={[styles.rank, { color: rankColor }]}>{row.rank}</Text>
      <View style={[styles.avatar, isTop && styles.avatarOnOlive]}>
        <Text style={styles.avatarLabel}>{row.initial}</Text>
      </View>
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {row.name}
      </Text>
      <Text style={[styles.km, { color: textColor }]}>{row.km}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.cardSm - 4,
  },
  rank: {
    width: 22,
    fontFamily: "Caprasimo_400Regular",
    fontSize: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.oliveSofter,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOnOlive: {
    backgroundColor: colors.oliveSofter,
  },
  avatarLabel: {
    fontFamily: "Caprasimo_400Regular",
    fontSize: 13,
    color: colors.olive,
  },
  name: {
    flex: 1,
    fontFamily: "Figtree_700Bold",
    fontSize: 15,
  },
  km: {
    fontFamily: "Caprasimo_400Regular",
    fontSize: 18,
  },
});
