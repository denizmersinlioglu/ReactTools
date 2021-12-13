import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchPosts, getPosts } from "./repository/reducers/postReducer";

export const App = () => {
  // MARK: - Hooks

  const dispatch = useDispatch();
  const posts = useSelector(({ post }) => getPosts(post));

  // MARK: - Actions

  const handleFetchPosts = (userId: string) => {
    dispatch(fetchPosts(userId));
  };

  // MARK: - Render

  return (
    <Container>
      <Button onClick={() => handleFetchPosts("1")}>{"Fetch posts"}</Button>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </Container>
  );
};

// MARK: - Styles

const Container = styled.div`
  padding: 20px;
`;

const Button = styled.button`
  cursor: pointer;
`;
