import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/services/api';
import { toast } from 'sonner';
import { useMemo } from 'react';

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addProjectMutation = useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => projectsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    },
  });

  const reorderProjectMutation = useMutation({
    mutationFn: projectsAPI.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Failed to reorder projects:', error);
      toast.error('Failed to reorder projects');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: ({ projectId, imageId }: { projectId: number; imageId: number }) => 
      projectsAPI.deleteImage(projectId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Image deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    },
  });

  const projects = useMemo(() => projectsQuery.data || [], [projectsQuery.data]);

  return {
    projects,
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    addProject: addProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
    reorderProjects: reorderProjectMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
    isAdding: addProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
}
