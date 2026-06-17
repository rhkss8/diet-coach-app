export const theme = {
  colors: {
    background: "#F4F1EA",
    backgroundAlt: "#ECE8DE",
    surface: "#FFFCF6",
    surfaceMuted: "#F7F3EA",
    surfaceTint: "#E8F0EA",
    ink: "#17211D",
    inkSoft: "#33423A",
    muted: "#66736B",
    subtle: "#8A938C",
    border: "#DDD6C8",
    borderStrong: "#C9BFAE",
    primary: "#2D5C4A",
    primaryPressed: "#244B3D",
    primarySoft: "#DDEBE3",
    secondary: "#3D5578",
    secondarySoft: "#E2E9F4",
    warm: "#B76145",
    warmSoft: "#F3E4DA",
    success: "#3F7A58",
    warning: "#A86B24",
    danger: "#A8483D",
    white: "#FFFFFF",
  },
  radius: {
    small: 8,
    medium: 12,
    large: 18,
  },
  space: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  type: {
    eyebrow: {
      fontSize: 12,
      fontWeight: "800" as const,
      letterSpacing: 0,
      lineHeight: 16,
    },
    title: {
      fontSize: 30,
      fontWeight: "900" as const,
      letterSpacing: 0,
      lineHeight: 38,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "900" as const,
      letterSpacing: 0,
      lineHeight: 25,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    supporting: {
      fontSize: 14,
      lineHeight: 21,
    },
    caption: {
      fontSize: 12,
      lineHeight: 17,
    },
    button: {
      fontSize: 15,
      fontWeight: "900" as const,
      letterSpacing: 0,
      lineHeight: 20,
    },
  },
} as const;

export const commonStyles = {
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
  },
  insetCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
  },
} as const;
