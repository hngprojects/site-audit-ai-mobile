import { useTranslation } from '@/utils/translations';
import React from 'react';
import { Text, View } from 'react-native';

const ProfileEmptyState: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View>
      <Text style={{ fontSize: 16, fontFamily: 'RethinkSans-Regular', marginBottom: 10 }}>
        {t('profileEmpty.signInToView')}
      </Text>
    </View>
  );
};

export default ProfileEmptyState;

