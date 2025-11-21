import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 16
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom buttons
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    textAlign: 'center',
  },
  warningContainer: {
    marginBottom: 32,
    gap: 12,
  },
  warningIcon: {
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#1c1c1c',
    lineHeight: 20,
  },
  feedbackContainer: {
    gap: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#1c1c1c',
    marginBottom: 16,
  },
  optionsGroup: {
    backgroundColor: '#Fff',
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 69,
    paddingHorizontal: 16,
    gap: 12,
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
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#C7C8C9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    borderColor: '#1A2373',
    backgroundColor: '#1A2373',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#1c1c1c',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34, // Safe area
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: '#C7C8C9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: 'white',
  },
  deleteButton: {



    
    flex: 1,
    height: 48,
    backgroundColor: '#FF5A3D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: '#1c1c1c',
  },
});

export default styles;

