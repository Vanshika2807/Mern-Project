import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import {configureStore} from "@reduxjs/toolkit"
import { Toaster } from "react-hot-toast";

const store = configureStore({
  reducer:rootReducer,
})

// in reducer we will combine all slices

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>

    <Provider store = {store}>
      <BrowserRouter>
    
            <App />
        <Toaster/>
      </BrowserRouter>
    </Provider>
    
    {/* wrap the app with provider and pass store in it . provider is used to link react with redux*/}
   
  </React.StrictMode>
);
