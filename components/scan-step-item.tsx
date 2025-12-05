import styles from "@/stylesheets/scan-step-item-stylesheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Text } from "react-native";

interface Props {
  text: string;
  index: number;
  active: boolean; 
}

const ScanStepItem = ({ text, index, active }: Props) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const typedValue = useRef(new Animated.Value(0)).current;
  const [visibleChars, setVisibleChars] = useState(0);

  const [caretVisible, setCaretVisible] = useState(true);


  // blinking caret for cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCaretVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  

  // animation + typing
  useEffect(() => {
    if (!active) return;

    // fade + slide
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      
      const anim = Animated.timing(typedValue, {
        toValue: text.length,
        duration: text.length * 80,
        useNativeDriver: false,
      });

      const listenerId = typedValue.addListener((v) => {
        setVisibleChars(Math.floor(v.value));
      });

      anim.start(() => {
        typedValue.removeListener(listenerId);
        
      });
    });
  }, [active]);

  return (
    <Animated.View
      style={[
        styles.checklistItem,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <MaterialCommunityIcons
        name="check-decagram"
        size={24}
        color="#58A279"
        style={styles.checklistIcon}
      />

      <Text style={[styles.checklistText, { color: "#58A279" }]}>
        {text.substring(0, visibleChars)}
        {visibleChars < text.length && caretVisible ? "|" : ""}
      </Text>
    </Animated.View>
  );
};

export default ScanStepItem;
