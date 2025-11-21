import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

export const getNewPasswordStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: "5%",
    },
    backButton: { marginBottom: 20 },
    backArrow: { fontSize: 28 },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 5,
      color: colors.text,
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
      fontFamily: "RethinkSans-Bold",
      color: colors.text,
    },
    subTitle: {
      fontSize: 16,
      color: colors.subtitle,
      marginBottom: 15,
      lineHeight: 20,
      fontFamily: "RethinkSans-Regular",
    },
    label: {
      marginTop: 15,
      marginBottom: 5,
      fontSize: 15,
      color: colors.label,
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
      justifyContent: "space-between",
      borderColor: colors.icon,
    },
    passwordTextInput: {
      fontSize: 18,
      color: colors.text,
    },
    resetBtn: {
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 10,
      marginTop: 30,
    },
    resetBtnText: {
      textAlign: "center",
      color: colors.background,
      fontWeight: "700",
      fontSize: 16,
    },
    errorText: {
      color: colors.tint,
      fontFamily: "RethinkSans-Regular",
      fontSize: 14,
      marginTop: 8,
    },
  });
};