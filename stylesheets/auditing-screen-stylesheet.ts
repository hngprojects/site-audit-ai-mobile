import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
  },
  header: {
    alignItems: 'center',
    marginTop: 45,
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
    fontFamily: 'RethinkSans-SemiBold',
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
  newLoadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    width: 120,
    borderWidth: 3,
    borderRadius: 60,
    backgroundColor: '#fff', 
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

checklistContainer: {
  width: '100%',
  marginTop: 30,
  paddingHorizontal: "5%",
  justifyContent: "center",
  alignItems: "center",

},
hangTight: {
  fontFamily: 'RethinkSans-Medium',
  fontSize: 15,
  color: "#7a7474ff"
},

glowCircle: {
  position: "absolute",
  top: 2,
  width: 160,
  height: 160,
  borderRadius: 80,
  backgroundColor: "transparent",
  shadowColor: "#96bfa3",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 15,
  shadowRadius: 65,
  elevation: 40,
},

});

export default styles;

