import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: "5%",
  },

  backButton: {
     marginBottom: 20 
    },
  backArrow: { 
    fontSize: 28, 
    color: "#000" 
  },

  title: {
    fontSize: 24,
    marginBottom: 10,
  },

   headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        justifyContent: 'center',
    },
    backarrow: {
        position: 'absolute',
        left: 16,
    },
    headerText: {
         fontSize: 20,
        fontFamily: "RethinkSans-Bold",
        textAlign: 'center',
    },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    lineHeight: 20,
    fontFamily: "RethinkSans-SemiBold"
  },

  email: { 
    color: "#FF6A45", 
    fontFamily: "RethinkSans-SemiBold",
},

  otpContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },

  otpBox: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1.5,
  },

  otpText: {
    fontSize: 18,
    fontFamily: "RethinkSans-Bold",
    color: "#333",
  },


  resendText: {
    color: "#777",
    fontSize: 14,
    marginBottom: 25,
    fontFamily: "RethinkSans-Regular",
    marginRight: 3
  },
  invalidCode: {
    color: "#d32f2f",
    fontFamily: "RethinkSans-Regular",
    fontSize: 14,
    marginBottom: 30,
    marginTop: -5
  },
  resend: {
    color: "blue",
    fontFamily: "RethinkSans-SemiBold",
  },
resendContainer: {
    flexDirection: "row"
},
  continueBtnActive: {
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  iosButtonView: {
    flex: 1, 
    justifyContent: "flex-end",
    marginBottom: 45
  },
  buttonView: {
    flex: 1, 
    justifyContent: "flex-end",
  },
  continueBtnText: {
    fontSize: 16,
    textAlign: "center",
  },
});
