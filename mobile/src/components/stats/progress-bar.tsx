import { StyleSheet, View } from "react-native";
import { colors, radii } from "@/lib/theme/tokens";

export type ProgressSegment = {
  key: string;
  percent: number;
  color: string;
};

export function ProgressBar({ segments }: { segments: ProgressSegment[] }) {
  return (
    <View style={styles.track}>
      {segments.map((seg) => (
        <View
          key={seg.key}
          style={{ width: `${seg.percent}%`, backgroundColor: seg.color, height: "100%" }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
});
