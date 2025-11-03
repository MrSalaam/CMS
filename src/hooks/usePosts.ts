import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Post } from '../types';
import { toaster } from '../components/ui/toaster';

// Query Keys
export const postKeys = {
  all: ['posts'] as const,
  detail: (id: string) => ['posts', id] as const,
};

// Get all posts
export const usePosts = () => {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: api.getPosts,
  });
};

// Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => api.getPostById(id),
    enabled: !!id,
  });
};

// Create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => 
      api.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toaster.create({
        title: 'Post created successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to create post',
        description: error.message,
        type: 'error',
      });
    },
  });
};

// Update post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Post> }) => 
      api.updatePost(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.id) });
      toaster.create({
        title: 'Post updated successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to update post',
        description: error.message,
        type: 'error',
      });
    },
  });
};

// Delete post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toaster.create({
        title: 'Post deleted successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to delete post',
        description: error.message,
        type: 'error',
      });
    },
  });
};