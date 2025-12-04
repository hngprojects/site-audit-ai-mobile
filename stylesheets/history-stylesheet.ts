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
    fontFamily: "RethinkSans-SemiBold",
    fontSize: 18,
    color: "#111827",
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
    borderColor: "#c0c0c0ff",
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
    paddingVertical: 12,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  urlText: {
    fontFamily: 'RethinkSans-SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: {
    fontFamily: 'RethinkSans-Bold',
    fontSize: 12,
    color: '#0EA472',
  },
  scanDateText: {
    fontFamily: 'RethinkSans-Medium',
    fontSize: 12,
    color: '#9CA3AF',
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
});

