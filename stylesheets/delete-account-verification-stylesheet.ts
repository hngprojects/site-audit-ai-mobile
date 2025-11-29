import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    textAlign: 'center',
    fontWeight: 700,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mainTitle: {
    fontSize: 18,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    // textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#494949c',
    // textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    // paddingHorizontal: 16,
  },
  codeInput: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#C7C8C9',
    borderRadius: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 0,
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    backgroundColor: 'white',
  },
  resendContainer: {
    gap: 8,
  },
  resendTextContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#666666',
  },
  resendLink: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: '#1A2373',
  },
  resendLinkDisabled: {
    color: '#B9B9B9',
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#666666',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: 'white',
    gap: 12,
  },
  verifyButton: {
    height: 48,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonActive: {
    backgroundColor: '#FF5A3D',
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: '#B9B9B9',
  },
  verifyButtonTextActive: {
    color: 'white',
  },
  cancelButton: {
    height: 48,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7C8C9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: '#666666',
  },
});

export default styles;

