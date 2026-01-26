import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationAPI } from '../services/api';
import { toast } from 'sonner';

export const useEducation = () => {
  const queryClient = useQueryClient();

  const { data: education, isLoading, error } = useQuery({
    queryKey: ['education'],
    queryFn: educationAPI.getAll,
  });

  const addEducation = useMutation({
    mutationFn: educationAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education added successfully');
    },
    onError: (error) => {
      console.error('Failed to add education:', error);
      toast.error('Failed to add education');
    },
  });

  const updateEducation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => educationAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update education:', error);
      toast.error('Failed to update education');
    },
  });

  const deleteEducation = useMutation({
    mutationFn: educationAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete education:', error);
      toast.error('Failed to delete education');
    },
  });

  return {
    education,
    isLoading,
    error,
    addEducation: addEducation.mutate,
    updateEducation: updateEducation.mutate,
    deleteEducation: deleteEducation.mutate,
    isAdding: addEducation.isPending,
    isUpdating: updateEducation.isPending,
    isDeleting: deleteEducation.isPending,
  };
};
