import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  url: {
    fontSize: 15,
    fontFamily: "RethinkSans-SemiBold",
    color: "#1A1A1A",
    fontWeight: "500",
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: -40
  },
  statusText: {
    fontWeight: "600",
    fontFamily: "RethinkSans-Bold",
    fontSize: 14,
  },
  score: {
    fontFamily: "RethinkSans-Medium",
    fontSize: 12,
    color: "#1A1A1A",
    fontWeight: "400",
    marginTop: 5
  },
  time: {
    fontFamily: "RethinkSans-Regular",
    fontSize: 12,
    color: "#1A1A1A",
    fontWeight: "400",
    marginTop: 8
  },
});

export default styles;
