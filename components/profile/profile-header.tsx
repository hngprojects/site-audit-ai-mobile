import React from 'react';
import { Text, View } from 'react-native';
import styles from '../../stylesheets/profile-stylesheet';

interface ProfileHeaderProps {
  text: string;
  back?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ text }) => {
  return (
    <View style={styles.tabHeader}>
      <Text style={styles.tabHeaderText}>{text}</Text>
    </View>
  );
};

export default ProfileHeader;

