import { useFonts } from "expo-font";
import { Caprasimo_400Regular } from "@expo-google-fonts/caprasimo";
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
} from "@expo-google-fonts/figtree";

export function useAppFonts() {
  return useFonts({
    Caprasimo_400Regular,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
  });
}

export const fontFamily = {
  display: "Caprasimo_400Regular",
  body: "Figtree_400Regular",
  bodyMedium: "Figtree_500Medium",
  bodySemiBold: "Figtree_600SemiBold",
  bodyBold: "Figtree_700Bold",
  bodyExtraBold: "Figtree_800ExtraBold",
} as const;
