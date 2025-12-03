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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  header: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 48,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'RethinkSans-Bold',
    color: '#1A2373',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#494949',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  doneButton: {
    height: 48,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF5A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: '#FF5A3D',
  },
  reactivateButton: {
    height: 48,
    backgroundColor: '#FF5A3D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactivateButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: 'white',
  },
});

export default styles;

