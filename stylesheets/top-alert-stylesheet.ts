import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  leadResponseSuccess: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    marginHorizontal: "5%",
    backgroundColor: "#e6f9ed",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#34a853",
    paddingVertical: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 9999,
    alignItems: 'center',
  },
  leadResponseSuccessText: {
    fontFamily: "RethinkSans-Medium",
    color: "#196f3d",
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles