import { all } from "redux-saga/effects";
import { postSagas } from "./postSaga";

export function* sagas() {
  yield all([...postSagas]);
}
