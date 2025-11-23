import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'RethinkSans-Bold',
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerUrl: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#555',
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    minHeight: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  contentText: {
    fontSize: 15,
    fontFamily: 'RethinkSans-Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  progress: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  progressText: {
    fontSize: 18,
    fontFamily: 'RethinkSans-SemiBold',
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
  },
  footer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});

export default styles;

