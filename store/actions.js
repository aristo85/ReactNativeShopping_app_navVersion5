import Product from "../models/productModel";
import Order from "../models/OrderModel";

export const ADD_TO_CART = "ADD_TO_CART";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const ON_ORDER = "ON_ORDER";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const ON_EDIT_SAVE = "ON_EDIT_SAVE";
export const ON_CREATE_SAVE = "ON_CREATE_SAVE";
export const GET_DATA = "GET_DATA";
export const GET_ORDERED_LIST = "GET_ORDERED_LIST";

//getting all data from the DB dispatch it against reducer
export const getData = () => {
  return async (dispatch, getState) => {
    //getting userId from reduxs state
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        "https://v5navigationappshopping.firebaseio.com/products.json" //Get request by name (/products)
      );
      const data = await response.json(); //from json to object
      const loadedProducts = [];
      //creating new error message in case of falsy response
      if (!response.ok) {
        throw new Error("something went wrong with the server");
      }

        //from object to an array of products using class model of products
        for (const key in data) {
        loadedProducts.push(
          new Product(
            key,
            data[key].ownerId,
            data[key].title,
            data[key].imageUrl,
            data[key].description,
            data[key].price
          )
        );
      }
      //adding userId for making the certain user product list if available and show it on MangeProductScreen!
      dispatch({ type: GET_DATA, loadedProducts, userId }); 
    } catch (err) {
      throw err;
    }
  };
};
//adding product to cart 
export const addToCart = (id) => {
  return { type: ADD_TO_CART, productId: id };
};

export const deleteFromCart = (id) => {
  return { type: DELETE_FROM_CART, productId: id };
};
//Post request to the DB and making new order by name (orders/idOfCurrentUser)
export const onOrder = (orderedData) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;

    try {
      const response = await fetch(
        `https://v5navigationappshopping.firebaseio.com/orders/${userId}.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...orderedData,
            date: new Date().toISOString(),
            userId,
          }), //from object to json
        }
      );
      const data = await response.json(); //from json to object

      if (!response.ok) {
        throw new Error("something went wrong with the server");
      }

      dispatch({ type: ON_ORDER });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;

    try {
      const response = await fetch(
        `https://v5navigationappshopping.firebaseio.com/products/${productId}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json(); //from json to object

      if (!response.ok) {
        throw new Error("something went wrong with the server");
      }

      dispatch({ type: DELETE_PRODUCT, productId });
    } catch (err) {
      throw err;
    }
  };
};

export const onEditSave = (dataInputs) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;

    try {
      const response = await fetch(
        `https://v5navigationappshopping.firebaseio.com/products/${dataInputs.id}.json?auth=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataInputs), //from object to json
        }
      );
      const data = await response.json(); //from json to object

      if (!response.ok) {
        throw new Error("something went wrong with the server");
      }

      dispatch({ type: ON_EDIT_SAVE, dataInputs });
    } catch (err) {
      throw err;
    }
  };
};
export const onCreateSave = (dataInputs) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://v5navigationappshopping.firebaseio.com/products.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId: userId,
            title: dataInputs.title,
            imageUrl: dataInputs.imageUrl,
            description: dataInputs.description,
            price: dataInputs.price,
          }), //from object to json
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("something went wrong with the server");
      }

      const newProduct = new Product(
        data.name,
        data.ownerId,
        data.title,
        data.imageUrl,
        data.description,
        data.price
      );

      dispatch({
        type: ON_CREATE_SAVE,
        dataInputs: { ...newProduct },
      });
    } catch (err) {
      throw err;
    }
  };
};

export const getOrderedList = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://v5navigationappshopping.firebaseio.com/orders/${userId}.json`
      );
      const data = await response.json(); //from json to object
      const loadedOrders = [];
      if (!response.ok) {
        throw new Error("something went wrong with the server");
      }

      for (const key in data) {
        //from object to an array of products
        loadedOrders.push(
          new Order(key, data[key].date, data[key].orderList, data[key].sum)
        );
      }

      dispatch({ type: GET_ORDERED_LIST, loadedOrders });
    } catch (err) {
      throw err;
    }
  };
};
