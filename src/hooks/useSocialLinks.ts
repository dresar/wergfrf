import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialLinksAPI } from '../services/api';
import { toast } from 'sonner';

export const useSocialLinks = () => {
  const queryClient = useQueryClient();

  const { data: socialLinks, isLoading, error } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: socialLinksAPI.getAll,
  });

  const addSocialLink = useMutation({
    mutationFn: socialLinksAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
      toast.success('Social link added successfully');
    },
    onError: (error) => {
      console.error('Failed to add social link:', error);
      toast.error('Failed to add social link');
    },
  });

  const updateSocialLink = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => socialLinksAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
      toast.success('Social link updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update social link:', error);
      toast.error('Failed to update social link');
    },
  });

  const deleteSocialLink = useMutation({
    mutationFn: socialLinksAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
      toast.success('Social link deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete social link:', error);
      toast.error('Failed to delete social link');
    },
  });

  return {
    socialLinks,
    isLoading,
    error,
    addSocialLink: addSocialLink.mutate,
    updateSocialLink: updateSocialLink.mutate,
    deleteSocialLink: deleteSocialLink.mutate,
    isAdding: addSocialLink.isPending,
    isUpdating: updateSocialLink.isPending,
    isDeleting: deleteSocialLink.isPending,
  };
};
