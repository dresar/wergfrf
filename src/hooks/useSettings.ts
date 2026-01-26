import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsAPI } from '../services/api';
import { toast } from 'sonner';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: siteSettingsAPI.get,
  });

  const updateSettings = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => siteSettingsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    },
  });

  const createSettings = useMutation({
    mutationFn: (data: any) => siteSettingsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings created/updated successfully');
    },
    onError: (error) => {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateSettings.mutate,
    createSettings: createSettings.mutate,
    isUpdating: updateSettings.isPending || createSettings.isPending,
  };
};
