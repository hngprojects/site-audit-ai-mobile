import { slides } from "@/constants/onboardingSlide";
import styles from "@/Stylesheets/onboarding-stylesheet";
import { Slide } from "@/type";
import { RelativePathString, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const { width } = Dimensions.get("window");




const Onboarding = () => {
    const router = useRouter();
    const inset = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);


  const handleViewableItemsChanged = useRef(
  (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    const first = info.viewableItems[0];
    if (first?.index != null) {
      setIndex(first.index);
    }
  }
).current;


  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 60,
  }).current;

  const handleNext = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      router.replace(`${"/(auth)/sign-up"}` as RelativePathString); 
    }
  };

  return (
    <View style={{...styles.container, paddingTop: inset.top, paddingBottom: inset.bottom - 15}}>
      
      <TouchableOpacity
      onPress={() => router.replace(`${"/(auth)/sign-up"}` as RelativePathString)} 
        style={styles.skipButton}
       >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />

           
            <View style={styles.waveCard}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

             
              <View style={styles.dotContainer}>
                {slides.map((_, i) => {
                  const inputRange = [
                    (i - 1) * width,
                    i * width,
                    (i + 1) * width,
                  ];

                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 22, 8],
                    extrapolate: "clamp",
                  });

                  return (
                    <Animated.View
                      key={i}
                      style={[styles.dot, { width: dotWidth }]}
                    />
                  );
                })}
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default Onboarding;

