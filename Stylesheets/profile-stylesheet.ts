import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#ff5a3d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: '5%',
    paddingTop: 12,
    maxHeight: '90%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginTop: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 243,
    height: 103,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  socialButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#babec6',
    marginBottom: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
  },
  socialIcon: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  appleIcon: {
    height: 35,
    width: 35,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#000',
    fontFamily: 'RethinkSans-SemiBold',
    fontSize: 16,
  },
  emailButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#ff5a3d',
    marginBottom: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
  },
  emailButtonSecondary: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#babec6',
    backgroundColor: 'transparent',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emailButtonSecondaryText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
  },
  footer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'RethinkSans-Regular',
    color: '#555',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});

export default styles;

