import React, { Component } from 'react'
import { Text, Image, View, StyleSheet } from 'react-native'

export default class ContentPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* Image section */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../../assets/Scan.png')}
            style={styles.banner}
            resizeMode="contain"
          />
        </View>

        {/* Middle big text */}
        <View style={styles.middleText}>
          <Text style={styles.headline}>
            Join millions protecting medication authenticity worldwide
          </Text>
        </View>

        {/* Bottom footer text */}
        <Text style={styles.footerText}>We are here for you</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#BAFBBA', 
    paddingHorizontal: 20,
    paddingVertical: 110,
  },
  bannerContainer: {
    flexGrow: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '80%',
    height: undefined,
    aspectRatio: 1, // keeps it square
  },
  middleText: {
    marginVertical: 50,
    paddingHorizontal: 10,
  },
  headline: {
    fontSize: 10,
    color: "#0e59a3",
    textAlign: "center",
    fontWeight: '600',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94FE94',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 5, // much smaller, looks like footer
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
