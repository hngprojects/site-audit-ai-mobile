import { StyleSheet } from "react-native";

export const reportColors = {
  cardBorder: "#F2F2F2",
  linkBlue: "#3F5BD9",
  scoreLow: "#D72D2D",
  scoreHigh: "#0EA472",
  scoreMedium: "#FF9B2E",
  cardBg: "#FFFFFF",
  subtleText: "#6B7280",
  shadow: "#000000",
};

const styles = StyleSheet.create({
  
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#F2F2F2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  left: {
    flex: 1,
    paddingRight: 8,
  },
  domainText: {
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  scoreText: {
    fontFamily: "RethinkSans",
    fontSize: 13,
    marginBottom: 6,
    color: "#374151",
  },
  scoreNumber: {
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 13,
  },
  scoreLabel: {
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 13,
  },
  scoreParens: {
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 13,
    color: "#374151",
  },
  scanDate: {
    fontFamily: "RethinkSans-Medium",
    fontSize: 12,
    color: "#9CA3AF",
  },

  viewDetailsWrap: {
    alignItems: "flex-end",
  },
  viewDetailsInnerWrap: {
    flexDirection: "row", 
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 45
  },
  viewDetailsText: {
    fontFamily: "RethinkSans-Medium",
    color: "#3F5BD9",
    fontSize: 13,
    fontWeight: "600",
  },
  viewDetailsArrow: {
    color: "#3F5BD9",
    marginLeft: 10,
    
  },
});

export default styles;