import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  notificationContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontFamily: "RethinkSans-Bold",
    color: "#1C1C1c",
    marginBottom: 6,
    textAlign: "center",
  },
  headingSection: {
    justifyContent: "center",
    alignItems: "center"
  },
  sub: {
    color: "#494949",
    fontSize: 14,
    marginBottom: 38,
    marginTop: 5,
    fontFamily: "RethinkSans-Regular",
  },

  inputPlaceholder: {
    backgroundColor: "#FEFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C7C8C9",
    fontFamily: "RethinkSans-Regular",
    fontSize: 16,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  androidInputPlaceholder: {
    backgroundColor: "#FEFFFF",
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C7C8C9",
    fontFamily: "RethinkSans-Regular",
    fontSize: 16,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  androidPlaceholderText: {
    backgroundColor: "#FEFFFF",
    paddingHorizontal: 16,
    borderColor: "#C7C8C9",
    fontFamily: "RethinkSans-Regular",
    fontSize: 16,
    paddingLeft: -10,
    flexDirection: "row",
    alignItems: "center",
    width: '95%',
  },
  webIcon: {
    marginRight: 5
  },

  placeholderText: {
    color: "#000",
    fontSize: 16,
    width: '95%',
    backgroundColor: 'red',
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
    fontSize: 16,
    color: "#5C4500",
    fontFamily: "RethinkSans-Regular",
    flex: 1
  },

  sectionTitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 14,
    fontFamily: "RethinkSans-SemiBold"
  },

  runButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#FF5A3D",
    paddingVertical: 14,
    paddingHorizontal: 16,
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
    fontSize: 16,
    fontFamily: "RethinkSans-SemiBold"
  },

  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF5A3D",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "RethinkSans-Bold",
    textAlign: "center",
  },
});
