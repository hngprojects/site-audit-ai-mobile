import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 18,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  headerWrap: {
    marginTop: 18,
    marginBottom: 12,
    alignItems: "center",
  },
  title: {
    fontFamily: "RethinkSans-Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  searchContainer: {
    marginTop: 14,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#c0c0c0ff",
    paddingHorizontal: 12,
    justifyContent: "flex-start",
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchText: {
    fontFamily: "RethinkSans-Medium",
    color: "#000000",
    fontSize: 14,
    marginLeft: 4,
    marginTop: 3,
  },

  listWrap: {
    paddingBottom: 120, 
  },


  footerSpacer: {
    height: 90,
    width,
  },
});