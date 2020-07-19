import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import TextTitle from "./TextTitle";
import TextBody from "./TextBody";
import ButtonStyled from "./ButtonStyled";
import colors from "../constants/colors";


const CallapseOrder = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <TextTitle style={{ fontSize: 18 }}>${props.sum}</TextTitle>
        <TextBody>{props.date.toLocaleString("en-US", options)}</TextBody>
      </View>
      <ButtonStyled
        title={isOpen ? "hide detail" : "show detail"}
        color={colors.primary}
        onPress={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen
        ? props.orderList.map((item, index) => (
            <View key={index} style={styles.items}>
              <TextBody>
                {item.quantity} <TextTitle>{item.title}</TextTitle>
              </TextBody>
              <View style={styles.trash}>
                <TextTitle>
                  ${(item.price * item.quantity).toFixed(2)}
                </TextTitle>
              </View>
            </View>
          ))
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: "90%",
      shadowColor: "black",
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      shadowOpacity: 0.5,
      borderRadius: 10,
      elevation: 5,
      margin: 5,
      padding: 10,
      alignSelf: "center",
    },
    totalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    items: {
      flexDirection: "row",
      width: "85%",
      justifyContent: "space-between",
      alignSelf: "center",
      marginVertical: 5,
    },
  });

export default CallapseOrder;
