import { Dimensions, StyleSheet } from "react-native";


const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  skipButton: {
    position: "absolute",
    right: 20,
    top: 45,
    zIndex: 10,
  },
  skipText: { 
    fontSize: 16, 
    color: "#8b8b8b" 
 },

  slide: { 
    alignItems: "center", 
    justifyContent: "flex-start" 
 },

  image: {
    width: width * 0.97,
    height: "63%",
    marginTop: 10,
    marginLeft:- 8
  },
  privacyPolicy: {
    fontFamily: "RethinkSans-Regular",
    color: "#8b8b8b", 
    fontSize: 13
  },
  link: {
    textDecorationLine: "underline"
  },
  privacyContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center"
  },
   waveCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 55,
  },
  textContainer: {
    paddingHorizontal: "5%",
    marginBottom: 45,
    marginTop: -10
  },
  title: {
    fontSize: 22,
    fontFamily: "RethinkSans-Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "RethinkSans-Regular",
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },

  dotContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6142",
    marginHorizontal: 4,
  },

  nextButton: {
    height: 55,
    borderRadius: 12,
    backgroundColor: "#FF6142",
    justifyContent: "center",
    alignItems: "center",
  },
  androidNextButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#FF6142",
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: { 
    color: "#fff", 
    fontSize: 17, 
    fontWeight: "600" 
 },
});

export default styles;

