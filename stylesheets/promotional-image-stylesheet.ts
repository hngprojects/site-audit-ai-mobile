import { Dimensions, StyleSheet } from "react-native";


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  bg: {
    width: width - 40,
    height: height * 0.8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  card: {
    width: "85%",
    height: "92%",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 22,
    borderRadius: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iosCard: {
    width: "85%",
    height: "85%",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 22,
    borderRadius: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },

  tagline: {
    fontSize: 16,
    fontFamily: "RethinkSans-SemiBold",
    letterSpacing: 1,
    fontWeight: "700",
    color: "blue",
    marginBottom: 10,
    marginTop: -3
  },
  iostagline: {
    fontSize: 16,
    fontFamily: "RethinkSans-SemiBold",
    letterSpacing: 1,
    fontWeight: "700",
    color: "blue",
    marginTop: 15
  },

  mainTitle: {
    fontSize: 26,
    fontFamily: "RethinkSans-Bold",
    textAlign: "center",
    color: "#000",
    marginVertical: 10,

  },
  iosMainTitle: {
    fontSize: 30,
    fontFamily: "RethinkSans-Bold",
    textAlign: "center",
    color: "#000",
    marginTop: -15
  },
  subText: {
    fontSize: 16,
    fontFamily: "RethinkSans-Medium",
    textAlign: "center",
    color: "#000",
    lineHeight: 24,
    paddingHorizontal: 12,
    marginTop: 15,
  },
  iosSubText: {
    fontSize: 19,
    fontFamily: "RethinkSans-Medium",
    textAlign: "center",
    color: "#000",
    lineHeight: 24,
    paddingHorizontal: 12,

  },

  brandAccent: {
    color: "#F04438",
    fontWeight: "800",
  },

  websiteBox: {
    backgroundColor: "#F6F6F6",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: "100%",
    marginTop: 5,
  },
  iosWebsiteBox: {
    backgroundColor: "#F6F6F6",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: "100%",
    marginTop: -20
  },

  websiteLabel: {
    fontSize: 18,
    color: "#000",
    fontFamily: "RethinkSans-Bold",
    marginBottom: 1,
    textAlign: "center",
  },

  websiteValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F04438",
    textAlign: "center",
  },

  downloadBox: {
    width: "100%",
    alignItems: "center",
  },
  iosDownloadBox: {
    width: "100%",
    alignItems: "center",
    marginTop: -25
  },

  downloadText: {
    fontSize: 15,
    fontFamily: "RethinkSans-Medium",
    color: "#000",
    marginBottom: 20,
  },
  iosDownloadText: {
    fontSize: 16,
    fontFamily: "RethinkSans-Medium",
    color: "#000",
    marginBottom: 20,
  },

  storeRow: {
    gap: 7,
    marginBottom: 10
  },
  iosStoreRow: {
    gap: 7,
  },

  storeBadge: {
    backgroundColor: "#000",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    padding: 10,
    alignItems: "center"
  },

  storeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  getOn: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "RethinkSans-Regular"
  },

  footer: {
    fontSize: 12,
    fontFamily: "RethinkSans-Bold",
    color: "#000",
    textAlign: "center",
  },
  iosFooter: {
    fontSize: 16,
    fontFamily: "RethinkSans-Bold",
    color: "#000",
    textAlign: "center",
    marginTop: -25
  },
  downloadImage: {
    width: 25,
    height: 25,
    color: "#fff",
    marginLeft: -6,
    marginRight: 10
  },
  googlePlayDownloadImage: {
    width: 25,
    height: 25,
    color: "#fff",
    marginLeft: -6,
    marginRight: 10
  },
});

export default styles;
