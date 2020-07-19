import React, {useState} from "react";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import productReducer from "./store/reducer";
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
// import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import authReducer from "./store/authe/reducer";
import Nav5Comp from "./navigation/navV5";


//setting up font families
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),    
  })
}
//combine all reducers here if there more than one 
const rootReducer = combineReducers({
  products: productReducer,
  authReducer: authReducer,
});
//creating store fore redux, gitting reducer and reduxthunk fro async. actions
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  
  //waitting for fonts to set up, then render
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts} //this has to be a function and return a promise
        onFinish={() => setDataLoaded(true)} //a listener
	onError={(error) => console.log(error)} // in case of error fetchin, we can shoe alternative component or ~cl~
      />
    );
  }

  return (
    <Provider store={store}>
        <Nav5Comp />
    </Provider>
  );
}