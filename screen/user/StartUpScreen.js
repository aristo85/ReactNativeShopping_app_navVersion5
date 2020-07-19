import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, AsyncStorage } from 'react-native';
import { useDispatch } from 'react-redux';
import colors from '../../constants/colors';
import { authentication, tryAuotLogin } from '../../store/authe/actions';

const StartUpScreen = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            const authData = await AsyncStorage.getItem('authData');
            if(!authData) {
                dispatch(tryAuotLogin());
                return;
            }
            const transformData = JSON.parse(authData);
            const { token, userId, expireDate } = transformData;
            const expireIn = new Date(expireDate);

            if(expireIn <= new Date() || !token || userId) {
                dispatch(tryAuotLogin());
            }

            const timeUntilExpiration = expireIn.getTime() - new Date().getTime();

            // props.navigation.navigate('shop');

            dispatch(authentication(token, userId, timeUntilExpiration));

        }

        tryLogin();
    }, [dispatch])

    return (
        <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
}

const styles = StyleSheet.create({
    spiner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      },
})

export default StartUpScreen;