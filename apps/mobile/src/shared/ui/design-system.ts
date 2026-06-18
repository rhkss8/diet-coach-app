export const theme = {
  colors: {
    background: "#F7F3EC",
    backgroundAlt: "#EDE9DF",
    surface: "#FEFCF8",
    surfaceMuted: "#EDE9DF",
    surfaceTint: "#E6EFE6",
    ink: "#2A3D2E",
    inkSoft: "#4A5E4C",
    muted: "#968E7E",
    subtle: "#8A9E8C",
    border: "rgba(42, 61, 46, 0.09)",
    borderStrong: "rgba(42, 61, 46, 0.18)",
    primary: "#3D6142",
    primaryPressed: "#2F4D33",
    primarySoft: "#E6EFE6",
    secondary: "#5F735F",
    secondarySoft: "#EEF3EC",
    warm: "#C97355",
    warmSoft: "#F5EAE3",
    success: "#3F7A58",
    warning: "#A86B24",
    danger: "#A8483D",
    white: "#FFFFFF",
  },
  radius: {
    small: 6,
    medium: 10,
    large: 12,
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
      fontFamily: "serif",
      fontSize: 23,
      fontWeight: "400" as const,
      letterSpacing: 0,
      lineHeight: 36,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700" as const,
      letterSpacing: 0,
      lineHeight: 22,
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
