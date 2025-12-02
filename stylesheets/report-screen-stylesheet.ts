import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  headerWrap: {
    marginTop: 18,
    marginBottom: 12,
    alignItems: "center",
  },
  title: {
    fontFamily: "RethinkSans-Bold",
    fontSize: 20,
    color: "#111827",
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
  },

  listWrap: {
    paddingBottom: 120,
  },


  footerSpacer: {
    height: 90,
    width,
  },
  swipeableContainer: {
    position: 'relative',
  },
  swipeableContent: {
    backgroundColor: 'transparent',
  },
  deleteAction: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  deleteIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 12,
  },
  skeletonCard: {
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
    marginBottom: 0,
  },
  skeletonLeft: {
    flex: 1,
  },
  skeletonRight: {
    alignItems: 'flex-end',
  },
  skeletonText: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    height: '100%',
  },
  editAction: {
    width: 80,
    height: '100%',
    backgroundColor: '#ff5a3d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'RethinkSans-Medium',
    marginTop: 4,
  },
  actionTextDelete: {
    color: '#494949',
    fontSize: 12,
    fontFamily: 'RethinkSans-Medium',
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  urlText: {
    fontFamily: 'RethinkSans-SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  scanDateText: {
    fontFamily: 'RethinkSans-Medium',
    fontSize: 12,
    color: '#9CA3AF',
  },
  menuButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  startNewScanButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#ff5a3d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  startNewScanText: {
    fontFamily: 'RethinkSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});