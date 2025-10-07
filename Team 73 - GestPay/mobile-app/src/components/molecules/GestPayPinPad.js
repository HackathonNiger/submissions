import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Fingerprint, Face } from 'lucide-react-native'; 
import theme from '../../utils/theme'; 

const GestPayPinPad = ({
    onPressNumber,
    onPressBackspace,
    onPressBiometric,
    allowBiometrics = false,
  }) => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
    ];
  
    const BiometricIcon = Platform.OS === 'ios' ? Face : Fingerprint;
  
    return (
      <View style={styles.container}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.button}
                onPress={() => onPressNumber(num)}
              >
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.row}>
          {allowBiometrics ? (
            <TouchableOpacity
              style={styles.button}
              onPress={onPressBiometric}
            >
              <BiometricIcon
                color={theme.colors.accent}
                size={32}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.button} /> // Empty placeholder
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressNumber('0')}
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={onPressBackspace}
          >
            <Text style={styles.buttonText}>⌫</Text> 
          </TouchableOpacity>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    ...theme.typography.heading,
    fontSize: 32,
    color: theme.colors.text.primary,
  },
});

export default GestPayPinPad;