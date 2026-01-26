import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsAPI } from '../services/api';
import { toast } from 'sonner';

export const useSkills = () => {
  const queryClient = useQueryClient();

  const { data: skills, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: skillsAPI.getAll,
  });

  const addSkill = useMutation({
    mutationFn: skillsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill added successfully');
    },
    onError: (error) => {
      console.error('Failed to add skill:', error);
      toast.error('Failed to add skill');
    },
  });

  const updateSkill = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => skillsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update skill:', error);
      toast.error('Failed to update skill');
    },
  });

  const deleteSkill = useMutation({
    mutationFn: skillsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete skill:', error);
      toast.error('Failed to delete skill');
    },
  });

  return {
    skills,
    isLoading,
    error,
    addSkill: addSkill.mutate,
    updateSkill: updateSkill.mutate,
    deleteSkill: deleteSkill.mutate,
    isAdding: addSkill.isPending,
    isUpdating: updateSkill.isPending,
    isDeleting: deleteSkill.isPending,
  };
};
