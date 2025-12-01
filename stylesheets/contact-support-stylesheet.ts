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
    marginBottom: 20,
  },
  supportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EFEFF1',
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Bold',
    fontWeight: '500',
    color: '#1C1C1C',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#979797',
  },
  supportItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportTextContainer: {
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
