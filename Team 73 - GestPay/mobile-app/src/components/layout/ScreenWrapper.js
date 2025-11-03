import { View, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../utils/theme";

const ScreenWrapper = ({
  children,
  containerStyle,
  onLayout,
}) => {

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.surface,
        },
        containerStyle
      ]}
      onLayout={onLayout}
    >
      {children}
      <StatusBar 
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
    </View>
  );
};

export default ScreenWrapper;
