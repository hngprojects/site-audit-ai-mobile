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
    paddingVertical: 16,
    paddingTop: 60,
    paddingHorizontal: 16,
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingTop: 6,
    paddingHorizontal: 16,
    
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-Regular',
  },
  contactSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  confusedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1C',
    fontFamily: 'RethinkSans-Regular',
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF5A3D',
    fontFamily: 'RethinkSans-Regular',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;

