import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Colors from '../../assets/Colors.json';

export default class Button extends Component {
  render() {
    const {
      color,
      fontColor = Colors.white,
      fontSize = 16,
      textStyle,
      style,
      onPress,
      onLongPress,
      title,
      disabled,
      height = 50,
      width = 200,
      padding = 4,
      shadow = true,
      bgColor = Colors.blue
    } = this.props;

    return (
      <TouchableOpacity
        disabled={disabled}
        style={[
          disabled || !shadow ? {} : styles.shadow,
          styles.container,
          {
            backgroundColor: bgColor,
            height,
            borderRadius: 8,
            width,
            alignSelf: 'center',
            marginVertical: 4,
            padding,
          },
          style,
        ]}
        onPress={() => onPress && onPress()}
        onLongPress={() => onLongPress && onLongPress()}
        activeOpacity={0.5}>
        {this.props.children || (
          <View style={styles.defaultTextBox}>
            {title ?
              <Text
                type={'bold'}
                size={fontSize}
                fit={true}
                numberOfLines={1}
                style={{ ...styles.defaultText, ...textStyle, color: fontColor }}
              >
                {title}
              </Text>
              :
              <View />}
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    // flex:1,
  },
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  icon: {
    fontSize: 30,
  },
  defaultTextBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  defaultText: {
    marginHorizontal: 5,
  },
});
