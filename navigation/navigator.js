import React from "react";
import colors from "../constants/colors";
import CartScreen, { cartScreenOptions } from "../screen/product/CartScreen";
import DetailedScreen, {
  detailedScreenOption,
} from "../screen/product/DetailedProductScreen";
import ProductsOverviewScreen, {
  productsNavigationOptions,
} from "../screen/product/ProductsOverviewScreen";
import OrdersScreen, { orderScreenOptions } from "../screen/user/OrdersScreen";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ManageProductScreen, {
  ManageProductOptions,
} from "../screen/user/ManageProductScreen";
import EditProductScreen, {
  EditProductOptions,
} from "../screen/user/EditProductScreen";
import AuthScreen, { AuthOptions } from "../screen/user/AuthScreen";
import ButtonStyled from "../components/ButtonStyled";
import { useDispatch } from "react-redux";
import { logOut } from "../store/authe/actions";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";

const ProductStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
  return (
    <ProductStackNavigator.Navigator
      screenOptions={{
        cardStyle: {
          paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        },
      }}
    >
      <ProductStackNavigator.Screen
        name="productsOverview"
        component={ProductsOverviewScreen}
        options={productsNavigationOptions}
      />
      <ProductStackNavigator.Screen
        name="detailed"
        component={DetailedScreen}
        options={detailedScreenOption}
      />
      <ProductStackNavigator.Screen
        name="cart"
        component={CartScreen}
        options={cartScreenOptions}
      />
    </ProductStackNavigator.Navigator>
  );
};

//adding OrdersScreen to navigator just for header and style purposes
const OrderStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
  return (
    <OrderStackNavigator.Navigator
      screenOptions={{
        cardStyle: {
          paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        },
      }}
    >
      <OrderStackNavigator.Screen
        name="orders"
        component={OrdersScreen}
        options={orderScreenOptions}
      />
    </OrderStackNavigator.Navigator>
  );
};

// //adding manageProductScreen to navigator just for header and style purposes
const ManageProductStackNavigator = createStackNavigator();

export const ProductManager = () => {
  return (
    <ManageProductStackNavigator.Navigator
      screenOptions={{
        cardStyle: {
          paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        },
      }}
    >
      <ManageProductStackNavigator.Screen
        name="manage"
        component={ManageProductScreen}
        options={ManageProductOptions}
      />
      <ManageProductStackNavigator.Screen
        name="edit"
        component={EditProductScreen}
        options={EditProductOptions}
      />
    </ManageProductStackNavigator.Navigator>
  );
};

// //adding AuthScreen to navigator
const AuthStackNavigator = createStackNavigator();

export const AuthenticationNav = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        cardStyle: {
          paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        },
      }}
    >
      <AuthStackNavigator.Screen
        name="Authentication"
        component={AuthScreen}
        options={AuthOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

// //drawer Navigator as main navigator
const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const dispatch = useDispatch();
  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView style={{ alignItems: "flex-start" }}>
              <DrawerItemList {...props} />
              <ButtonStyled
                // style={{ marginLeft: "20%" }}
                title="LogOut"
                color={colors.primary}
                onPress={() => {
                  dispatch(logOut());
                  // props.navigation.navigate('auth');
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: colors.primary,
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Admin"
        component={ProductManager}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-create" : "ios-create"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};
