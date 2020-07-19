import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Image,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import { addToCart, getData } from "../../store/actions";
import HeaderButtonStyle from "../../components/HeaderButtonStyle";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import TextTitle from "../../components/TextTitle";
import ButtonStyled from "../../components/ButtonStyled";
import { useFocusEffect } from "@react-navigation/native";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isRefreshing, setIsRfreshing] = useState(false);

  const data = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  const TouchBtn =
    Platform.OS == "android" ? TouchableNativeFeedback : TouchableOpacity;

  const getAllProducts = async () => {
    setIsRfreshing(true);
    setIsError(null);
    try {
      await dispatch(getData());
    } catch (err) {
      setIsError(err);
    }
    setIsRfreshing(false);
  };

  //dispatching action for getting all products from Db, after first rendering
  useEffect(() => {
    setIsLoading(true);
    getAllProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  //getting the data from DB. for every visit to the screen, so update the most recent info
  useFocusEffect(
    React.useCallback(() => {
      getAllProducts();

      return () => getAllProducts();
    }, [dispatch])
  );

  //setting a spiner while waiting for data from the server
  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
  } else if (!isLoading && data.length < 1) {
    return (
      <View style={styles.spiner}>
        <TextTitle>No Product to show, may be you could create one!</TextTitle>
      </View>
    );
  } else if (isError) {
    return (
      <View style={styles.spiner}>
        <TextTitle>An Error is occured: {isError.message}!</TextTitle>
        <ButtonStyled
          title="refresh"
          color={colors.primary}
          onPress={getAllProducts}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        onRefresh={getAllProducts}
        refreshing={isRefreshing}
        data={data}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <TouchBtn
              style={{ flex: 1 }}
              onPress={() => {
                props.navigation.navigate("detailed", {
                  id: item.id,
                  title: item.title,
                });
              }}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={{
                    uri: item.imageUrl,
                  }}
                />
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "open-sans-bold",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{ textAlign: "center", fontFamily: "open-sans" }}
                  >
                    ${item.price}
                  </Text>
                </View>
                <View style={styles.btnContainer}>
                  <Button
                    title="Details"
                    color={colors.primary}
                    onPress={() => {
                      props.navigation.navigate("detailed", {
                        id: item.id,
                        title: item.title,
                      });
                    }}
                  />
                  <Button
                    title="to Cart"
                    color={colors.primary}
                    onPress={() => dispatch(addToCart(item.id))}
                  />
                </View>
              </View>
            </TouchBtn>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export const productsNavigationOptions = (props) => {
  return {
    headerTitle: "All Products",
    //Cart icon
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButtonStyle}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            props.navigation.navigate("cart");
          }}
        />
      </HeaderButtons>
    ),
    //drawer icon
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
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    elevation: 5,
    borderRadius: 20,
    height: 300,
    // overflow: "hidden",
  },
  imgContainer: {
    flex: 1,
    height: "80%",
    alignItems: "center",
    backgroundColor: colors.third,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  image: {
    width: "100%",
    height: "70%",
    // overflow: "hidden",
  },
  btnContainer: {
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});

export default ProductsOverviewScreen;
