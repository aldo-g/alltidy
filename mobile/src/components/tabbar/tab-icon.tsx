import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "@/lib/theme/tokens";

type Props = {
  focused: boolean;
  size?: number;
};

const activeColor = colors.accentActive;
const inactiveColor = colors.inkFaint;

export function MapTabIcon({ focused, size = 23 }: Props) {
  const c = focused ? activeColor : inactiveColor;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        stroke={c}
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={10} r={3} stroke={c} strokeWidth={2.75} />
    </Svg>
  );
}

export function FeedTabIcon({ focused, size = 23 }: Props) {
  const c = focused ? activeColor : inactiveColor;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke={c}
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BoardTabIcon({ focused, size = 23 }: Props) {
  const c = focused ? activeColor : inactiveColor;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={6} stroke={c} strokeWidth={2.75} />
      <Path
        d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
        stroke={c}
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function YouTabIcon({ focused, size = 23 }: Props) {
  const c = focused ? activeColor : inactiveColor;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
        stroke={c}
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={7} r={4} stroke={c} strokeWidth={2.75} />
    </Svg>
  );
}
