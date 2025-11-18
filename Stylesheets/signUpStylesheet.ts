import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: "5%",
        backgroundColor: "#fff",
        flex: 1
    },
    logo: {
        alignItems: "center",
        marginTop: -60,
    },
    createAccountTitle: {
        color: "#000",
        fontFamily: "RethinkSans-Bold",
        fontSize: 20,
        marginTop: -55
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
    passwordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#babec6",
        borderRadius: 12,
        marginTop: 12
    },
    passwordTextInput: {
        fontSize: 20,
    },
    signUpButton: {
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
    signUpText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "RethinkSans-Regular"
    },
    continueWithSection: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 20
    },
    Line: {
        width: 85,
        height: 1,
        backgroundColor: "#676767"
    },
    continueText: {
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 15,
        marginHorizontal: 10
    },
    SocialSIgninButton: {
         width: '100%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#babec6",
        marginTop: 20,
        padding: 10, 
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 8,
        flexDirection: 'row',
    },
    AppleSocialSIgninButton: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#babec6",
        marginTop: 15,
        padding: 10, 
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 8,
        flexDirection: 'row',
    },
    Google: {
        color: "#000",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 16,
        marginLeft: 10,
    },
    SignInContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        marginTop: -20
    },
    existingAccountText: {
        marginTop: 40,
        marginRight: 10,
        color: "#bbbcbc",
        fontFamily: "RethinkSans-Regular",
        fontSize: 18
    },
    SignIN: {
         marginTop: 40,
        color: "blue",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 18
    },
})

export default styles;