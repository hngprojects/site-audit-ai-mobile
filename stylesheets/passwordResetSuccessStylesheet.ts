import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "7%",
  },
  glowCircle: {
        position: "absolute",
        top:200,
        width: 90,
        height: 90,
        backgroundColor: "#96bfa3",
        borderRadius: 60,
        opacity: 0.25,
        shadowColor: "#96bfa3",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 40, 
        elevation: 20,   
    },
  glowCircleInner: {
        position: "absolute",
        top:215,
        width: 60,
        height: 60,
        backgroundColor: "#488f60",
        borderRadius: 60,
        opacity: 0.25,
        shadowColor: "#96bfa3",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 40, 
        elevation: 20,   
    },
    icon: {
        position: "absolute",
        top:225,
        left: 165
    },
    iconios: {
       position: "absolute",
        top:225,
        left: 190
    },
  title: {
    fontSize: 22,
    marginBottom: 10,
    marginTop: -15,
    fontFamily: "RethinkSans-Bold"
  },

  subTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
    marginTop: 6,
    fontFamily: "RethinkSans-Regular"
  },
  buttonContainer: {
    flex: 1, 
    justifyContent: "flex-end",
    width: "100%"
  },

  continueBtn: {
    backgroundColor: "#FF6A45",
    paddingVertical: 16,
    borderRadius: 10,
    width: "100%",
    position: "absolute",
    top:680,
  },

  continueBtnText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
    fontFamily: "RethinkSans-SemiBold"
  },
});
