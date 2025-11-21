import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: "5%",
  },

  backButton: { marginBottom: 20 },
  backArrow: { fontSize: 28 },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
  },
  headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25
    },
    backarrow: {
        marginRight: 75,
        marginLeft: 15,
    },
    headerText: {
         fontSize: 20,
        fontFamily: "RethinkSans-Bold"
    },

  subTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: "RethinkSans-Regular",
  },

  label: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 15,
    color: "#555",
    fontFamily: "RethinkSans-Regular",
  },

  input: {
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  passwordTextInput: {
        fontSize: 18,
    },
  resetBtn: {
    backgroundColor: "#FF6A45",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
  },

  resetBtnText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    color: "#ff5a3d",
    fontFamily: "RethinkSans-Regular",
    fontSize: 14,
    marginTop: 8,
  },
});
