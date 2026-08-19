import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/screen-header";
import { MOCK_CHALLENGE, MOCK_MEETUPS } from "@/lib/mock/mockChallenges";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export default function ChallengesScreen() {
  const c = MOCK_CHALLENGE;
  const percent = Math.min(100, Math.round((c.km / c.targetKm) * 100));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <View style={styles.backChevron} />
          </Pressable>
        </View>

        <ScreenHeader title="What's on" subtitle="Organised cleanups and city challenges" />

        <View style={styles.challengeCard}>
          <View style={styles.challengeBlob} />
          <Text style={styles.endsIn}>Ends in {c.daysLeft} days</Text>
          <Text style={styles.challengeTitle}>{c.title}</Text>
          <Text style={styles.challengeDescription}>{c.description}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
          <View style={styles.challengeMetaRow}>
            <Text style={styles.challengeKm}>{c.km.toFixed(1)} km</Text>
            <Text style={styles.challengePeople}>{c.people.toLocaleString()} people</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Meet-ups near you</Text>
        <View style={{ gap: spacing.md }}>
          {MOCK_MEETUPS.map((meetup) => (
            <View key={meetup.id} style={styles.meetupCard}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateDay}>{meetup.day}</Text>
                <Text style={styles.dateMonth}>{meetup.month}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={typography.bodyStrong}>{meetup.title}</Text>
                <Text style={styles.meetupMeta}>
                  {meetup.time} · Meet at {meetup.meetPoint} · {meetup.going} going
                </Text>
                {meetup.tag && (
                  <Text style={styles.tag}>{meetup.tag}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 60 },
  headerRow: { marginBottom: spacing.sm },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  backChevron: {
    width: 9,
    height: 9,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.ink,
    transform: [{ rotate: "45deg" }],
    marginLeft: 3,
  },
  challengeCard: {
    borderRadius: radii.card,
    backgroundColor: colors.accent,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    overflow: "hidden",
    gap: spacing.md,
  },
  challengeBlob: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,242,235,0.14)",
  },
  endsIn: {
    fontFamily: "Figtree_800ExtraBold",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.accentSoft,
  },
  challengeTitle: {
    fontFamily: "Caprasimo_400Regular",
    fontSize: 27,
    color: colors.white,
  },
  challengeDescription: {
    fontFamily: "Figtree_500Medium",
    fontSize: 14,
    lineHeight: 20,
    color: colors.accentSoft,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(64,35,16,0.3)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.background,
  },
  challengeMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  challengeKm: {
    fontFamily: "Figtree_700Bold",
    fontSize: 12,
    color: colors.white,
  },
  challengePeople: {
    fontFamily: "Figtree_700Bold",
    fontSize: 12,
    color: colors.accentSoft,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  meetupCard: {
    flexDirection: "row",
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
  },
  dateBadge: {
    width: 54,
    borderRadius: radii.cardSm,
    backgroundColor: colors.oliveSoft,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm + 2,
  },
  dateDay: {
    fontFamily: "Caprasimo_400Regular",
    fontSize: 22,
    color: colors.olive,
  },
  dateMonth: {
    fontFamily: "Figtree_800ExtraBold",
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.olive,
  },
  meetupMeta: {
    fontFamily: "Figtree_500Medium",
    fontSize: 12.5,
    color: colors.inkFaint,
  },
  tag: {
    alignSelf: "flex-start",
    marginTop: 4,
    fontFamily: "Figtree_700Bold",
    fontSize: 11.5,
    color: colors.olive,
    backgroundColor: colors.oliveSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    overflow: "hidden",
  },
});
