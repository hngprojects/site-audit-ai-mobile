import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 20, 
    paddingBottom: 12,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 20, 
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'RethinkSans-Bold',
    fontSize: 20,
    color: '#1C1C1C',
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  dateText: {
    fontFamily: 'RethinkSans-Italic',
    fontSize: 14,
    color: '#494949',
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'RethinkSans-SemiBold',
    fontSize: 18,
    color: '#1C1C1C',
    marginBottom: 8,
  },
  sectionBody: {
    fontFamily: 'RethinkSans-Regular',
    fontSize: 14,
    color: '#494949',
    lineHeight: 20,
  },
  contactEmail: {
    color: '#FF5A3D',
    fontFamily: 'RethinkSans-SemiBold', // Assuming it should stand out like a link
  },
});

export default styles;