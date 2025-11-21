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
  content: {
    flex: 1,
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  lastUpdatedText: {
    fontSize: 14,
    fontWeight: '400',
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
    fontWeight: '600',
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-SemiBold',
    marginBottom: 8,
  },
  listHeader: {
    fontSize: 14,
    fontWeight: '400',
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
  },
  contactSection: {
    marginTop: 1,
  },
  contactHeader: {
    fontSize: 16,
    fontWeight: '600',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;