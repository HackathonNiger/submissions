import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Gradient = ({
  title,
  onPress,
  Image,
  style,
  colors = ['#09573b', '#96c993ff', '#93c9b6'],
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}   // gradient starts at left
        end={{ x: 1, y: 0 }}     // gradient ends at right
        style={[styles.button, style]}
      >
        <View style={styles.content}>
          {Image&& <View style={styles.iconWrapper}>{Image}</View>}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',      // horizontal
    alignItems: 'center',      // vertically centered
    justifyContent: 'center',  // center icon + text
  },
  iconWrapper: {
    marginRight: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
    fontFamily: "sans-serif",
    letterSpacing: 1.5,
  },
});

export default Gradient;
