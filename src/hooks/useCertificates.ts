import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesAPI } from '../services/api';
import { toast } from 'sonner';

export const useCertificates = () => {
  const queryClient = useQueryClient();

  const { data: certificates, isLoading, error, refetch } = useQuery({
    queryKey: ['certificates'],
    queryFn: certificatesAPI.getAll,
  });

  const addCertificate = useMutation({
    mutationFn: certificatesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate added successfully');
    },
    onError: (error) => {
      console.error('Failed to add certificate:', error);
      toast.error('Failed to add certificate');
    },
  });

  const updateCertificate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => certificatesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update certificate:', error);
      toast.error('Failed to update certificate');
    },
  });

  const deleteCertificate = useMutation({
    mutationFn: certificatesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete certificate:', error);
      toast.error('Failed to delete certificate');
    },
  });

  return {
    certificates,
    isLoading,
    error,
    addCertificate: addCertificate.mutate,
    updateCertificate: updateCertificate.mutate,
    deleteCertificate: deleteCertificate.mutate,
    isAdding: addCertificate.isPending,
    isUpdating: updateCertificate.isPending,
    isDeleting: deleteCertificate.isPending,
    refetch,
  };
};
