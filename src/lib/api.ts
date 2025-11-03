import type { Post, User } from '../types';

const postsData: Post[] = [
  { id: '1', title: 'Getting Started with React', content: 'React is a powerful library for building user interfaces. It allows developers to create reusable components and manage application state efficiently.', status: 'published', authorId: '1', createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: '2', title: 'TypeScript Best Practices', content: 'TypeScript adds static typing to JavaScript, helping catch errors during development. This article covers essential patterns and practices for TypeScript development.', status: 'draft', authorId: '2', createdAt: '2024-01-20T14:30:00Z', updatedAt: '2024-01-20T14:30:00Z' },
  { id: '3', title: 'Building Scalable Applications', content: 'Learn how to architect applications that can grow with your business needs. We cover design patterns, code organization, and performance optimization.', status: 'published', authorId: '1', createdAt: '2024-01-25T09:15:00Z', updatedAt: '2024-01-25T09:15:00Z' },
];

const usersData: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@cms.com', role: 'admin', status: 'active', lastActive: '2 hours ago' },
  { id: '2', name: 'Editor John', email: 'editor@cms.com', role: 'editor', status: 'active', lastActive: '1 day ago' },
  { id: '3', name: 'Viewer Jane', email: 'viewer@cms.com', role: 'viewer', status: 'inactive', lastActive: '1 week ago' },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'editor', status: 'active', lastActive: '3 hours ago' },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const api = {
  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return [...usersData];
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(300);
    return usersData.find(user => user.id === id);
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    await delay(500);
    const newUser: User = {
      ...user,
      id: String(Date.now()),
    };
    usersData.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await delay(500);
    const index = usersData.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    
    usersData[index] = { ...usersData[index], ...updates };
    return usersData[index];
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(500);
    const index = usersData.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    
    usersData.splice(index, 1);
  },

  // Posts
  getPosts: async (): Promise<Post[]> => {
    await delay(500);
    return [...postsData];
  },

  getPostById: async (id: string): Promise<Post | undefined> => {
    await delay(300);
    return postsData.find(post => post.id === id);
  },

  createPost: async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> => {
    await delay(500);
    const now = new Date().toISOString();
    const newPost: Post = {
      ...post,
      id: String(Date.now()),
      createdAt: now,
      updatedAt: now,
    };
    postsData.push(newPost);
    return newPost;
  },

  updatePost: async (id: string, updates: Partial<Post>): Promise<Post> => {
    await delay(500);
    const index = postsData.findIndex(post => post.id === id);
    if (index === -1) throw new Error('Post not found');
    
    postsData[index] = { 
      ...postsData[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return postsData[index];
  },

  deletePost: async (id: string): Promise<void> => {
    await delay(500);
    const index = postsData.findIndex(post => post.id === id);
    if (index === -1) throw new Error('Post not found');

    postsData.splice(index, 1);
  },

  // Find user by email
  findUserByEmail: async (email: string): Promise<User | undefined> => {
    await delay(300);
    return usersData.find(user => user.email === email);
  },
};