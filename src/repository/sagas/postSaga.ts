import {
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import { addPosts, setError } from "../reducers/postReducer";
import { service } from "../service";
import { Post } from "../types";

export type SagaType = "saga/post/fetchAll";
export const sagas: Record<string, SagaType> = {
  fetchAll: "saga/post/fetchAll",
};

function* fetchPosts({
  type,
  payload,
}: {
  type: SagaType;
  payload: { userId: string };
}): Generator<PutEffect | CallEffect, void, Post[]> {
  try {
    const posts = yield call(service.post.fetchPosts, payload.userId);
    yield put(addPosts(posts));
  } catch (error: any) {
    yield put(setError(error));
  }
}

export function* whatFetchPost() {
  yield takeEvery(sagas.fetchAll, fetchPosts);
}

export const postSagas = [whatFetchPost()];
