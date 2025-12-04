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
    fontSize: 28,
    fontFamily: 'RethinkSans-Bold',
    color: '#1C1C1C',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerUrl: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#1A2373',
    textAlign: 'center',
  },
  reScanNote: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    minHeight: 120,
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
    color: '#000',
    marginTop: 12,
  },
  footer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  activityIndicatorWrapper: {
  justifyContent: "center",
  alignItems: "center",
},

activityIndicator: {
  width: 70,
  height: 70,
  backgroundColor: "#ffffff",
  borderRadius: 50,
  justifyContent: "center",
  alignItems: "center",
  elevation: 4, 
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},

progressBarContainer: {
  width: "100%",
  height: 8,
  backgroundColor: "#E4E7EB",
  borderRadius: 10,
  overflow: "hidden",
  marginTop: 12,
},

progressBarFill: {
  height: "100%",
  backgroundColor: "#ff5a3d",
  borderRadius: 10,
},

footerText: {
  textAlign: "center",
  fontSize: 13,
  color: "#8a8a8a",
  marginTop: 15,
  fontFamily: "RethinkSans-Medium",
},

checklistContainer: {
  width: '100%',
  marginTop: 20,
  paddingHorizontal: 10,
},

checklistItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

checklistIcon: {
  marginRight: 12,
},

checklistText: {
  fontSize: 16,
  fontFamily: 'RethinkSans-Regular',
},

});

export default styles;

