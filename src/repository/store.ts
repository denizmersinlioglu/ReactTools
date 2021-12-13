import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";

import { reducers } from "./reducers";
import { sagas } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

let composer = compose;

const logActions = false;

if (process.env.NODE_ENV === "development" && logActions) {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  composer = composeWithDevTools;
}

const store = createStore(reducers, composer(applyMiddleware(...middlewares)));
sagaMiddleware.run(sagas);

export type RootState = ReturnType<typeof reducers>;
export default store;
