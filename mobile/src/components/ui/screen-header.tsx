import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

type Props = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={typography.h2}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xxs,
    marginBottom: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkFaint,
  },
});
