import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
         width: '100%',
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'center',
         paddingVertical: 6,
         paddingHorizontal: 16,
     },
     backButton: {
         position: 'absolute',
         left: 16,
     },
     selectButton: {
         position: 'absolute',
         right: 16,
         
     },
     selectButtonText: {
         fontSize: 14,
         color: '#FF5A3D',
         fontFamily: 'RethinkSans-Medium',
     },
     headerText: {
         fontSize: 20,
         lineHeight: 24,
         color: '#1c1c1c',
         fontFamily: 'RethinkSans-Bold',
         textAlign: 'center',
     },
    content: {
        paddingHorizontal: "5%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    mainTitle: {
        fontFamily: "RethinkSans-Bold",
        fontSize: 18,
        color: "#1c1c1c",
        textAlign: "center",
        marginBottom: 6,
        // paddingHorizontal: 24,
    },
    freeText: {
        color: "#1A2373",
    },
    description: {
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    descriptionText: {
        fontFamily: "RethinkSans-Regular",
        fontSize: 14,
        color: "#676767",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 16,
    },
    descriptionText2: {
        fontFamily: "RethinkSans-Bold",
        fontSize: 16,
        color: "#494949",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 16,
    },
    reviewHeaderPicture: {
        // width: 250,
        height: 110,
        marginBottom: 24,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    reviewPicture: {
        // width: 250,
        // height: 150,
        // marginTop: 16,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    buttonContainer: {
        width: "100%",
        gap: 12,
    },
    primaryButton: {
        height: 48,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: "#FF5A3D",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 90,
    },
    primaryButtonText: {
        fontSize: 16,
        fontFamily: "RethinkSans-Medium",
        color: "white",
    },
    secondaryButton: {
        height: 48,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FF5A3D",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    secondaryButtonText: {
        fontSize: 16,
        fontFamily: "RethinkSans-Medium",
        color: "#FF5A3D",
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        justifyContent: "center",
        // alignItems: "center",
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        // textAlign: 'center',
        marginBottom: 20,
    },
    issuesContainer: {
        width: '100%',
    },
    additionalNotesLabel: {
        fontSize: 16,
        color: '#1c1c1c',
        fontFamily: 'RethinkSans-SemiBold',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        height: 194,
        textAlignVertical: 'top',
        marginBottom: 20,
        width: '100%',
    },
})

export default styles;