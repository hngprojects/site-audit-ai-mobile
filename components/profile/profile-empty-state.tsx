import React from 'react';
import { Text, View } from 'react-native';

const ProfileEmptyState: React.FC = () => {
  return (
    <View>
      <Text style={{ fontSize: 16, fontFamily: 'RethinkSans-Regular', marginBottom: 10 }}>
        Please sign in to view your profile
      </Text>
    </View>
  );
};

export default ProfileEmptyState;

