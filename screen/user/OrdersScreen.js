import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button, ActivityIndicator } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButtonStyle from "../../components/HeaderButtonStyle";
import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import CallpseOrder from "../../components/CallapseOrder";
import { getOrderedList } from '../../store/actions';
import TextTitle from "../../components/TextTitle";
import { exp } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

const OrdersScreen = (props) => {
  const orders = useSelector((state) => state.products.orders);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getOrders = async () => {
    await dispatch(getOrderedList());
    setIsLoading(false);
  } 

  useEffect(() => {
    setIsLoading(true);
    getOrders();
  }, [dispatch])

  //getting the data from DB. for every visit to the screen, so update the most recent info
  
  useFocusEffect(
    React.useCallback(() => {
      getOrders();

      return () => getOrders();
    }, [dispatch])
  )
  // useEffect(() => {
  //   const willFocusSub = props.navigation.addListener("Focus", () => {
  //   });
  //   return willFocusSub;
  // }, [getOrders]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
  } else if (!isLoading && orders.length < 1) {
    return (
      <View style={styles.spiner}>
        <TextTitle>No Product found, may be you could order some?</TextTitle>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {orders.map((order, index) => (
        <CallpseOrder
          key={index}
          sum={order.sum}
          date={order.date}
          orderList={order.orderList}
        />
      ))}
    </View>
  );
};

export const orderScreenOptions = (props) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButtonStyle}>
        <Item
          title="Drawer"
          iconName="ios-menu"
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerTintColor: Platform.OS === "android" ? colors.fourth : colors.primary,
    headerStyle: {
      backgroundColor: colors.primary,
    },
  };
};

const styles = StyleSheet.create({
  spiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  screen: {
    padding: 10,
  },
});

export default OrdersScreen;
