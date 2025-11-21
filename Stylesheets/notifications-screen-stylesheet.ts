import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
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
    fontWeight: '600',
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
    backgroundColor: 'red',
    display:"flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: 74
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDEDED',
    backgroundColor: '#fff',
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    height: 36,
    fontFamily: 'RethinkSans-Regular',
  },

  emptyIcon: {
    width: 40,
    height: 40,
    marginBottom: 12,
    tintColor: '#E0E0E0',
    resizeMode: 'contain',
  },

  headerTitle: {
    color: '#111',
    fontSize: 24,
  },

  markAllRead: {
    color: '#FF6A45',
  },

  unreadTitle: {
    color: '#111',
  },

  readTitle: {
    color: '#9f9f9fff',
  },

  unreadTime: {
    color: '#111',
  },

  readTime: {
    color: '#666',
  },

  unreadMessage: {
    color: '#444',
  },

  readMessage: {
    color: '#888',
  },
});

export default styles;
