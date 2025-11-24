import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    gap: 4,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    
  },
  title: {
    fontSize: 24,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#494949',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  email: {
    color: '#FF5A3D',
  },
  checkmarkContainerOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: 120,
    width: 120,
    backgroundColor: 'rgba(102, 161, 122, 0.3)',
    borderRadius: 100,
    
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 81.2,
    width: 81.2,
    backgroundColor: 'rgba(27, 122, 24, 0.4)',
    borderRadius: 100,
  },
  doneButton: {
    backgroundColor: '#FF5A3D',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginHorizontal: -20,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'RethinkSans-Bold',
  },
});

export default styles;

