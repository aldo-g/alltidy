import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

type Props = {
  leader: string;
  trailer: string;
  marginKm: number;
  daysLeft: number;
};

export function NeighbourhoodCupCallout({ leader, trailer, marginKm, daysLeft }: Props) {
  return (
    <View style={styles.card}>
      <Text style={typography.label}>Neighbourhood cup</Text>
      <Text style={styles.copy}>
        {leader} leads {trailer} by {marginKm.toFixed(1)} km with {daysLeft} days to go.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    gap: spacing.sm,
  },
  copy: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: colors.olive,
  },
});
