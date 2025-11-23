import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: "5%",
  },

  notificationContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontFamily: "RethinkSans-Bold",
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    textAlign: "center",
  },
   headingSection: {
    justifyContent: "center",
    alignItems: "center"
   },
  sub: {
    color: "#555",
    fontSize: 14,
    marginBottom: 38,
    marginTop: 5,
    fontFamily: "RethinkSans-Regular",
  },

  inputPlaceholder: {
    backgroundColor: "#F7F7F7",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  webIcon: {
    marginRight: 5
  },

  placeholderText: {
    color: "#000",
    fontSize: 15,
  },

  invalidLink: {
    color: "#d32f2f",
    marginTop: -15,
    marginBottom: 15
  },

  tipBox: {
    backgroundColor: "#FFF7E6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e29f0fff",

  },
  buldIcon: {
    marginRight: 5
  },

  tipText: {
    fontSize: 13,
    color: "#5C4500",
    fontFamily: "RethinkSans-Regular",
    flex: 1
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 14,
    fontFamily: "RethinkSans-SemiBold"
  },

  runButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#F04438",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "row",
  },
  runButtonImage: {
    marginRight: 4,
    width: 25,
            height: 25
  },
  runButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
     fontFamily: "RethinkSans-SemiBold"
  },
});
