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
    paddingBottom: 40,
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
  title: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#1c1c1c',
    flex: 1,
    textAlign: 'center',
  },
  warningContainer: {
    marginTop: 15,
    marginBottom: 15,
    gap: 12,
    paddingHorizontal: 16,
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
    // borderTopWidth: 1,
    // borderTopColor: '#F0F0F0',
    gap: 12,
  },
  cancelButtonUnselected: {
    flex: 1,
    height: 48,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonSelected: {
    flex: 1,
    height: 48,
    backgroundColor: '#FF5A3D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonTextUnselected: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: '#B9B9B9',
  },
  cancelButtonTextSelected: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: '#fff',
  },
  deleteButton: {



    
    flex: 1,
    height: 48,
    backgroundColor: '#FF5A3D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  deleteButtonUnselected: {
    flex: 1,
    height: 48,
    backgroundColor: '#ffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonSelected: {
    flex: 1,
    height: 48,
    // backgroundColor: '#FF5A3D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBBCBC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: '#1C1C1C',
  },
});

export default styles;

