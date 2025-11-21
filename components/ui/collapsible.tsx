import { PropsWithChildren, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function Collapsible({ children, title, isLast, isFirst, isOpen, onToggle }: PropsWithChildren & { title: string; isLast?: boolean; isFirst?: boolean; isOpen: boolean; onToggle: () => void }) {
  const theme = useColorScheme() ?? 'light';

  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
  }, [isOpen]);

  return (
    <ThemedView>
      <TouchableOpacity
        style={[styles.heading, isFirst && styles.firstHeading, isLast && styles.lastHeading, isOpen && styles.headingOpen]}
        onPress={onToggle}
        activeOpacity={0.8}>


        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <IconSymbol
          name={isOpen ? "chevron.up" : "chevron.down"}
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
        />
      </TouchableOpacity>
      {isOpen && <ThemedView style={[styles.content, styles.contentOpen]}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 52,
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#BBBCBC',
    paddingHorizontal: 15,
  },
  headingOpen: {
    borderBottomWidth: 0,
  },
  firstHeading: {
    borderTopWidth: 0.5,
  },
  lastHeading: {
    // backgroundColor: '#FF5A3D',
    // borderBottomWidth: 0.5,
    // borderColor: '#3d3005ff',

  },
  content: {
    marginTop: 6,
    marginLeft: 15,

  },
  contentOpen: {
    borderBottomWidth: 0.5,
    borderColor: '#BBBCBC',
    paddingBottom: 16,
  },
});
