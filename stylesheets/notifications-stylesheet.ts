import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },

  cardLeft: {
    flex: 1,
    paddingRight: 12,
  },

  cardRight: {
    alignItems: 'flex-end',
    minWidth: 64,
  },

  title: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#111',
  },

  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    fontFamily: 'RethinkSans-Regular',
  },

  time: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Regular',
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FF6A45',
    marginTop: 8,
  },

  deleteButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },

  deleteText: {
    color: '#FF4D4F',
    fontSize: 12,
    fontFamily: 'RethinkSans-Regular',
  },

  notificationsContainer: {
    flex: 1,
    marginTop: 16,
  },
  itemIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  rightAction: {
    backgroundColor: '#FF4D4F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: 12,
    marginVertical: 6,
  },

  rightActionText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'RethinkSans-SemiBold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBBCBC',
    backgroundColor: '#fff',
    height: 50,
    marginTop: 6,
  },
  androidSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBBCBC',
    backgroundColor: '#fff',
    marginTop: 6,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontFamily: 'RethinkSans-Regular',
  },

  emptyIcon: {
    width: 40,
    height: 40,
    marginBottom: 12,
    tintColor: '#E0E0E0',
    resizeMode: 'contain',
  },

  itemIconContainer: {
    // padding: 12,
    backgroundColor: '#edededff',
    width: 50,
    height: 50,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // position: 'relative',
    // alignContent: 'space-evenly',
    justifyContent: 'center',
    
  },
 
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },

  headerTitle: {
    textAlign: 'center',
    // flex: 1,
    fontSize: 24,
    color: '#111',
    fontFamily: "RethinkSans-Bold"
  },
  androidheaderTitle: {
    textAlign: 'center',
    // flex: 1,
    fontSize: 24,
    color: '#111',
  },

  markAllButton: {
    position: 'absolute',
    right: -10,
    zIndex: 1,
  },

  loadingPadding: {
    paddingTop: 16,
  },

  errorPadding: {
    paddingTop: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },

  emptyIconContainer: {
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#edededc1',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonPadding: {
    padding: 8,
  },

  separator: {
    height: 8,
  },

  listContainer: {
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },

  skeletonCard: {
    opacity: 0.6,
    backgroundColor: '#f2f2f2',
  },

  skeletonText: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },

  skeletonMessage: {
    backgroundColor: '#e9e9e9',
    borderRadius: 6,
  },

  skeletonTime: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },

  cardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    paddingVertical: 10,
  },

  titleText: {
    flex: 1,
  },

  messageText: {
    marginTop: 6,
  },

  markAllText: {
    color: '#FF5A3D',
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',

  },
  markAllTextAndroid: {
    color: '#FF5A3D',
    fontSize: 12,
    fontFamily: 'RethinkSans-Medium',

  },

  searchMargin: {
    marginTop: 12,
  },

  loadingIndicator: {
    marginTop: 20,
  },
});

export default styles;
