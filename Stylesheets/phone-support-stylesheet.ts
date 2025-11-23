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
    paddingVertical: 6,
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'RethinkSans-Bold',
    color: '#1C1C1C',
    textAlign: 'left',
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    borderColor: '#E6F1F4',
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
    
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  sectionTitleHours: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Medium',
    color: '#1C1C1C',
    marginBottom: 10,
  },
  status: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Regular',
    color: '#28A745',
    marginBottom: 12,
    backgroundColor: '#E8F1EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  callButton: {
    backgroundColor: '#FF5A3D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,


  },
  callButtonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF5A3D',
    alignItems: 'center',
    marginTop: 10,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RethinkSans-Bold',
  },
  callButtonTextSecondary: {
    color: '#FF5A3D',
    fontSize: 16,
    fontFamily: 'RethinkSans-Bold',
  },
  sectionHours: {
    marginBottom: 24,
    backgroundColor: '#FFF9F8',
    borderRadius: 12,
    borderColor: '#FFB3A6',
    borderWidth: 0.5,
    padding: 16,
  },
  hoursText: {
    fontSize: 12,
    fontFamily: 'RethinkSans-Regular',
    color: '#666666',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;