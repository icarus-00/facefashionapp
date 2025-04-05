/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary:{
      50: "#ECE9F6",
      100: "#DCD7EF",
      200: "#B7AADE",
      300: "#9482CF",
      400: "#715ABF",
      500: "#553EA0",
      600: "#443281",
      700: "#332560",
      800: "#21183E",
      900: "#120D21",
      950: "#08060F"
    },
    secondary:{
      50: "#FAFCFF",
      100: "#F5F8FF",
      200: "#F0F5FF",
      300: "#E5EEFF",
      400: "#DBE8FF",
      500: "#D4E3FF",
      600: "#75A5FF",
      700: "#1A6AFF",
      800: "#0042BD",
      900: "#00205C",
      950: "#00102E"
    },
    offwhite :{
      50: "#FFFFFF",
      100: "#FDFCFC",
      200: "#FAFAFA",
      300: "#FAFAFA",
      400: "#F8F7F7",
      500: "#F5F4F4",
      600: "#C7C2C2",
      700: "#998F8F",
      800: "#665C5C",
      900: "#332E2E",
      950: "#1B1818"}
      ,
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
