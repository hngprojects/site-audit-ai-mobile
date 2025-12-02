import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  headerText: {
    fontSize: 20,
    lineHeight: 24,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-Bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  lastUpdatedText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666666',
    fontFamily: 'RethinkSans-Regular',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-SemiBold',
    marginBottom: 8,
  },
  listHeader: {
    fontSize: 14,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-Medium',
    marginBottom: 8,
  },
  bulletList: {
    gap: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#1A2373',
    fontFamily: 'RethinkSans-Regular',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-Regular',
    flex: 1,
  },
  emailHighlight: {
    color: '#FF5A3D',
    fontFamily: 'RethinkSans-Regular',
    textDecorationLine: 'underline',
  },
  linkText: {
    color: '#1A2373',
    fontFamily: 'RethinkSans-Regular',
    textDecorationLine: 'underline',
  },
  contactSection: {
    marginTop: 1,
  },
  contactHeader: {
    fontSize: 16,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-SemiBold',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#FF5A3D',
    fontFamily: 'RethinkSans-Regular',
    marginBottom: 4,
  },
  contactLink: {
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;