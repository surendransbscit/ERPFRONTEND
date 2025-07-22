import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducer";
import RtkQueryService from "../services/RtkQueryService";

const middlewares = [RtkQueryService.middleware];

const persistConfig = {
  key: "admin",
  keyPrefix: "",
  storage,
  whitelist: [],
};

// interface CustomStore extends Store<RootState, AnyAction> {
//     asyncReducers?: AsyncReducers
// }

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer()),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
  devTools: {},
});

store.asyncReducers = {};

export const persistor = persistStore(store);

export function injectReducer(key, reducer) {
  if (store.asyncReducers) {
    if (store.asyncReducers[key]) {
      return false;
    }
    store.asyncReducers[key] = reducer;
    store.replaceReducer(
      persistReducer(persistConfig, rootReducer(store.asyncReducers))
    );
  }
  persistor.persist();
  return store;
}

// export type AppDispatch = typeof store.dispatch

export default store;
