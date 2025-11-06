import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

export default function AnimatedStar() {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();

    return () => {
      floatAnimation.stop();

    };
  }, []);


  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: floatAnim }
          ],
        },
      ]}
    >
      <Text style={styles.star}>🌟</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 48,
    marginBottom: 10,
  },
});