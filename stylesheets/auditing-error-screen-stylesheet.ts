import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  accent: "#F16049", 
  accentTint: "#FEEAEA", 
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: "5%",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  topSpacer: {
    height: 100,
  },


  iconWrap: {
    marginTop: 8,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.accentTint,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlyph: {
    fontSize: 34,
    lineHeight: 34,
    color: COLORS.accent,
  },

 
  title: {
    marginTop: 35,
    fontFamily: "RethinkSans-Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  bodyPrimary: {
    marginTop: 18,
    fontFamily: "RethinkSans-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 6,
  },

  bodyHighlight: {
    marginTop: 14,
    fontFamily: "RethinkSans-Medium",
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: "center",
    lineHeight: 20,
  },

  bodySecondary: {
    marginTop: 20,
    fontFamily: "RethinkSans-Regular",
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },

 
  buttonGroup: {
    width: "100%",
    marginBottom: 68,
    marginTop: 100
  },

  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: "RethinkSans",
    fontSize: 16,
    color: "#FFFFFF",
  },

  secondaryButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontFamily: "RethinkSans",
    fontSize: 16,
    color: COLORS.accent,
  },

 
  fullWidth: {
    width: width - 56,
  },
});

export default styles;