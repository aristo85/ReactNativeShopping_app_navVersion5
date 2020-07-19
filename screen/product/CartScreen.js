import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import TextTitle from "../../components/TextTitle";
import TextBody from "../../components/TextBody";
import { Ionicons } from "@expo/vector-icons";
import { deleteFromCart, onOrder } from "../../store/actions";

const CartScreen = () => {
  const cartProducts = useSelector((state) => state.products.cart);
  const dispatch = useDispatch();
  //getting total price of all products in
  const sum = cartProducts
    .map((item) => parseFloat(item.price * item.quantity))
    .reduce((a, b) => a + b, 0);
  const orderedData = { orderList: cartProducts, sum };
  // const test = {cartProducts, sum}

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <TextTitle style={{ fontSize: 18 }}>
          Total:{" "}
          <TextTitle style={{ color: colors.primary }}>
            ${sum === 0 ? "0.00" : sum.toFixed(2)}
          </TextTitle>
        </TextTitle>
        <TouchableOpacity
          color="red"
          onPress={() => {
            dispatch(onOrder(orderedData));
          }}
          disabled={sum < 1 ? true : false}
        >
          <TextTitle
            style={{
              ...styles.orderBtn,
              opacity: sum < 1 ? 0.5 : 1,
            }}
          >
            Order Now
          </TextTitle>
        </TouchableOpacity>
      </View>
      <View style={styles.itemContainer}>
        {cartProducts.map((item, index) => (
          <View key={index} style={styles.items}>
            <TextBody>
              {item.quantity} <TextTitle>{item.title}</TextTitle>
            </TextBody>
            <View style={styles.trash}>
              <TextTitle>${(item.price * item.quantity).toFixed(2)}</TextTitle>
              <TouchableOpacity
                style={styles.trashbin}
                onPress={() => {
                  dispatch(deleteFromCart(item.id));
                }}
              >
                <Ionicons name="ios-trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const cartScreenOptions = (props) => {
  return {
    headerTitle: "Cart",
    headerTintColor: Platform.OS === "android" ? colors.fourth : colors.primary,
    headerStyle: {
      backgroundColor: colors.primary,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  totalContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 5,
    padding: 10,
  },
  orderBtn: {
    backgroundColor: colors.secondary,
    padding: 5,
    margin: 5,
    shadowRadius: 10,
    shadowOpacity: 0.5,
    borderRadius: 10,
    elevation: 2,
    borderRadius: 5,
  },
  itemContainer: {
    marginTop: 10,
  },
  items: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 5,
  },
  trash: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "30%",
  },
  trashbin: {
    width: 30,
    height: 30,
    alignItems: "center",
    // tu
  },
});

export default CartScreen;
