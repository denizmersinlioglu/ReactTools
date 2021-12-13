import { reduceWithId } from "../../utils/reducerWithId";
import { sagas } from "../sagas/postSaga";
import { Post } from "../types";

type State = {
  data: Record<string, Post>;
  error: Error | null;
};

// MARK: - Reducer

export const postReducer = (
  state = { data: {}, error: null },
  action: AddAction | DeleteAction | ErrorAction
): State => {
  switch (action.type) {
    case "post/add":
      return {
        ...state,
        data: { ...state.data, ...reduceWithId(action.posts) },
      };

    case "post/delete":
      const newState = { ...state };
      for (const id of action.postIds) delete (newState.data as any)[id];
      return newState;

    case "post/error":
      return { ...state, error: action.error };

    default:
      return state;
  }
};

// MARK: Actions

export const addPosts = (posts: Post[]): AddAction => ({
  type: "post/add",
  posts: posts,
});

export const deletePost = (postIds: string[]): DeleteAction => ({
  type: "post/delete",
  postIds: postIds,
});

export const setError = (error: Error | null): ErrorAction => ({
  type: "post/error",
  error: error,
});

// Sagas

export const fetchPosts = (userId: string) => ({
  type: sagas.fetchAll,
  payload: { userId },
});

// MARK: - Selectors

export const getPost = (
  state: State,
  primaryId?: string | null
): Post | undefined => {
  return primaryId ? state.data[primaryId] : undefined;
};

export const getPosts = (
  state: State,
  filter: (posts: Post) => boolean = () => true
): Post[] => {
  return Object.values(state.data).filter(filter);
};

// MARK: - Action Types

type AddAction = {
  type: "post/add";
  posts: Post[];
};

type DeleteAction = {
  type: "post/delete";
  postIds: string[];
};

type ErrorAction = {
  type: "post/error";
  error: Error | null;
};
