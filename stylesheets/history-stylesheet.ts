import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 4,
  },
  siteName: {
    flex: 1,
    fontFamily: "RethinkSans-Bold",
    fontSize: 20,
    color: "#393D44",
    textAlign: 'center',
    marginHorizontal: 12,
  },
  selectButton: {
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 14,
    color: "#FF5A3D",
  },
  searchContainer: {
    marginTop: 14,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BBBCBC",
    paddingHorizontal: 12,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchText: {
    fontFamily: "RethinkSans-Medium",
    color: "#000000",
    fontSize: 14,
    marginLeft: 4,
    marginTop: 3,
    flex: 1,
  },
  monthHeader: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  monthHeaderText: {
    fontFamily: "RethinkSans-Medium",
    fontSize: 18,
    color: "#1A2373",
  },
  sectionHeader: {
    // paddingBottom: 12,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  sectionHeaderText: {
    fontFamily: "RethinkSans-Medium",
    fontSize: 16,
    color: "#6B7280",
  },
  sectionSeparator: {
    height: 8,
  },
  listWrap: {
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#BBBCBC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 4,
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardLeftWithCheckbox: {
    marginRight: 0,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  urlText: {
    fontFamily: 'RethinkSans-SemiBold',
    fontSize: 14,
    color: '#494949',
    marginBottom: 6,
  },
  scoreText: {
    fontFamily: 'RethinkSans-Medium',
    fontSize: 14,
    color: '#494949',
    marginBottom: 4,
  },
  scanDateText: {
    fontFamily: 'RethinkSans-Medium',
    fontSize: 12,
    color: '#939393',
  },
  scanTimeText: {
    fontFamily: 'RethinkSans-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    height: 12,
  },
  footerSpacer: {
    height: 20,
    width,
  },
  listWrapWithButton: {
    paddingBottom: 100,
  },
  deleteButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deleteButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FF5A3D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  deleteButtonText: {
    fontFamily: 'RethinkSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  deleteButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

