import React, { useState, useEffect, useReducer } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Text,
  ScrollView
} from "react-native";
import colors from "../../constants/colors";
import TextTitle from "../../components/TextTitle";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButtonStyle from "../../components/HeaderButtonStyle";
import { useDispatch, useSelector } from "react-redux";
import { onEditSave, onCreateSave } from "../../store/actions";
import * as yup from "yup";

//validation pattern for checking inputs value by Yup
let schema = yup.object().shape({
  title: yup.string().required(),
  imageUrl: yup.string().url().required(),
  price: yup.number().required(),
  description: yup.string().required(),
});
// constants for 'useReducer' actions
const UPDATE_FORM_INPUT = "UPDATE_FORM_INPUT";
const UPDATE_ERR_LIST = "UPDATE_ERR_LIST";

//reducer function of useReducer
const formReducer = (state, action) => {
  if (action.type === UPDATE_FORM_INPUT) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    return { ...state, inputValues: updatedValues };
  } else if (action.type === UPDATE_ERR_LIST) {
    return { ...state, formErrors: action.value };
  }
};

const EditProductScreen = (props) => {
  //chicking if the EditProductScreen directed by edit or create(from ManageProductScreen)
  const priceParam = props.route.params;
  //initiate useReducer props
  const [formState, dispatchFormSatate] = useReducer(formReducer, {
    inputValues: {
      title: priceParam ? props.route.params.title : "",
      imgUrl: priceParam ? props.route.params.imageUrl : "",
      price: priceParam ? String(props.route.params.price) : "",
      description: priceParam ? props.route.params.description : "",
    },
    formErrors: [],
  });
  //dispatching against useReducers reducer function, on input values changing
  const handleInputs = (inputIdentifier, text) => {
    dispatchFormSatate({
      type: UPDATE_FORM_INPUT,
      value: text,
      input: inputIdentifier,
    });
  };

  //this is redux dispatch
  const dispatch = useDispatch();
  //checking for validity and dispatching data against Redux reducer and setting up errors if the form is not valid
  const handleSave = (dataInputs) => {
    let isValid = false;
    schema.isValid(dataInputs).then((valid) => {
      isValid = valid;
      if (isValid) {
        priceParam
          ? dispatch(onEditSave({...dataInputs, id: props.route.params.id}))
          : dispatch(onCreateSave(dataInputs));
        props.navigation.goBack();
      } else {
        schema.validate(dataInputs).catch((err) => {
          dispatchFormSatate({
            type: UPDATE_ERR_LIST,
            value: err.errors,
          });
        });
      }
    });
  };

    //collecting data inputs and connecting dispatch with navigation by setting params 
    useEffect(() => {
    const dataInputs = {
      ownerId: priceParam ? props.route.params.ownerId : "u1",
      title: formState.inputValues.title,
      imageUrl: formState.inputValues.imgUrl,
      price: parseFloat(formState.inputValues.price).toFixed(2),
      description: formState.inputValues.description,
    };
    
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButtonStyle}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={() => handleSave(dataInputs)} //connection with redux
          />
        </HeaderButtons>
      ),
    });
  }, [
    formState.inputValues.title,
    formState.inputValues.imgUrl,
    formState.inputValues.price,
    formState.inputValues.description,
  ]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <ScrollView style={styles.screen}>
        <View style={styles.inputContainer}>
          <TextTitle style={styles.label}>Title</TextTitle>
          <TextInput
            value={formState.inputValues.title}
            style={styles.input}
            onChangeText={(text) => handleInputs("title", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextTitle style={styles.label}>Image URL</TextTitle>
          <TextInput
            style={styles.input}
            value={formState.inputValues.imgUrl}
            onChangeText={(text) => handleInputs("imgUrl", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextTitle style={styles.label}>Price</TextTitle>
          <TextInput
            keyboardType="decimal-pad"
            style={styles.input}
            value={formState.inputValues.price}
            onChangeText={(text) => handleInputs("price", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextTitle style={styles.label}>Description</TextTitle>
          <TextInput
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={(text) => handleInputs("description", text)}
          />
        </View>
        <View>
          {formState.formErrors.map((err, index) => (
            <View key={index}>
              <TextTitle style={{color: 'red'}}>{err}</TextTitle>
            </View>
          ))}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export const EditProductOptions = (props) => {
  return {
    headerTitle: props.route.params ? "Edit" : "Create",
    headerTintColor: Platform.OS === "android" ? colors.fourth : colors.primary,
    headerStyle: {
      backgroundColor: colors.primary,
    },
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 10,
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

export default EditProductScreen;
