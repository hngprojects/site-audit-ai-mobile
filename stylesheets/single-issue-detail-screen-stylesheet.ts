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
    textAlign: 'center',
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
    justifyContent: "flex-end", 
  },

  modalBox: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 22,
    marginBottom: "25%", 
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
  cardSection: {
     marginTop: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 20,
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontFamily: "RethinkSans-Bold",
        fontSize: 17,
        color: "#000",
        marginBottom: 10,
  },
  cardDescription: {
    fontFamily: "RethinkSans-Medium",
    color: "#000",
    marginBottom: 10
  },
  usabilitySection: {
    flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
  },
  usabilityText: {
    fontFamily: "RethinkSans-SemiBold",
      fontSize: 17,
      color: "#000",
      marginTop: 5
  },
  progressBarBackground: {
  height: 12,
  borderRadius: 6,
  width: "100%",
  overflow: "hidden",
  marginTop: 5,
},

progressBarForeground: {
  height: "100%",
  borderRadius: 6,
},
miniscoreBackground: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
},
miniscoreText: {
    fontFamily: "RethinkSans-Bold",
    fontSize: 14,
},
whatThisWillDoTitle: {
    fontFamily: "RethinkSans-Bold",
        fontSize: 14,
        marginBottom: 8,
        marginTop: 20,
        color: "#000",
},
whatThisWillDoText: {
    fontFamily: "RethinkSans-Regular",
    fontSize: 13,
    color: "#656565",
    marginBottom: 20,
    lineHeight: 20,
},
problemsTitle: {
    fontFamily: "RethinkSans-Bold",
        fontSize: 15,
        marginBottom: 8,
        color: "#000",
},
problemDetailsContainer: {
     gap: 12, 
     marginBottom: 20,
},
problemDetailInnerContainer: {
    flexDirection: "row", 
    alignItems: "flex-start", 
    gap: 8
},
warningIconBackground: {
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -5
},
problemText: {
    fontFamily: "RethinkSans-Regular",
    fontSize: 13,
    color: "#656565",
    flex: 1,
    lineHeight: 20,
},
suggestionTitle: {
    fontFamily: "RethinkSans-Bold",
    fontSize: 15,
    marginBottom: 8,
    color: "#000",
},
suggestionText: {
    fontFamily: "RethinkSans-Regular",
    fontSize: 13,
    color: "#656565",
    marginBottom: 25,
    lineHeight: 20,
},
continueButton: {
    backgroundColor: "#FF5722",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
},
continueButtonText: {
     color: "#fff",
     fontFamily: "RethinkSans-Bold",
     fontSize: 15,
},

});

export default style;

