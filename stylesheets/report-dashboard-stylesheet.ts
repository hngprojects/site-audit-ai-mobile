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

const style = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 19,
    color: "#111",
    fontFamily: "RethinkSans-Bold",
  },

  card: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },

  cardLabel: {
    fontSize: 14,
    fontFamily: "RethinkSans-Medium",
    textAlign: "center",
  },

  domainText: {
    fontFamily: "RethinkSans-Medium",
  },

  scoreText: {
    fontSize: 36,
    marginTop: 4,
    fontFamily: "RethinkSans-Bold",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  statusText: {
    fontSize: 20,
    marginTop: 4,
    fontFamily: "RethinkSans",
  },

  statusHigh: { color: "#0EA472" },
  statusMedium: { color: "#FF9B2E" },
  statusLow: { color: "#D72D2D" },

  dateText: {
    fontSize: 17,
    marginTop: 4,
    color: "#111",
    fontFamily: "RethinkSans",
  },

  continueBtn: {
    width: "90%",
    backgroundColor: "#e24017ff",
    paddingVertical: 16,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 30,
  },

  continueText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "RethinkSans",
  },

  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 22,
  },

  modalTitle: {
    fontSize: 20,
    fontFamily: "RethinkSans-Bold",
    marginBottom: 6,
    marginTop: 10
  },

  modalSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "RethinkSans-Medium",
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: "#e24017ff",
    paddingVertical: 14,
    borderRadius: 10,
  },

  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "RethinkSans-Bold",
  },
  modalActivityIndicator: {
    justifyContent: "center",
    alignItems: "center"
  },

});

export default style;

