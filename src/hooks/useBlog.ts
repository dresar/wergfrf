import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogPostsAPI, blogCategoriesAPI } from '@/services/api';
import { toast } from 'sonner';
import { useMemo } from 'react';

export function useBlogPosts() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ['blog-posts'],
    queryFn: blogPostsAPI.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addPostMutation = useMutation({
    mutationFn: blogPostsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post created successfully');
    },
    onError: (error) => {
      console.error('Failed to create blog post:', error);
      toast.error('Failed to create blog post');
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => blogPostsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update blog post:', error);
      toast.error('Failed to update blog post');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: blogPostsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete blog post:', error);
      toast.error('Failed to delete blog post');
    },
  });

  const posts = useMemo(() => postsQuery.data || [], [postsQuery.data]);

  return {
    posts,
    isLoading: postsQuery.isLoading,
    isError: postsQuery.isError,
    error: postsQuery.error,
    addPost: addPostMutation.mutateAsync,
    updatePost: updatePostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    isAdding: addPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
}

export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogPostsAPI.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useBlogCategories() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['blog-categories'],
    queryFn: blogCategoriesAPI.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addCategoryMutation = useMutation({
    mutationFn: blogCategoriesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
      toast.error('Failed to create category');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => blogCategoriesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update category:', error);
      toast.error('Failed to update category');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: blogCategoriesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    },
  });

  const categories = useMemo(() => categoriesQuery.data || [], [categoriesQuery.data]);

  return {
    categories,
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    addCategory: addCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isAdding: addCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}
