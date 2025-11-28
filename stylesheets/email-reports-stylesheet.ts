import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 10,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsGroup: {
    backgroundColor: 'transparent',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7C8C9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    borderColor: '#ff5a3d',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff5a3d',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#1c1c1c',
  },
  buttonContainer: {
    marginTop: 32,
    width: '100%',
  },
  saveButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  saveButtonActive: {
    backgroundColor: '#ff5a3d',
  },
  saveButtonInactive: {
    backgroundColor: '#E8E8E8',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
  },
  saveButtonTextActive: {
    color: '#fff',
  },
  saveButtonTextInactive: {
    color: '#B9B9B9',
  },
});

export default styles;

