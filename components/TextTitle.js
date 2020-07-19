import React from "react";
import { StyleSheet, View, Text } from "react-native";

const TextTitle = (props) => {
  return <Text style={{...styles.text, ...props.style}}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "open-sans-bold",
    textAlign: "center",
    margin: 5,
    
  },
});

export default TextTitle;
