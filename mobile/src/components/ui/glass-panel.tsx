import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radii, shadow } from "@/lib/theme/tokens";

type Props = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
  radius?: number;
  intensity?: number;
}>;

// Shadow lives on the outer (non-clipping) wrapper — iOS clips shadows if
// the same view also has overflow:hidden, which the BlurView needs for its
// rounded corners.
export function GlassPanel({ children, style, radius = radii.pill, intensity = 40 }: Props) {
  return (
    <View style={[styles.wrap, shadow.card, { borderRadius: radius }, style]}>
      <BlurView
        intensity={intensity}
        tint="light"
        style={[styles.blur, { borderRadius: radius }]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceGlass,
  },
  blur: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
