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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 8,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'RethinkSans-Bold',
    color: '#494949',
    
  },
  description: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#494949',
    lineHeight: 24,
  
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginTop: 40,
  },
  yesButton: {
    height: 48,
    backgroundColor: '#FF5A3D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: 'white',
  },
  noButton: {
    height: 48,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7C8C9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: '#666666',
  },
});

export default styles;