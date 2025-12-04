import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 12,
    alignItems: "flex-start",
  },

  left: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    fontSize: 20,
    color: "#D1D5DB",
  },

  middle: {
    flex: 1,
    paddingHorizontal: 8,
  },
  cardTitlesection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  issueTitle: {
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 14,
    color: "#111827",
  },

  issueScore: {
    marginTop: 6,
    fontFamily: "RethinkSans-Medium",
    fontSize: 12,
    color: "#6B7280",
  },

  issueDesc: {
    marginTop: 8,
    fontFamily: "RethinkSans-Regular",
    fontSize: 13,
    color: "#374151",
  },

  viewDetails: {
    marginTop: 10,
    fontFamily: "RethinkSans-Regular",
    fontSize: 13,
    color: "#3F5BD9",
  },

  right: {
    width: 72,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },

  badgeText: {
    fontFamily: "RethinkSans-Medium",
    fontSize: 12,
  },
  viewDetailsInnerWrap: {
    flexDirection: "row", 
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 10
  },
  viewDetailsArrow: {
    color: "#3F5BD9",
    marginLeft: 10,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    
  },
  statusText: {
    fontFamily: "RethinkSans-Bold",
    fontSize: 14,
  },
  viewDetailContainer : {
    flexDirection: "row",
    gap: 1,
    marginTop: 12,
    alignItems: "center"
  },
  viewDetailsText: {
    fontFamily: "RethinkSans-Medium",
    color: "#3F5BD9",
    fontSize: 15,
  },
});
