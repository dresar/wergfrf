import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceAPI } from '../services/api';
import { toast } from 'sonner';

export const useExperience = () => {
  const queryClient = useQueryClient();

  const { data: experiences, isLoading, error } = useQuery({
    queryKey: ['experience'],
    queryFn: experienceAPI.getAll,
  });

  const addExperience = useMutation({
    mutationFn: experienceAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('Experience added successfully');
    },
    onError: (error) => {
      console.error('Failed to add experience:', error);
      toast.error('Failed to add experience');
    },
  });

  const updateExperience = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => experienceAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('Experience updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update experience:', error);
      toast.error('Failed to update experience');
    },
  });

  const deleteExperience = useMutation({
    mutationFn: experienceAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('Experience deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete experience:', error);
      toast.error('Failed to delete experience');
    },
  });

  return {
    experiences,
    isLoading,
    error,
    addExperience: addExperience.mutate,
    updateExperience: updateExperience.mutate,
    deleteExperience: deleteExperience.mutate,
    isAdding: addExperience.isPending,
    isUpdating: updateExperience.isPending,
    isDeleting: deleteExperience.isPending,
  };
};
