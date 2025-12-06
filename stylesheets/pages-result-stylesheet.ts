import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
     marginTop: 20,
  },
  domainContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  domainText: {
    fontSize: 18,
    fontFamily: 'RethinkSans-Bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#666',
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingBottom: 20,
    lineHeight: 22,
     marginTop: 20,
  },
  pagesContainer: {
    paddingHorizontal: 15,
     marginTop: 20,
  },
  pageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageName: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Bold',
    color: '#000',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highPriorityBadge: {
    backgroundColor: '#fce4ec',
  },
  mediumPriorityBadge: {
    backgroundColor: '#fff3e0',
  },
  lowPriorityBadge: {
    backgroundColor: '#e8f5e8',
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Medium',
  },
  highPriorityText: {
    color: '#c2185b',
  },
  mediumPriorityText: {
    color: '#f57c00',
  },
  lowPriorityText: {
    color: '#2e7d32',
  },
  pageUrl: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Medium',
    color: '#1A2373',
    marginBottom: 8,
  },
  pageMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Regular',
    color: '#888',
  },
  pageDescription: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: "row",
    gap: 1,
    marginTop: 12,
    alignItems: "center",
  },
  scanButtonText: {
    fontFamily: "RethinkSans-Medium",
    color: "#FF5A3D",
    fontSize: 15,
  },
  scanButtonArrow: {
    color: "#FF5A3D",
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 30,
  },
  noPagesContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  noPagesTitle: {
    fontSize: 24,
    fontFamily: 'RethinkSans-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  noPagesSubtitle: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  reasonsList: {
    alignSelf: 'stretch',
    marginBottom: 30,
  },
  reasonText: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  whatYouCanDoTitle: {
    fontSize: 18,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF5A3D',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FF5A3D',
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
  },
  primaryButton: {
    backgroundColor: '#FF5A3D',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
  },
});

export default styles;