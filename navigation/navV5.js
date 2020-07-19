import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { ShopNavigator, AuthenticationNav } from './navigator';
import { useSelector } from 'react-redux';
import StartUpScreen from '../screen/user/StartUpScreen';

const Nav5Comp = (props) => {
  const isAuth = useSelector(state => state.authReducer.token);
  const isTriedLogin = useSelector(state => state.authReducer.isTriedAutoLogin);
  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && isTriedLogin && <AuthenticationNav />}
      {!isAuth && !isTriedLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default Nav5Comp;
