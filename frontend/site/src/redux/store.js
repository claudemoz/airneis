import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categories from "./slices/categories";
import materials from "./slices/materials";
import products from "./slices/products";
import orders from "./slices/orders";
import cart from "./slices/cart";
import order from "./slices/order"
import contact from "./slices/contact";
import configApp from "./slices/configApp";
import auth from "./slices/auth";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import payment_intents from "./slices/payment_intents";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: auth,
  categories: categories,
  materials: materials,
  products: products,
  orders: orders,
  cart: cart,
  order : order,
  contact: contact,
  configApp: configApp,
  payment_intents: payment_intents,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les chemins spécifiques
        ignoredActions: ["persist/PERSIST"],
        ignoredActionPaths: ["register", "rehydrate"],
        ignoredPaths: ["some.nested.path.to.ignore"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
