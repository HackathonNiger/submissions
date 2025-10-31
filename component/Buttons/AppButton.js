import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppButton = ({ 
  title, 
  onPress, 
  icon, 
  style, 
  textStyle, 
  iconWrapperStyle 
}) => {
  return (
    <SafeAreaView>
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <View style={[styles.iconWrapper, iconWrapperStyle]}>{icon}</View>}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
    {/* <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <View style={[styles.iconWrapper, iconWrapperStyle]}>{icon}</View>}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity> */}

    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
      },
    }),
  },
  iconWrapper: {
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default AppButton;
