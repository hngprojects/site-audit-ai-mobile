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
        marginTop: -55
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
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 8,
        height: 50
    },
    passwordTextInput: {
        fontSize: 16,
        flex: 1,
    },
    incorrectPassword: {
        color: '#ff5a3d',
        marginTop: 5,
        fontFamily: "RethinkSans-Regular",
    },
    signUpButton: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: "#ff5a3d",
        marginTop: 25,
        justifyContent: "center",
        alignItems: 'center',
    },
    signUpText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "RethinkSans-Bold"
    },
    // --- ADDED MISSING STYLES ---
    passwordRequirements: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    requirementsTitle: {
        fontFamily: 'RethinkSans-SemiBold',
        fontSize: 14,
        color: '#1C1C1C',
        marginBottom: 8,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    requirementText: {
        fontFamily: 'RethinkSans-Regular',
        fontSize: 14,
        color: '#494949',
        marginLeft: 8,
    },
    requirementTextValid: {
        color: '#4CAF50', // Green color for valid requirements
        textDecorationLine: 'none', // No strikethrough for better readability
    },
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
    signInButtonContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    signInButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInButtonText: {
        color: "#ff5a3d",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 16,
    },
    // --- END ADDED STYLES ---
    SignInContainer: {
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
    SignIN: {
        color: "#ff5a3d",
        fontFamily: "RethinkSans-SemiBold",
        fontSize: 16
    },
})

export default styles;

