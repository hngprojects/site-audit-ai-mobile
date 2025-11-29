import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop:27, 
    width: "80%" 
  },
  button: {
    backgroundColor: '#FF5A3D',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  shareButtonContainer: {
    backgroundColor: "#fff",
    borderColor: '#FF5A3D',
    flexDirection: "row",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 15
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'RethinkSans-Bold',
  },
  shareButtonText: {
    color: '#FF5A3D',
    fontSize: 14,
    fontFamily: 'RethinkSans-Bold',
    marginLeft: 8
  },
  activityIndicator: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15
  },
})

export default styles;