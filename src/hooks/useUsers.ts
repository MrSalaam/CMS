import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { User } from '../types';
import { toaster } from '../components/ui/toaster';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
};

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: api.getUsers,
  });
};

// Get single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => api.getUserById(id),
    enabled: !!id,
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Omit<User, 'id'>) => api.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toaster.create({
        title: 'User created successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to create user',
        description: error.message,
        type: 'error',
      });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) => 
      api.updateUser(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      toaster.create({
        title: 'User updated successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to update user',
        description: error.message,
        type: 'error',
      });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toaster.create({
        title: 'User deleted successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to delete user',
        description: error.message,
        type: 'error',
      });
    },
  });
};