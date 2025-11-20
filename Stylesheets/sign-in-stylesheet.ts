import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: "5%",
        backgroundColor: "#fff",
        flex: 1
    },
    logo: {
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 20,
        width: 150,
        height: 40,
        resizeMode: 'contain'
    },
    createAccountTitle: {
        color: "#000",
        fontFamily: "RethinkSans-Bold",
        fontSize: 20,
        marginTop: -45
    },
    textInputLabel: {
        color: "#000",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 17,
        marginTop: 15
    },
    textInput: {
        fontSize: 16,     
        padding: 12,
        borderWidth: 1,
        borderColor: "#babec6",
        borderRadius: 12,
        marginTop: 8
    },
    passwordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 8
    },
    passwordTextInput: {
        fontSize: 16,
        flex: 1,
    },
    // RENAMED from signUpButton for clarity
    signInButton: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: "#ff5a3d",
        marginTop: 35,
        padding: 10, 
        justifyContent: "center",
        alignItems: 'center',
    },
    // RENAMED from signUpText for clarity
    signInText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "RethinkSans-Bold"
    },
    continueWithSection: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 25
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
        marginTop: 35,
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
    incorrectPassword: {
        color: "#ff5a3d",
        fontFamily: "RethinkSans-Regular",
        fontSize: 14,
        marginTop: 8
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 12
    },
    forgotPasswordText: {
        color: "#ff5a3d",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 14,
    },
    // --- ADDED MISSING STYLES ---
    tipBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    lightBulbIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    tipText: {
        flex: 1,
        fontFamily: "RethinkSans-Regular",
        fontSize: 14,
        color: '#494949',
    },
    signUpButtonContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    signUpButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpButtonText: {
        color: "#ff5a3d",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 16,
    },
    SignUpContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20
    },
    existingAccountText: {
        marginRight: 5,
        color: "#676767",
        fontFamily: "RethinkSans-Regular",
        fontSize: 16
    },
    SignUp: {
        color: "#ff5a3d",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 16
    },
})

export default styles;

