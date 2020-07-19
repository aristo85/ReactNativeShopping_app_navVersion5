import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import TextTitle from "../../components/TextTitle";
import ButtonStyled from "../../components/ButtonStyled";
import colors from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { singupUser, loginUser } from "../../store/authe/actions";
import * as yup from "yup";

let schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
});

const AuthScreen = (props) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [validErrors, setValidErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (signInOrUp) => {
    setIsLoading(true);
    const dadtaInputs = { email, password };
    try {
      const isValid = await schema.isValid(dadtaInputs);
      if (isValid) {
        await dispatch(signInOrUp(dadtaInputs));
        // props.navigation.navigate("shop");
      }
      await schema.validate(dadtaInputs);
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.errors ? err.errors : err.message;
      setValidErrors(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <LinearGradient
        style={styles.gradient}
        colors={[colors.fourth, colors.third, colors.secondary, colors.primary]}
      >
        <View>
          <TextTitle>
            {isLoginMode ? "Please Log In" : "Create a User"}
          </TextTitle>
        </View>
        <ScrollView style={styles.screen}>
          <View style={styles.inputContainer}>
            <TextTitle style={styles.label}>E-mail</TextTitle>
            <TextInput
              autoCapitalize="none"
              value={email}
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextTitle style={styles.label}>Password</TextTitle>
            <TextInput
              minLength={5}
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <ButtonStyled
            title={isLoginMode ? "login" : "sign up"}
            color={colors.primary}
            onPress={() =>
              isLoginMode ? handleSubmit(loginUser) : handleSubmit(singupUser)
            }
          />
          <ButtonStyled
            title={isLoginMode ? "Switch to Sign Up" : "Switch to Login"}
            color={colors.secondary}
            onPress={() => setIsLoginMode(!isLoginMode)}
          />
          <View>
            <TextTitle>{validErrors}</TextTitle>
          </View>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export const AuthOptions = (props) => {
  return {
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
    margin: 10,
  },
  gradient: {
    height: "100%",
    width: "100%",
  },
  inputContainer: {},
  label: {
    justifyContent: "flex-start",
    textAlign: "left",
  },
  input: {
    borderBottomWidth: 1,
    width: "100%",
  },
});

export default AuthScreen;
