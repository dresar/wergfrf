import { useQuery, useMutation } from '@tanstack/react-query';
import { messagesAPI } from '../services/api';
import { toast } from 'sonner';

export const useMessages = () => {
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: messagesAPI.getAll,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const sendMessage = useMutation({
    mutationFn: messagesAPI.create,
    onSuccess: () => {
      toast.success('Message sent successfully');
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  };
};
