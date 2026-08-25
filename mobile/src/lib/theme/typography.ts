import type { TextStyle } from "react-native";
import { colors } from "./tokens";
import { fontFamily } from "./fonts";

export const typography = {
  heroDisplay: {
    fontFamily: fontFamily.display,
    fontSize: 46,
    lineHeight: 47,
    letterSpacing: 0.2,
    color: colors.ink,
  } satisfies TextStyle,

  h2: {
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 35,
    letterSpacing: 0.2,
    color: colors.ink,
  } satisfies TextStyle,

  h3: {
    fontFamily: fontFamily.display,
    fontSize: 27,
    lineHeight: 30,
    letterSpacing: 0.2,
    color: colors.ink,
  } satisfies TextStyle,

  statLarge: {
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 32,
    color: colors.ink,
  } satisfies TextStyle,

  statMedium: {
    fontFamily: fontFamily.display,
    fontSize: 26,
    lineHeight: 26,
    color: colors.ink,
  } satisfies TextStyle,

  statSmall: {
    fontFamily: fontFamily.display,
    fontSize: 20,
    lineHeight: 20,
    color: colors.ink,
  } satisfies TextStyle,

  label: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.inkFaint,
  } satisfies TextStyle,

  body: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkMuted,
  } satisfies TextStyle,

  bodyStrong: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 15,
    color: colors.ink,
  } satisfies TextStyle,

  title: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 14.5,
    color: colors.ink,
  } satisfies TextStyle,

  button: {
    fontFamily: fontFamily.bodyExtraBold,
    fontSize: 15,
    letterSpacing: 0.2,
    color: colors.white,
  } satisfies TextStyle,
} as const;
