import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface WaveCircleProps {
  size: number;
  completedSteps: number;
  totalSteps: number;
}

const WaveCircle: React.FC<WaveCircleProps> = ({
  size,
  completedSteps,
  totalSteps,
}) => {
  const fillProgress = useSharedValue(0);
  const wavePhase = useSharedValue(0);

  useEffect(() => {
    fillProgress.value = withTiming(completedSteps / totalSteps, { duration: 800 });
  }, [completedSteps, totalSteps]);

  useEffect(() => {
    wavePhase.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const progress = fillProgress.value;
    const phase = wavePhase.value;

    const height = size * (1 - progress);
    const amplitude = 6;
    const frequency = 2;

    let path = `M0 ${height}`;
    for (let i = 0; i <= frequency * 2; i++) {
      const x = (i * size) / (frequency * 2);
      const y =
        height +
        amplitude * Math.sin((i / (frequency * 2)) * Math.PI * 2 + phase * Math.PI * 2);
      path += ` L${x} ${y}`;
    }
    path += ` L${size} ${size} L0 ${size} Z`;

    return { d: path, fill: '#58A279' };
  });

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <AnimatedPath animatedProps={animatedProps} />
      </Svg>

      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.Text
          style={{ fontSize: size * 0.25 }}
        >
          <FontAwesome6 name="check" size={size * 0.25} color={"#fff"}/>
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: '#58A279',
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default WaveCircle;
