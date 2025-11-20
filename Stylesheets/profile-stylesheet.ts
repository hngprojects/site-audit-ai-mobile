import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  tabHeader: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabHeaderText: {
    color: '#1c1c1c',
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'RethinkSans-Bold',
  },
  profileContent: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  profilePictureContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#333333',
    borderRadius: 35,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: '#1A2373',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 4,
    marginTop: 16,
  },
  userName: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-SemiBold',
  },
  userEmail: {
    fontSize: 12,
    lineHeight: 14,
    color: '#494949',
    fontFamily: 'RethinkSans-Regular',
  },
  accountSettingsContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 24,
    marginTop: 32,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1c',
    marginBottom: 12,
    fontFamily: 'RethinkSans-SemiBold',
  },
  settingsList: {
    width: '100%',
    gap: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: '#C7C8C9',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsItemText: {
    fontSize: 14,
    color: '#1c1c1c',
    fontFamily: 'RethinkSans-Regular',
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: '#FF5A3D',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;

