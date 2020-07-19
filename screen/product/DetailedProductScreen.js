import React from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import TextTitle from "../../components/TextTitle";
import TextBody from "../../components/TextBody";
import ButtonStyled from '../../components/ButtonStyled';
import { addToCart } from '../../store/actions'

const DetailedProductScreen = (props) => {
  const data = useSelector((state) => state.products.products);
  const productId = props.route.params.id;
  const product = data.find((item) => item.id === productId);
  const dispatch = useDispatch();

  return (
    <View>
      <Image
        style={styles.image}
        source={{
          uri: product.imageUrl,
        }}
      />
      <ButtonStyled
        title="add to Cart"
        color={colors.primary}
        onPress={() => dispatch(addToCart(product.id))}
      />
      <TextBody style={{ fontSize: 20, opacity: 0.5 }}>
        ${product.price}
      </TextBody>
      <TextTitle>{product.description}</TextTitle>
    </View>
  );
};

export const detailedScreenOption = (props) => {
  const title = props.route.params.title;

  return {
    headerTitle: title,
    headerTintColor: Platform.OS === "android" ? colors.fourth : colors.primary,
    headerStyle: {
      backgroundColor: colors.primary,
    },
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "60%",
    // overflow: "hidden",
  },
});

export default DetailedProductScreen;
