import { apiClient } from "../apiClient";
import { postTarget as Target } from "../apiClient/targets/postTarget";
import { Post } from "../types";

interface IPostService {
  fetchPosts: (userId: string) => Promise<Post[]>;
}

export const postService: IPostService = {
  fetchPosts: async (userId: string): Promise<Post[]> => {
    const posts = await apiClient.request(Target.fetchAll(userId));
    return posts;
  },
};
