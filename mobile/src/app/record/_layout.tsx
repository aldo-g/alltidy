import { Stack } from "expo-router";
import { RecordSessionProvider } from "@/lib/hooks/record-session-context";

export default function RecordLayout() {
  return (
    <RecordSessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="active" />
        <Stack.Screen name="summary" />
      </Stack>
    </RecordSessionProvider>
  );
}
