import products from "../data/Products";
import {
  ADD_TO_CART,
  DELETE_FROM_CART,
  ON_ORDER,
  DELETE_PRODUCT,
  ON_EDIT_SAVE,
  ON_CREATE_SAVE,
  GET_DATA,
  GET_ORDERED_LIST,
} from "./actions";

const initialState = {
  products: products,
  cart: [],
  orders: [],
  userProducts: [],
};

const productReducer = (state = initialState, actions) => {
  switch (actions.type) {
    //getting all prpoducts from the firebase DB.
    case GET_DATA:
      return {
        ...state,
        products: actions.loadedProducts,
        userProducts: actions.loadedProducts.filter(
          (product) => product.ownerId === actions.userId
        ),
      };
    //adding product to the Cart
    case ADD_TO_CART:
      const productInCart = state.cart.find(
        (item) => item.id === actions.productId
      );
      if (productInCart) {
        productInCart.quantity += 1;
        return { ...state };
      }
      const productById = state.products.find(
        (product) => product.id === actions.productId
      );
      productById.quantity = 1;
      return { ...state, cart: [...state.cart, productById] };
    //from the Cart deleting a product
    case DELETE_FROM_CART:
      const productToDelete = state.cart.find(
        (item) => item.id === actions.productId
      );
      if (productToDelete.quantity > 1) {
        productToDelete.quantity -= 1;
        return { ...state, cart: [...state.cart] };
      }
      const cartList = state.cart.filter(
        (item) => item.id !== actions.productId
      );
      return { ...state, cart: cartList };
    //ordering list of products in the Cart and cleaning the Cart after order is done
    case ON_ORDER:
      return {
        ...state,
        cart: [],
      };
    //delete a whole product from the DB
    case DELETE_PRODUCT:
      const newProducts = state.products.filter(
        (product) => product.id !== actions.productId
      );
      const newCart = state.cart.filter(
        (product) => product.id !== actions.productId
      );
      return { ...state, products: newProducts, cart: newCart };
    //updating one of products in DB.
    case ON_EDIT_SAVE:
      const Product = actions.dataInputs;
      const prodToEdit = state.products.find(
        (product) => product.id === actions.dataInputs.id
      );
      const prodIndex = state.products.indexOf(prodToEdit);
      state.products.splice(prodIndex, 1, Product);
      const cartRemake = state.cart.filter((item) => item.id !== Product.id);
      return { ...state, products: [...state.products], cart: cartRemake };
    //creating new product to the product list in DB
    case ON_CREATE_SAVE:
      return {
        ...state,
        products: [...state.products, { ...actions.dataInputs }],
      };
    case GET_ORDERED_LIST:
      return { ...state, orders: actions.loadedOrders };
    default:
      return state;
  }
};

export default productReducer;
