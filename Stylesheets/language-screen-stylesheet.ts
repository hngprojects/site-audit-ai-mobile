import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: "5%",
        marginTop: '10%',
        backgroundColor: "#fff"
    },
    chooseYourLanguageTitle : {
        color: "#000",
        fontFamily: 'RethinkSans-Bold',
        fontSize: 20,
    },
    chooseYourLanguageText: {
        color: "#595959",
        fontFamily: 'RethinkSans-Regular',
        fontSize: 15,
        marginTop: 10,
    },
    yourSelectedLanguageTitle: {
        color: "#000",
        fontFamily: 'RethinkSans-Bold',
        fontSize: 20,
        marginTop: 30
    },
    selectedLanguageView: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 8,
        borderWidth: 1,
        borderColor: '#007595',
        borderRadius: 20,
        marginTop: 15
    },
    LanguageOptionView: {
        width: '100%',
        height: 330,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 17,
        borderColor: '#dfdfdfff'
    },
    searchContainer: {
        borderBottomColor: '#dfdfdfff',
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: 'center',
        padding: 10
    },
    textInput: {
        fontSize: 20,     
        padding: 10
    },
    countryList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        padding: 10,
        paddingHorizontal: 10,
    },
    countryListInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 7
    },
    Countryname: {
        marginLeft: 10,
        fontFamily: 'RethinkSans-Regular',
        fontSize: 15
    },
    continueButton: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: "#D32f2f",
        marginTop: 50,
        padding: 10, 
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 8
    },
    btnText: {
        color: "#fff",
        fontFamily: 'RethinkSans-Regular',
        fontSize: 18
    },
})

export default styles;

