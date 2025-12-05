import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    checklistItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
  marginTop: 8,
  borderWidth: 1,
  backgroundColor: "#DFF4E7",
  borderColor: "#00ac42ff",
  borderRadius: 15,
  padding: 15,
  width: "100%"
},
checklistIcon: {
  marginRight: 12,
},
checklistText: {
  fontSize: 16,
  fontFamily: 'RethinkSans-SemiBold',
},
})

export default styles;