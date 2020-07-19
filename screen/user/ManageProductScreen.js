import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButtonStyle from "../../components/HeaderButtonStyle";
import { deleteProduct, getData } from "../../store/actions";
import TextTitle from "../../components/TextTitle";
import { useFocusEffect } from "@react-navigation/native";

const ManageProductScreen = (props) => {
  const myProducts = useSelector((state) => state.products.userProducts);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getData());

      return () => dispatch(getData());
    }, [dispatch])
  );

  if (myProducts.length < 1) {
    return (
      <View style={styles.spiner}>
        <TextTitle>
          No Product of your among the list, may be you could create one!
        </TextTitle>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.ok}>
      {myProducts.map((item, index) => (
        <View key={index} style={styles.container}>
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
              <Text style={{ textAlign: "center", fontFamily: "open-sans" }}>
                ${item.price}
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <Button
                title="Edit"
                color={colors.primary}
                onPress={() => {
                  props.navigation.navigate("edit", {
                    id: item.id,
                    ownerId: item.ownerId,
                    title: item.title,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    description: item.description,
                  });
                }}
              />
              <Button
                title="Delete"
                color={colors.primary}
                onPress={() => {
                  Alert.alert(
                    "Delete Product",
                    `Are you sure you want to delete ${item.title} ?`,
                    [
                      {
                        text: "Cansel",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => dispatch(deleteProduct(item.id)),
                      },
                    ]
                  );
                }}
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export const ManageProductOptions = (props) => {
  return {
    headerTitle: "Your Products",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButtonStyle}>
        <Item
          title="Cart"
          iconName="ios-create"
          onPress={() => {
            props.navigation.navigate("edit");
          }}
        />
      </HeaderButtons>
    ),
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

export default ManageProductScreen;
