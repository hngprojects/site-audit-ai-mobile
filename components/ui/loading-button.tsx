import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface LoadingButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  text: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
  text,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, (loading || disabled) && styles.disabled]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#ff5a3d',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RethinkSans-Regular',
  },
});

