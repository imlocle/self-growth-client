/**
 * Animation system for subtle, calming interactions
 * 
 * Philosophy:
 * - Smooth, natural timing functions
 * - Subtle movements reduce anxiety
 * - Consistent durations throughout app
 */

export const animations = {
  // Durations (in milliseconds)
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    slower: 600,
  },
  
  // Easing functions (for Animated API)
  easing: {
    // Standard ease for most interactions
    standard: "ease-in-out",
    // Smooth deceleration for entering elements
    decelerate: "ease-out",
    // Smooth acceleration for exiting elements
    accelerate: "ease-in",
    // Bouncy feel for playful interactions
    spring: "spring",
  },
  
  // Common animation configs
  fadeIn: {
    duration: 300,
    useNativeDriver: true,
  },
  fadeOut: {
    duration: 200,
    useNativeDriver: true,
  },
  slideIn: {
    duration: 300,
    useNativeDriver: true,
  },
  scale: {
    duration: 200,
    useNativeDriver: true,
  },
};
