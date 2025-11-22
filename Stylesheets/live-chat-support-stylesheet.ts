import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 20,
    lineHeight: 24,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-Bold',
    flex: 1,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  supportMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',

  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  supportMessage: {
    backgroundColor: '#FF5A3D',
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    maxWidth: '100%',
    // marginRight: 50,
  },
  userMessage: {
    // alignSelf: 'flex-end',
    backgroundColor: '#E8E8E8',
    padding: 12,
    borderRadius: 12,
    borderTopRightRadius: 0,
    maxWidth: '100%',

  },
  messageText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#FFFFFF',
  },
  userMessageText: {
    color: '#1C1C1C',
  },
  messageTimestamp: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Regular',
    fontStyle: 'italic',
    // alignSelf: 'flex-end',
    marginTop: 4,
  },
  supportMessageTimestamp: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  userMessageTimestamp: {
    color: '#494949',

  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userSenderContainer: {
    justifyContent: 'flex-end',
  },
  senderAvatar: {
    width: 20,
    height: 20,
    borderRadius: 100,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FF7B64',
  },
  userSenderAvatar: {
    marginLeft: 6,
    marginRight: 0,
  },
  senderName: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#666666',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Regular',
    color: '#999999',
    marginTop: 4,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  inputContainerBox: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BBBCBC',
    borderRadius: 100,
    paddingHorizontal: 16,
    // backgroundColor: '#FAFAFA',
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#FF5A3D',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  // sendButtonText: {
  //   color: '#FFFFFF',
  //   fontSize: 12,
  //   fontFamily: 'RethinkSans-Bold',
  // },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
    gap: 12,
  },
  iconButton: {
    // paddingHorizontal: 8,
    // paddingVertical: 8,
  },
  emojiPickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
  },
  closeButton: {
    padding: 8,
  },
  emojiScrollView: {
    backgroundColor: '#fff',
    padding: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emojiButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  emoji: {
    fontSize: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
