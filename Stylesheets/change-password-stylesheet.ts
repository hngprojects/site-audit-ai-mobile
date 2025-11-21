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
    paddingTop: 16,
  },
  formSection: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'RethinkSans-SemiBold',
    color: '#1c1c1c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7C8C9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#1c1c1c',
    backgroundColor: 'white',
    height: 48,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D32F2F',
    fontFamily: 'RethinkSans-Medium',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 40,
    marginBottom: 40,
  },
  updateButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#FF5A3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: 'white',
  },
  cancelButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF5A3D',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-Medium',
    color: '#FF5A3D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;

