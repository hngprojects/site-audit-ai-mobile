import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    backgroundColor: "#fff",
    flex: 1,
  },
  logo: {
    width: 250,
    height: 103,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 20,
    marginBottom: 20,
  },
  textInputLabel: {
    color: "#000",
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 17,
    
  },
  textInput: {
    fontSize: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#babec6",
    borderRadius: 12,
    marginTop: 12,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 12,
  },
  passwordTextInput: {
    fontSize: 20,
    flex: 1,
    color: "#000",
    padding: 15,

  },
  signUpButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#ff5a3d",
    marginTop: 35,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "RethinkSans-SemiBold",
  },
  signInButtonContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  signInButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff5a3d",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#ff5a3d",
    fontSize: 18,
    fontFamily: "RethinkSans-SemiBold",
  },
  incorrectPassword: {
    color: "#ff5a3d",
    fontFamily: "RethinkSans-Regular",
    fontSize: 14,
    marginTop: 8,
  },
  tipBox: {
    backgroundColor: "#FAD69A",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e29f0fff",
  },
  lightBulbIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  tipText: {
    fontSize: 13,
    color: "#5C4500",
    fontFamily: "RethinkSans-Regular",
    flex: 1,
  },
  passwordRequirements: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: "RethinkSans-SemiBold",
    color: "#000",
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  requirementText: {
    fontSize: 13,
    fontFamily: "RethinkSans-Regular",
    color: "#9ba1ab",
    marginLeft: 8,
  },
  requirementTextValid: {
    color: "#4CAF50",
  },
});

export default styles;

