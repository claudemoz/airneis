import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categories from "./slices/categories";
import materials from "./slices/materials";
import products from "./slices/products";
import configApp from "./slices/configApp";
import orders from"./slices/orders";
import contacts from "./slices/contacts";
import users from "./slices/users";
import auth from "./slices/auth";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
    categories: categories,
    materials: materials,
    products: products,
    configApp: configApp,
    orders : orders,
    contacts: contacts,
    users: users,
    auth: auth,
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
