import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    createAccountTitle: {
        color: "#000",
        fontFamily: "RethinkSans-Bold",
        fontSize: 20,
        marginBottom: 15
    },
    textInputLabel: {
        color: "#000",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 17,
        marginTop: 15
    },
    textInput: {
        fontSize: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#babec6",
        borderRadius: 12,
        marginTop: 12
    },
    continueButton: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: "#ff5a3d",
        marginTop: 35,
        padding: 10,
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 8
    },
    continueText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "RethinkSans-Regular"
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25
    },
    backarrow: {
        marginRight: 55,
        marginLeft: 15
    },
    headerText: {
         fontSize: 20,
        fontFamily: "RethinkSans-Bold"
    },
    VerificationContainer: {
        justifyContent: "center",
        alignItems: "center",

    },
    outerGlowCircle: {
        position: "absolute",
        top: 180,
        width: 120,
        height: 120,
        backgroundColor: "#ffccc3",
        borderRadius: 60,
        opacity: 0.25,
        shadowColor: "#e64e4e34",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 40,
        elevation: 20,
    },
    iosGlowCircle: {
        position: "absolute",
        top:200,
        width: 80,
        height: 80,
        backgroundColor: "#d32f2f",
        borderRadius: 60,
        opacity: 0.25,
        shadowColor: "#e64e4e34",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 40,
        elevation: 20,
    },
    androidGlowCircle: {
        position: "absolute",
        top:200,
        width: 80,
        height: 80,
        backgroundColor: "#d32f2f",
        borderRadius: 60,
        opacity: 0.25,
        shadowColor: "#e64e4e34",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 40,
        elevation: 20,
    },
    androidIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:220
    },
    iosIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:220
    },
    checkyourmail: {
        color: "#000",
        fontFamily: "RethinkSans-Bold",
        fontSize: 22,
        marginTop: 40
    },
    subText: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 15,
        fontFamily: "RethinkSans-Regular",
        textAlign: "center",
        color: "#929696ff",
        marginBottom: 68,
    },
    errorText: {
        color: "#ff5a3d",
        fontFamily: "RethinkSans-Regular",
        fontSize: 14,
        marginTop: 8,
    }

  })

export default styles;
